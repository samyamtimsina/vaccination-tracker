import { prisma } from '../utils/prisma.js';
import { createChildSchema } from '../schemas/childSchema.js';
import { checkPermission, filterChildData } from '../utils/permissionService.js';
import {
  toMonths,
  mapVaccineNameToEnum,
  parseBsDateString,
  checkAllPrimaryComplete
} from '../utils/helpers.js';

async function prepareVaccinationCreateData(vaccines, user, administeredByUserId) {
  if (!vaccines) return [];

  // 1. Get latest vaccine schedule version
  //    Include the vaccineType relation to access the name and id
  const scheduleVersion = await prisma.vaccineScheduleVersion.findFirst({
    orderBy: { id: 'desc' },
    include: {
      doses: {
        include: {
          vaccineType: true // Include the related VaccineType model
        }
      }
    },
  });
  if (!scheduleVersion) throw new Error('No vaccine schedule found in the database');

  // 2. Fetch all vaccine types to create a name-to-ID map
  const vaccineTypes = await prisma.vaccineType.findMany();
  const vaccineNameToIdMap = new Map(vaccineTypes.map(vt => [vt.name, vt.id]));

  return Object.entries(vaccines).flatMap(([vaccineName, doses]) => {
    // 3. Find the ID for the current vaccine name
    const vaccineTypeId = vaccineNameToIdMap.get(vaccineName);

    // If the vaccine name from the payload doesn't exist in the database, skip it
    if (!vaccineTypeId) {
      console.warn(`Vaccine type '${vaccineName}' not found in database. Skipping.`);
      return [];
    }

    // 4. Get valid doses from schedule using the vaccineTypeId
    const validDoseNumbers = scheduleVersion.doses
      .filter(d => d.vaccineTypeId === vaccineTypeId)
      .map(d => d.doseNumber);

    return doses
      .map((doseObj) => {
        if (!doseObj?.date) return null;
        if (!['current', 'booster'].includes(doseObj.type)) return null;

        const doseNumber = doseObj.doseNumber;
        if (!validDoseNumbers.includes(doseNumber)) return null; // Reject invalid doseNumber

        const dateGiven = parseBsDateString(doseObj.date);
        if (!dateGiven) return null;

        // 5. Create the data object with the correct vaccineTypeId
        return {
          vaccineTypeId: vaccineTypeId, // <-- Use the correct ID here
          doseNumber,
          dateGiven,
          isComplete: true,
          remarks: doseObj.remarks || null,
          type: doseObj.type,
          createdById: user.id,
          administeredById: administeredByUserId,
        };
      })
      .filter(Boolean);
  });
}


// --- Calculate ChildDueVaccine entries based on schedule + catch-up rules
// --- Calculate ChildDueVaccine entries based on schedule + catch-up rules
export async function prepareChildDueVaccines(birthDateBs, scheduleVersionId = null) {
  const birthDate = parseBsDateString(birthDateBs);
  if (!birthDate) throw new Error('Invalid BS birthDate');

  const scheduleVersion = await prisma.vaccineScheduleVersion.findFirst({
    where: scheduleVersionId ? { id: scheduleVersionId } : undefined,
    orderBy: { id: 'desc' },
    include: { doses: true },
  });
  if (!scheduleVersion) throw new Error('No vaccine schedule found');

  return scheduleVersion.doses.map((dose) => {
    let dueDate = new Date(birthDate.getTime());
    if (dose.recommendedAtDays != null) dueDate.setDate(dueDate.getDate() + dose.recommendedAtDays);
    if (dose.recommendedAtWeeks != null) dueDate.setDate(dueDate.getDate() + dose.recommendedAtWeeks * 7);
    if (dose.recommendedAtMonths != null) dueDate.setMonth(dueDate.getMonth() + dose.recommendedAtMonths);
    if (dose.recommendedAtYears != null) dueDate.setFullYear(dueDate.getFullYear() + dose.recommendedAtYears);

    return {
      vaccineTypeId: dose.vaccineTypeId, // <-- This is the fix. Use the correct foreign key.
      doseNumber: dose.doseNumber,
      dueDate,
      isCompleted: false,
      scheduleVersion: scheduleVersion.id,
    };
  });
}
// --- Full createChild controller
export const createChild = async (req, res) => {
  console.log('req.user', req.user)
  try {
    const validationResult = createChildSchema.safeParse(req.body);
    if (!validationResult.success)
      return res.status(400).json({ error: 'Validation failed', details: validationResult.error.errors });

    const validatedData = validationResult.data;
    const birthDate = parseBsDateString(validatedData.birthDate);
    if (!birthDate) return res.status(400).json({ error: 'Invalid BS birthDate string' });

    const createdChild = await prisma.$transaction(async (tx) => {
      // --- Create Child ---
      const child = await tx.child.create({
        data: {
          isFromOtherMunicipality: validatedData.isFromOtherMunicipality || false,
          fullName: `${validatedData.firstName} ${validatedData.lastName}` || '',
          wardNumber:
            validatedData.wardNumber ??
            parseInt(req.user.wardId, 10),
          parentName: validatedData.parentName || '',
          tole: validatedData.tole || '',
          phoneNumber: validatedData.phoneNumber || '',
          gender: validatedData.gender,
          casteCode: parseInt(validatedData.casteCode, 10),
          birthDate,
          createdById: req.user.id,
          purnaKhop: false,
          remarks: validatedData.remarks || '',
          verifiedById: null,
        },
      });

      // --- Vaccination records ---
      const vaccinationCreateData = await prepareVaccinationCreateData(
        validatedData.vaccines,
        req.user,
        validatedData.administeredById
      );

      if (vaccinationCreateData.length) {
        const vaccinationsWithChildId = vaccinationCreateData.map((v) => ({
          ...v,
          citizenId: child.id,
          wardOfVaccination: req.user.wardId,
        }));
        await tx.vaccinationRecord.createMany({ data: vaccinationsWithChildId });
      }

      // --- Weight records ---
      if (validatedData.weightRecords?.length) {
        const weightData = validatedData.weightRecords.map((w) => ({
          childId: child.id,
          weight: w.weight,
          date: parseBsDateString(w.date),
          createdById: req.user.id,
          administeredById: validatedData.administeredById,
          wardOfVaccination: req.user.wardId,
        }));
        await tx.weightRecord.createMany({ data: weightData });
      }

      // --- ChildDueVaccine entries ---
      const dueVaccines = await prepareChildDueVaccines(validatedData.birthDate);
      if (dueVaccines.length) {
        const dueVaccinesWithChildId = dueVaccines.map((v) => ({ ...v, childId: child.id }));
        await tx.childDueVaccine.createMany({ data: dueVaccinesWithChildId });
      }

      // --- Catch-up deletion + lock logic ---
      for (const v of vaccinationCreateData) {
        const vaccineTypeId = v.vaccineTypeId;
        const primaryComplete = await checkAllPrimaryComplete(child.id, vaccineTypeId, tx);

        if (primaryComplete) {
          await tx.childDueVaccine.deleteMany({
            where: {
              childId: child.id,
              vaccineTypeId,
              isCompleted: false,
              isCatchUp: true,
            },
          });

          await tx.childDueVaccine.updateMany({
            where: { childId: child.id, vaccineTypeId },
            data: { catchUpLocked: true },
          });
        }
      }

      return await tx.child.findUnique({
        where: { id: child.id },
        include: {
          createdBy: { select: { id: true, name: true } },
          verifiedBy: { select: { id: true, name: true } },
          vaccinations: { include: { createdBy: true, administeredBy: true } },
          weightRecords: { include: { createdBy: true, administeredBy: true } },
          dueVaccines: true,
        },
      });
    });

    res.status(201).json(createdChild);
  } catch (error) {
    console.error('Child creation error:', error);
    res.status(500).json({ error: 'Child creation failed', details: error.message });
  }
};




export const updateChildPurnaKhop = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // status should be true or false
    const verifiedById = req.user.id; // Get the user who is making this update

    if (typeof status !== 'boolean') {
      return res.status(400).json({ error: 'Status must be a boolean.' });
    }

    const updatedChild = await prisma.child.update({
      where: { id: id },
      data: {
        purnaKhop: status,
        verifiedById: verifiedById, // Record who verified the status
      },
    });

    res.status(200).json(updatedChild);
  } catch (error) {
    console.error('PurnaKhop update error:', error);
    res.status(500).json({ error: 'Failed to update PurnaKhop status' });
  }
};


// Controller to get all children, including their vaccination records
// Get all children (with schedule & nested data)
export const getAllChildren = async (req, res) => {
  try {
    const currentUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let where = {};
    if (currentUser.role === 'WARD_OFFICER') {
      where.wardNumber = currentUser.wardId;
    }

    const [total, children] = await Promise.all([
      prisma.child.count({ where }),
      prisma.child.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          sewaDartaNumber: true,
          fullName: true,
          wardNumber: true,
          birthDate: true,
          purnaKhop: true,
          gender: true,
          parentName: true,
          tole: true,
          phoneNumber: true,
          isFromOtherMunicipality: true,
          casteCode: true,
          createdAt: true,
          _count: { select: { vaccinations: true } },
          // weightRecords: {
          //   select: {
          //     id: true,
          //     createdAt: true,
          //     createdBy: { select: { id: true, name: true } },
          //     administeredBy: { select: { id: true, name: true } },
          //     date: true,
          //     weight: true,
          //   },
          //   orderBy: { date: 'desc' },
          //   take: 1,
          // },
          // vaccinations: {
          //   select: {
          //     id: true,
          //     createdAt: true,
          //     createdBy: { select: { id: true, name: true } },
          //     administeredBy: { select: { id: true, name: true } },
          //     vaccineType: true,
          //     dateGiven: true,
          //     doseNumber: true,
          //   },
          // },
          // dueVaccines: {
          //   select: {
          //     id: true,
          //     vaccineTypeId: true,
          //     doseNumber: true,
          //     dueDate: true,
          //     isCompleted: true,
          //     isCatchUp: true,
          //     catchUpLocked: true,
          //   },
          // },
          createdBy: { select: { id: true, name: true } },
          verifiedBy: { select: { id: true, name: true } },
        },
      }),
    ]);

    const childrenWithWhatsLeft = children.map(child => {
      const whatsLeft = (child.dueVaccines || []).filter(dv => !dv.isCompleted).length;
      return { ...child, whatsLeft };
    });

    if (!children.length && page === 1) {
      return res.status(404).json({ error: 'No children found' });
    }

    res.status(200).json({ children: childrenWithWhatsLeft, total, page, limit });
  } catch (error) {
    console.error('Error fetching all children:', error);
    res.status(500).json({ error: 'Failed to retrieve children data', details: error.message });
  }
};

// Get children for a specific ward (returns the SAME data shape as getAllChildren)
export const getWardChildren = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser?.wardId) {
      return res.status(401).json({ error: 'Unauthorized. User or wardId not found.' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const where = { wardNumber: currentUser.wardId };

    const [total, children] = await Promise.all([
      prisma.child.count({ where }),
      prisma.child.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          sewaDartaNumber: true,
          fullName: true,
          wardNumber: true,
          birthDate: true,
          purnaKhop: true,
          gender: true,
          parentName: true,
          tole: true,
          phoneNumber: true,
          isFromOtherMunicipality: true,
          casteCode: true,
          createdAt: true,
          _count: { select: { vaccinations: true } },
          // weightRecords: {
          //   select: {
          //     id: true,
          //     createdAt: true,
          //     createdBy: { select: { id: true, name: true } },
          //     administeredBy: { select: { id: true, name: true } },
          //     date: true,
          //     weight: true,
          //   },
          //   orderBy: { date: 'desc' },
          //   take: 1,
          // },
          // vaccinations: {
          //   select: {
          //     id: true,
          //     createdAt: true,
          //     createdBy: { select: { id: true, name: true } },
          //     administeredBy: { select: { id: true, name: true } },
          //     vaccineType: true,
          //     dateGiven: true,
          //     doseNumber: true,
          //   },
          // },
          // dueVaccines: {
          //   select: {
          //     id: true,
          //     vaccineTypeId: true,
          //     doseNumber: true,
          //     dueDate: true,
          //     isCompleted: true,
          //     isCatchUp: true,
          //     catchUpLocked: true,
          //   },
          // },
          createdBy: { select: { id: true, name: true } },
          verifiedBy: { select: { id: true, name: true } },
        },
      }),
    ]);

    const childrenWithWhatsLeft = children.map(child => {
      const whatsLeft = (child.dueVaccines || []).filter(dv => !dv.isCompleted).length;
      return { ...child, whatsLeft };
    });

    res.status(200).json({ children: childrenWithWhatsLeft, total, page, limit });
  } catch (error) {
    console.error('Error fetching ward children:', error);
    res.status(500).json({ error: 'Failed to fetch ward children', details: error.message });
  }
};

// Get single child (by ID or Sewa Darta Number) -- returns the SAME data shape as getAllChildren
// Get single child (by ID or Sewa Darta Number)
export const getChild = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const isNumber = /^\d+$/.test(id);

    // Step 1: fetch all data in a single, efficient query
    const child = await prisma.child.findUnique({
      where: isNumber ? { sewaDartaNumber: parseInt(id, 10) } : { id },
      include: {
        createdBy: { select: { id: true, name: true } },
        verifiedBy: { select: { id: true, name: true } },
        weightRecords: {
          orderBy: { date: "desc" },
          select: {
            id: true,
            createdAt: true,
            createdBy: { select: { id: true, name: true } },
            administeredBy: { select: { id: true, name: true } },
            date: true,
            weight: true,
          },
        },
        vaccinations: {
          select: {
            id: true,
            createdAt: true,
            createdBy: { select: { id: true, name: true } },
            administeredBy: { select: { id: true, name: true } },
            vaccineType: true,
            dateGiven: true,
            doseNumber: true,
          },
        },
        dueVaccines: {
          select: {
            id: true,
            vaccineTypeId: true,
            doseNumber: true,
            dueDate: true,
            isCompleted: true,
            isCatchUp: true,
            catchUpLocked: true,
          },
        },
      },
    });

    if (!child) return res.status(404).json({ error: "Child not found" });

    if (!checkPermission(currentUser, "read", child)) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have permission to view this child." });
    }

    // Step 2: process the fetched data
    const whatsLeft = child.dueVaccines.filter((dv) => !dv.isCompleted).length;

    // Separate the related data before filtering the main child object
    const { vaccinations, weightRecords, dueVaccines, ...childData } = child;

    const filteredChild = {
      ...filterChildData(currentUser, childData),
      weightRecords,
      vaccinations,
      dueVaccines,
      whatsLeft,
    };

    res.status(200).json(filteredChild);
  } catch (error) {
    console.error("Error fetching single child:", error);
    res.status(500).json({
      error: "Failed to retrieve child data",
      details: error.message,
    });
  }
};



// Search children (with query filters)
export const searchChildren = async (req, res) => {
  try {
    const { name, phoneNumber, sewaDartaNumber, gender, wardId, createdByMe } = req.query;
    const currentUser = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const whereClause = {};

    if (currentUser.role === 'WARD_OFFICER' && !wardId) {
      whereClause.wardNumber = currentUser.wardId;
    } else if (wardId && wardId !== 'all') {
      whereClause.wardNumber = parseInt(wardId, 10);
    }

    if (name) whereClause.fullName = { contains: name, mode: 'insensitive' };
    if (phoneNumber) whereClause.phoneNumber = { contains: phoneNumber, mode: 'insensitive' };
    if (sewaDartaNumber) whereClause.sewaDartaNumber = parseInt(sewaDartaNumber, 10);
    if (gender) whereClause.gender = gender.toUpperCase();
    if (createdByMe === 'true') whereClause.createdById = currentUser.id;

    const [total, children] = await Promise.all([
      prisma.child.count({ where: whereClause }),
      prisma.child.findMany({
        where: whereClause,
        skip,
        take: limit,
        select: {
          id: true,
          sewaDartaNumber: true,
          fullName: true,
          wardNumber: true,
          birthDate: true,
          purnaKhop: true,
          gender: true,
          parentName: true,
          tole: true,
          phoneNumber: true,
          isFromOtherMunicipality: true,
          casteCode: true,
          createdBy: { select: { id: true, name: true } },
          verifiedBy: { select: { id: true, name: true } },
          _count: { select: { vaccinations: true } },
          // weightRecords: {
          //   select: { weight: true, date: true },
          //   orderBy: { date: 'desc' },
          //   take: 1,
          // },
          // dueVaccines: true, // Kept as per original, but can remove if not needed for search results
        },
      }),
    ]);

    res.status(200).json({ children, total, page, limit });
  } catch (error) {
    console.error('Error searching children:', error);
    res.status(500).json({ error: 'Failed to perform search', details: error.message });
  }
};

//Search ward children
// Search ward children (strictly by user's ward)
export const searchWardChildren = async (req, res) => {
  try {
    const { name, phoneNumber, sewaDartaNumber, gender, createdByMe } = req.query;
    const currentUser = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Always restrict to the ward of the logged-in user
    const whereClause = { wardNumber: currentUser.wardId };

    if (name) whereClause.fullName = { startsWith: name.trim(), mode: 'insensitive' };
    if (phoneNumber) whereClause.phoneNumber = { contains: phoneNumber, mode: 'insensitive' };
    if (sewaDartaNumber) whereClause.sewaDartaNumber = parseInt(sewaDartaNumber, 10);
    if (gender) whereClause.gender = gender.toUpperCase();
    if (createdByMe === 'true') whereClause.createdById = currentUser.id;

    const [total, children] = await Promise.all([
      prisma.child.count({ where: whereClause }),
      prisma.child.findMany({
        where: whereClause,
        skip,
        take: limit,
        select: {
          id: true,
          sewaDartaNumber: true,
          fullName: true,
          wardNumber: true,
          birthDate: true,
          purnaKhop: true,
          gender: true,
          parentName: true,
          tole: true,
          phoneNumber: true,
          isFromOtherMunicipality: true,
          casteCode: true,
          createdBy: { select: { id: true, name: true } },
          verifiedBy: { select: { id: true, name: true } },
          _count: { select: { vaccinations: true } },
        },
      }),
    ]);

    res.status(200).json({ children, total, page, limit });
  } catch (error) {
    console.error('Error searching ward children:', error);
    res.status(500).json({ error: 'Failed to perform ward search', details: error.message });
  }
};


//update child controller declarations and helpers
// --- Helpers ---
// --- Helpers ---
async function getLatestSchedule() {
  const scheduleVersion = await prisma.vaccineScheduleVersion.findFirst({
    orderBy: { id: 'desc' },
    include: { doses: { include: { vaccineType: true } } },
  });
  if (!scheduleVersion) throw new Error('No vaccine schedule found');
  return scheduleVersion;
}

// // Map vaccine name from frontend to DB ID
// async function mapVaccineNamesToIds(vaccineNames) {
//   const vaccineTypes = await prisma.vaccineType.findMany();
//   const nameToId = new Map(vaccineTypes.map((vt) => [vt.name, vt.id]));
//   const result = {};
//   for (const name of vaccineNames) {
//     const id = nameToId.get(name);
//     if (id) result[name] = id;
//   }
//   return result;
// }

// Prepare vaccination update/create data
async function prepareVaccinationUpdateData(childId, vaccinations, administeredById) {
  if (!vaccinations || !vaccinations.length) return [];

  const scheduleVersion = await getLatestSchedule();

  return vaccinations
    .filter((v) => v.vaccineTypeId && v.doseNumber && v.dateGiven) // Ensure required fields exist
    .map((v) => {
      // Find the scheduled dose in the vaccine schedule
      const scheduledDose = scheduleVersion.doses.find(
        (d) => d.vaccineTypeId === v.vaccineTypeId && d.doseNumber === v.doseNumber
      );

      if (!scheduledDose) {
        console.warn(`Invalid dose: vaccineTypeId=${v.vaccineTypeId}, doseNumber=${v.doseNumber}`);
        return null; // Skip invalid doses
      }

      return {
        vaccineTypeId: v.vaccineTypeId,
        doseNumber: v.doseNumber,
        dateGiven: parseBsDateString(v.dateGiven),
        remarks: v.remarks || null,
        citizenId: childId,
        administeredById,
        createdById: v.id ? undefined : administeredById, // Use administeredById for new records
      };
    })
    .filter(Boolean); // Remove null entries
}

// --- Controller ---
export const updateChild = async (req, res) => {
  const { id } = req.params;
  const sewaDartaNumber = parseInt(id, 10);
  const { vaccinations, weightRecords, administeredById, firstName, lastName, ...demographicData } = req.body;
  console.log('req.boyd', req.body)
  const currentUser = req.user;

  try {
    const existingChild = await prisma.child.findUnique({
      where: { sewaDartaNumber },
      include: { vaccinations: true, weightRecords: true },
    });

    if (!existingChild) return res.status(404).json({ error: 'Child not found' });

    const hasPermission = checkPermission(currentUser, 'update', existingChild, demographicData);
    if (!hasPermission) return res.status(403).json({ error: 'Not authorized to edit this child\'s data.' });

    await prisma.$transaction(async (tx) => {
      // --- Update demographic data ---
      const isSameWard = existingChild.wardNumber === currentUser.wardId;
      if (isSameWard || currentUser.role === 'SUPER_ADMIN', 'WARD_OFFICER') {
        const updateData = {
          fullName: `${firstName || ''} ${lastName || ''}`.trim(),
          ...(demographicData.birthDate ? { birthDate: parseBsDateString(demographicData.birthDate) } : {}),
          ...(demographicData.phoneNumber ? { phoneNumber: demographicData.phoneNumber } : {}),
          ...(demographicData.gender ? { gender: demographicData.gender } : {}),
          ...(demographicData.wardNumber ? { wardNumber: demographicData.wardNumber } : {}),
          ...(demographicData.casteCode ? { casteCode: demographicData.casteCode } : {}),
          ...(demographicData.parentName ? { parentName: demographicData.parentName } : {}),
          ...(demographicData.tole ? { tole: demographicData.tole } : {}),
          ...(typeof demographicData.isFromOtherMunicipality === 'boolean' ? { isFromOtherMunicipality: demographicData.isFromOtherMunicipality } : {}),
        };
        await tx.child.update({ where: { sewaDartaNumber }, data: updateData });
      }

      // --- Vaccinations ---
      const updatedVaccinations = await prepareVaccinationUpdateData(existingChild.id, vaccinations, administeredById);

      for (const v of updatedVaccinations) {
        const existingVaccine = existingChild.vaccinations.find(
          (ev) => ev.vaccineTypeId === v.vaccineTypeId && ev.doseNumber === v.doseNumber
        );

        if (existingVaccine) {
          await tx.vaccinationRecord.update({ where: { id: existingVaccine.id }, data: { ...v, isComplete: true } });
        } else if (v.dateGiven) {
          await tx.vaccinationRecord.create({
            data: {
              ...v,
              citizenId: existingChild.id,
              createdById: currentUser.id,
              isComplete: true,
              wardOfVaccination: currentUser.wardId,
            },
          });
        }
      }

      // --- Weight Records ---
      const incomingWeights = Array.isArray(weightRecords) ? weightRecords : [];
      const incomingIds = incomingWeights.filter(w => w.id).map(w => w.id);

      if (existingChild.weightRecords.length > 0) {
        const toDelete = existingChild.weightRecords.filter(w => !incomingIds.includes(w.id)).map(w => w.id);
        if (toDelete.length) await tx.weightRecord.deleteMany({ where: { id: { in: toDelete }, childId: existingChild.id } });
      }

      for (const w of incomingWeights) {
        if (!w.date) continue;
        const parsedDate = parseBsDateString(w.date);
        if (w.id) {
          await tx.weightRecord.update({
            where: { id: w.id },
            data: { weight: w.weight, date: parsedDate, administeredById, wardOfVaccination: currentUser.wardId },
          });
        } else {
          await tx.weightRecord.create({
            data: { childId: existingChild.id, weight: w.weight, date: parsedDate, administeredById, wardOfVaccination: currentUser.wardId, createdById: currentUser.id },
          });
        }
      }

      // --- ChildDueVaccines ---
      if (demographicData.birthDate) {
        const childDueVaccines = await prepareChildDueVaccines(demographicData.birthDate);
        const dueWithChildId = childDueVaccines.map(v => ({ ...v, childId: existingChild.id }));
        await tx.childDueVaccine.deleteMany({ where: { childId: existingChild.id } });
        await tx.childDueVaccine.createMany({ data: dueWithChildId });
      }

      // --- Catch-up deletion + lock logic ---
      const vaccineTypeIds = [...new Set(updatedVaccinations.map(v => v.vaccineTypeId))];
      for (const vaccineTypeId of vaccineTypeIds) {
        const primaryComplete = await checkAllPrimaryComplete(existingChild.id, vaccineTypeId, tx);

        if (primaryComplete) {
          await tx.childDueVaccine.deleteMany({
            where: {
              childId: existingChild.id,
              vaccineTypeId,
              isCompleted: false,
              isCatchUp: true,
            },
          });

          await tx.childDueVaccine.updateMany({
            where: { childId: existingChild.id, vaccineTypeId },
            data: { catchUpLocked: true },
          });
        }
      }
    });

    const updatedChild = await prisma.child.findUnique({
      where: { sewaDartaNumber },
      include: { vaccinations: true, weightRecords: true, dueVaccines: true },
    });

    res.status(200).json(updatedChild);

  } catch (error) {
    console.error('Error updating child:', error);
    res.status(500).json({ error: 'Failed to update child data', details: error.message });
  }
};
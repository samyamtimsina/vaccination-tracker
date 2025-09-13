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
          wardNumber: parseInt(validatedData.wardNumber, 10),
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
        // We use a single 'select' statement to retrieve all the requested fields
        // and relations, as Prisma does not allow 'select' and 'include' at the same
        // top level.
        select: {
          // Original scalar fields
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

          // Count of vaccinations, as in the original query
          _count: { select: { vaccinations: true } },

          // Select for the latest weight record, as in the original query
          weightRecords: {
            select: {
              id: true, // Select at least one field for the vaccination record itself
              createdAt: true, // It's often useful to include a timestamp
              createdBy: { select: { id: true, name: true } },
              administeredBy: { select: { id: true, name: true } },
              date: true,
            },
            orderBy: { date: 'desc' },

            take: 1,
          },

          // Included vaccinations with nested select for createdBy and administeredBy
          vaccinations: {
            select: {
              id: true, // Select at least one field for the vaccination record itself
              createdAt: true, // It's often useful to include a timestamp
              createdBy: { select: { id: true, name: true } },
              administeredBy: { select: { id: true, name: true } },
              vaccineType: true,
              dateGiven: true,
            },
          },

          // Included all fields for dueVaccines
          dueVaccines: true,

          // Included createdBy user with specific fields
          createdBy: { select: { id: true, name: true } },

          // Included verifiedBy user with specific fields
          verifiedBy: { select: { id: true, name: true } },
        },
      }),
    ]);


    if (!children.length && page === 1) {
      return res.status(404).json({ error: 'No children found' });
    }

    res.status(200).json({ children, total, page, limit });
  } catch (error) {
    console.error('Error fetching all children:', error);
    res.status(500).json({ error: 'Failed to retrieve children data', details: error.message });
  }
};

// Get children for a specific ward
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
        // We use a single 'select' statement to retrieve all the requested fields
        // and relations, as Prisma does not allow 'select' and 'include' at the same
        // top level.
        select: {
          // Original scalar fields
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

          // Count of vaccinations, as in the original query
          _count: { select: { vaccinations: true } },

          // Select for the latest weight record, as in the original query
          weightRecords: {
            select: { weight: true, date: true },
            orderBy: { date: 'desc' },
            take: 1,
          },

          // Included vaccinations with nested select for createdBy and administeredBy
          vaccinations: {
            select: {
              id: true, // Select at least one field for the vaccination record itself
              createdAt: true, // It's often useful to include a timestamp
              createdBy: { select: { id: true, name: true } },
              administeredBy: { select: { id: true, name: true } },
            },
          },

          // Included all fields for dueVaccines
          dueVaccines: true,

          // Included createdBy user with specific fields
          createdBy: { select: { id: true, name: true } },

          // Included verifiedBy user with specific fields
          verifiedBy: { select: { id: true, name: true } },
        },
      }),
    ]);

    res.status(200).json({ children, total, page, limit });
  } catch (error) {
    console.error('Error fetching ward children:', error);
    res.status(500).json({ error: 'Failed to fetch ward children', details: error.message });
  }
};

// Get single child (by ID or Sewa Darta Number)
export const getChild = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const isNumber = /^\d+$/.test(id);

    const child = await prisma.child.findUnique({
      where: isNumber ? { sewaDartaNumber: parseInt(id, 10) } : { id },
      include: {
        vaccinations: {
          include: {
            createdBy: { select: { id: true, name: true } },
            administeredBy: { select: { id: true, name: true } },
          },
        },
        weightRecords: {
          include: {
            createdBy: { select: { id: true, name: true } },
            administeredBy: { select: { id: true, name: true } },
          },
        },
        dueVaccines: true, // This already includes the data, but you can select specific fields
        createdBy: { select: { id: true, name: true } },
        verifiedBy: { select: { id: true, name: true } },
      },
    });

    if (!child) return res.status(404).json({ error: 'Child not found' });

    // Filter data based on read permissions
    if (!checkPermission(currentUser, 'read', child)) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to view this child.' });
    }

    const filteredChild = filterChildData(currentUser, child);
    res.status(200).json(filteredChild);
  } catch (error) {
    console.error('Error fetching single child:', error);
    res.status(500).json({ error: 'Failed to retrieve child data', details: error.message });
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
          weightRecords: {
            select: { weight: true, date: true },
            orderBy: { date: 'desc' },
            take: 1,
          },
          dueVaccines: true, // Kept as per original, but can remove if not needed for search results
        },
      }),
    ]);

    res.status(200).json({ children, total, page, limit });
  } catch (error) {
    console.error('Error searching children:', error);
    res.status(500).json({ error: 'Failed to perform search', details: error.message });
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

// Map vaccine name from frontend to DB ID
async function mapVaccineNamesToIds(vaccineNames) {
  const vaccineTypes = await prisma.vaccineType.findMany();
  const nameToId = new Map(vaccineTypes.map((vt) => [vt.name, vt.id]));
  const result = {};
  for (const name of vaccineNames) {
    const id = nameToId.get(name);
    if (id) result[name] = id;
  }
  return result;
}

// Prepare vaccination update/create data
async function prepareVaccinationUpdateData(childId, vaccinations, administeredById) {
  if (!vaccinations || !vaccinations.length) return [];

  const scheduleVersion = await getLatestSchedule();

  // Build vaccine name -> ID map
  const vaccineNames = vaccinations.map((v) => v.vaccineType);
  const vaccineNameToIdMap = await mapVaccineNamesToIds(vaccineNames);

  return vaccinations.flatMap((v) => {
    const vaccineTypeId = vaccineNameToIdMap[v.vaccineType];
    if (!vaccineTypeId) return []; // skip unknown vaccines

    const schedule = scheduleVersion.doses
      .filter((d) => d.vaccineTypeId === vaccineTypeId)
      .sort((a, b) => a.doseNumber - b.doseNumber);

    const scheduledDose = schedule.find((d) => d.doseNumber === v.doseNumber);
    if (!scheduledDose) return []; // skip invalid doseNumber

    return {
      ...v,
      vaccineTypeId,
      citizenId: childId,
      dateGiven: v.dateGiven ? parseBsDateString(v.dateGiven) : null,
      administeredById,
      createdById: v.id ? undefined : v.createdById, // for new records
    };
  }).filter(Boolean);
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
      if (isSameWard || currentUser.role === 'SUPER_ADMIN') {
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
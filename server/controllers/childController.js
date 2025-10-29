import { prisma } from '../utils/prisma.js';
import { createChildSchema } from '../schemas/childSchema.js';
import { checkPermission, filterChildData } from '../utils/permissionService.js';
import {
  toMonths,
  mapVaccineNameToEnum,
  parseBsDateString,
  checkAllPrimaryComplete
} from '../utils/helpers.js';

// --- Prepare vaccination data for child creation ---
async function prepareVaccinationCreateData(vaccines, user, administeredByUserId) {
  if (!vaccines) return [];

  const scheduleVersion = await prisma.vaccineScheduleVersion.findFirst({
    orderBy: { id: 'desc' },
    include: { doses: { include: { vaccineType: true } } },
  });
  if (!scheduleVersion) throw new Error('No vaccine schedule found');

  const vaccineTypes = await prisma.vaccineType.findMany();
  const nameToId = new Map(vaccineTypes.map(vt => [vt.name, vt.id]));

  return Object.entries(vaccines).flatMap(([vaccineName, doses]) => {
    const vaccineTypeId = nameToId.get(vaccineName);
    if (!vaccineTypeId) return [];

    const validDoseNumbers = scheduleVersion.doses
      .filter(d => d.vaccineTypeId === vaccineTypeId)
      .map(d => d.doseNumber);

    return doses
      .map((doseObj) => {
        if (!doseObj?.date) return null;
        if (!['current', 'booster'].includes(doseObj.type)) return null;
        if (!validDoseNumbers.includes(doseObj.doseNumber)) return null;

        const dateGiven = parseBsDateString(doseObj.date);
        if (!dateGiven) return null;

        const isExternal = !!doseObj.isExternallyAdministered;
        const externalBy = doseObj.externalAdministeredBy?.trim() || null;

        return {
          vaccineTypeId,
          doseNumber: doseObj.doseNumber,
          dateGiven,
          isComplete: true,
          remarks: doseObj.remarks || null,
          type: doseObj.type,
          createdById: user.id,
          administeredById: isExternal ? null : administeredByUserId,
          isExternallyAdministered: isExternal,
          externalAdministeredBy: externalBy,
        };
      })
      .filter(Boolean);
  });
}

// --- Prepare due vaccines based on schedule ---
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
      vaccineTypeId: dose.vaccineTypeId,
      doseNumber: dose.doseNumber,
      dueDate,
      isCompleted: false,
      scheduleVersion: scheduleVersion.id,
    };
  });
}

// --- Create Child Controller ---
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
          wardNumber: validatedData.wardNumber ?? parseInt(req.user.wardId, 10),
          parentName: validatedData.parentName || '',
          tole: validatedData.tole || '',
          phoneNumber: validatedData.phoneNumber || '',
          gender: validatedData.gender,
          casteCode: parseInt(validatedData.casteCode, 10),
          birthDate,
          createdById: req.user.id,
          purnaKhop: false,
          remarks: validatedData.remarks || '',
        },
      });

      // --- Vaccination records ---
      const vaccinationCreateData = await prepareVaccinationCreateData(
        validatedData.vaccines,
        req.user,
        validatedData.administeredById
      );

      const vaccinationsWithChildId = vaccinationCreateData.map(v => ({
        ...v,
        citizenId: child.id,
        wardOfVaccination: req.user.wardId,
      }));

      if (vaccinationsWithChildId.length) {
        await tx.vaccinationRecord.createMany({ data: vaccinationsWithChildId });

        // 🧠 Instead of deleting, mark corresponding due vaccines as completed
        for (const v of vaccinationsWithChildId) {
          await tx.childDueVaccine.updateMany({
            where: {
              childId: child.id,
              vaccineTypeId: v.vaccineTypeId,
              doseNumber: v.doseNumber,
            },
            data: { isCompleted: true },
          });
        }
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

      // --- ChildDueVaccine entries (filter out already given vaccines) ---
      const dueVaccines = await prepareChildDueVaccines(validatedData.birthDate);

      const givenVaccineSet = new Set(
        vaccinationCreateData.map(v => `${v.vaccineTypeId}-${v.doseNumber}`)
      );

      const filteredDueVaccines = dueVaccines.filter(
        dv => !givenVaccineSet.has(`${dv.vaccineTypeId}-${dv.doseNumber}`)
      );

      const completedDueVaccines = dueVaccines
        .filter(dv => givenVaccineSet.has(`${dv.vaccineTypeId}-${dv.doseNumber}`))
        .map(dv => ({ ...dv, childId: child.id, isCompleted: true }));

      const dueToInsert = [
        ...filteredDueVaccines.map(v => ({ ...v, childId: child.id })),
        ...completedDueVaccines,
      ];

      if (dueToInsert.length) {
        await tx.childDueVaccine.createMany({ data: dueToInsert });
        console.log(`Created ${dueToInsert.length} due vaccines (including completed ones).`);
      }

      // 🧩 CATCH-UP DELETION + LOCK LOGIC
      for (const v of vaccinationCreateData) {
        const primaryComplete = await checkAllPrimaryComplete(child.id, v.vaccineTypeId, tx);
        if (primaryComplete) {
          await tx.childDueVaccine.deleteMany({
            where: {
              childId: child.id,
              vaccineTypeId: v.vaccineTypeId,
              isCatchUp: true
            },
          });
          await tx.childDueVaccine.updateMany({
            where: { childId: child.id, vaccineTypeId: v.vaccineTypeId },
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
    const { status } = req.body;
    const verifiedById = req.user.id;

    if (typeof status !== 'boolean') {
      return res.status(400).json({ error: 'Status must be a boolean.' });
    }

    const updatedChild = await prisma.child.update({
      where: { id: id },
      data: {
        purnaKhop: status,
        verifiedById: verifiedById,
      },
    });

    res.status(200).json(updatedChild);
  } catch (error) {
    console.error('PurnaKhop update error:', error);
    res.status(500).json({ error: 'Failed to update PurnaKhop status' });
  }
};

// Get all children
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
          _count: { select: { vaccinations: true, weightRecords: true } },
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

// Get single child
export const getChild = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const isNumber = /^\d+$/.test(id);

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
            remarks: true,
            isExternallyAdministered: true,
            externalAdministeredBy: true,
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
      return res.status(403).json({ error: "Forbidden: You do not have permission to view this child." });
    }

    const whatsLeft = child.dueVaccines.filter((dv) => !dv.isCompleted).length;
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

// Search children
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
        },
      }),
    ]);

    res.status(200).json({ children, total, page, limit });
  } catch (error) {
    console.error('Error searching children:', error);
    res.status(500).json({ error: 'Failed to perform search', details: error.message });
  }
};

// Search ward children
export const searchWardChildren = async (req, res) => {
  try {
    const { name, phoneNumber, sewaDartaNumber, gender, createdByMe } = req.query;
    const currentUser = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

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

// --- Update Child Helpers ---
async function getLatestSchedule() {
  const scheduleVersion = await prisma.vaccineScheduleVersion.findFirst({
    orderBy: { id: 'desc' },
    include: { doses: { include: { vaccineType: true } } },
  });
  if (!scheduleVersion) throw new Error('No vaccine schedule found');
  return scheduleVersion;
}

async function prepareVaccinationUpdateData(childId, vaccinations, administeredById) {
  if (!vaccinations?.length) return [];

  const scheduleVersion = await getLatestSchedule();
  return vaccinations
    .filter(v => v.vaccineTypeId && v.doseNumber && v.dateGiven)
    .map(v => {
      const scheduledDose = scheduleVersion.doses.find(
        d => d.vaccineTypeId === v.vaccineTypeId && d.doseNumber === v.doseNumber
      );
      if (!scheduledDose) return null;

      const isExternal = !!v.isExternallyAdministered;
      const externalBy = v.externalAdministeredBy?.trim() || null;

      return {
        vaccineTypeId: v.vaccineTypeId,
        doseNumber: v.doseNumber,
        dateGiven: parseBsDateString(v.dateGiven),
        remarks: v.remarks || null,
        citizenId: childId,
        administeredById: isExternal ? null : administeredById,
        createdById: v.id ? undefined : administeredById,
        isExternallyAdministered: isExternal,
        externalAdministeredBy: externalBy,
        isComplete: true,
      };
    })
    .filter(Boolean);
}

export const updateChild = async (req, res) => {
  const { id } = req.params;
  const sewaDartaNumber = parseInt(id, 10);
  const { vaccinations, weightRecords, administeredById, firstName, lastName, ...demographicData } = req.body;
  const currentUser = req.user;

  console.log('=== UPDATE CHILD STARTED ===');
  console.log('Request Params:', { id, sewaDartaNumber });
  console.log('Request Body Breakdown:', {
    vaccinations: vaccinations ? `${vaccinations.length || 0} items` : 'undefined',
    weightRecords: weightRecords ? `${weightRecords.length || 0} items` : 'undefined',
    administeredById,
    firstName,
    lastName,
    demographicData: Object.keys(demographicData).length > 0 ? demographicData : 'empty',
  });
  console.log('Current User:', { id: currentUser?.id, role: currentUser?.role, wardId: currentUser?.wardId });

  try {
    console.log('Fetching existing child with sewaDartaNumber:', sewaDartaNumber);
    const existingChild = await prisma.child.findUnique({
      where: { sewaDartaNumber },
      include: { vaccinations: true, weightRecords: true },
    });

    if (!existingChild) {
      console.log('ERROR: Child not found for sewaDartaNumber:', sewaDartaNumber);
      return res.status(404).json({ error: 'Child not found' });
    }

    console.log('Existing Child Found:', {
      id: existingChild.id,
      sewaDartaNumber: existingChild.sewaDartaNumber,
      fullName: existingChild.fullName,
      wardNumber: existingChild.wardNumber,
      vaccinationsCount: existingChild.vaccinations?.length || 0,
      weightRecordsCount: existingChild.weightRecords?.length || 0,
    });

    console.log('Checking permissions...');
    const hasPermission = checkPermission(currentUser, 'update', existingChild, demographicData);
    console.log('Permission Check Result:', hasPermission);
    if (!hasPermission) {
      console.log('ERROR: Permission denied for user:', currentUser.id);
      return res.status(403).json({ error: 'Not authorized to edit this child\'s data.' });
    }

    console.log('Starting Prisma transaction...');
    await prisma.$transaction(async (tx) => {
      console.log('Transaction started successfully.');

      // --- Update demographic data ---
      const isSameWard = existingChild.wardNumber === currentUser.wardId;
      console.log('Ward Check:', { existingChildWard: existingChild.wardNumber, userWard: currentUser.wardId, isSameWard, isSuperAdmin: currentUser.role === 'SUPER_ADMIN' });

      if (isSameWard || currentUser.role === 'SUPER_ADMIN') {
        console.log('Updating demographic data (authorized)...');
        const updateData = {};

        if (firstName !== undefined || lastName !== undefined) {
          updateData.fullName = `${firstName || ''} ${lastName || ''}`.trim();
          console.log('Updating fullName:', updateData.fullName);
        }

        if (demographicData.birthDate !== undefined) {
          updateData.birthDate = parseBsDateString(demographicData.birthDate);
          console.log('Updating birthDate (parsed):', updateData.birthDate);
        }
        if (demographicData.phoneNumber !== undefined) {
          updateData.phoneNumber = demographicData.phoneNumber;
          console.log('Updating phoneNumber:', updateData.phoneNumber);
        }
        if (demographicData.gender !== undefined) {
          updateData.gender = demographicData.gender;
          console.log('Updating gender:', updateData.gender);
        }
        if (demographicData.wardNumber !== undefined) {
          updateData.wardNumber = demographicData.wardNumber;
          console.log('Updating wardNumber:', updateData.wardNumber);
        }
        if (demographicData.casteCode !== undefined) {
          updateData.casteCode = demographicData.casteCode;
          console.log('Updating casteCode:', updateData.casteCode);
        }
        if (demographicData.parentName !== undefined) {
          updateData.parentName = demographicData.parentName;
          console.log('Updating parentName:', updateData.parentName);
        }
        if (demographicData.tole !== undefined) {
          updateData.tole = demographicData.tole;
          console.log('Updating tole:', updateData.tole);
        }
        if (demographicData.isFromOtherMunicipality !== undefined) {
          updateData.isFromOtherMunicipality = demographicData.isFromOtherMunicipality;
          console.log('Updating isFromOtherMunicipality:', updateData.isFromOtherMunicipality);
        }
        if (demographicData.remarks !== undefined) {
          updateData.remarks = demographicData.remarks;
          console.log('Updating remarks:', updateData.remarks);
        }

        console.log('Final updateData object:', updateData);
        if (Object.keys(updateData).length > 0) {
          console.log('Executing child.update...');
          await tx.child.update({ where: { sewaDartaNumber }, data: updateData });
          console.log('Demographic update completed successfully.');
        } else {
          console.log('No demographic data to update.');
        }
      } else {
        console.log('Skipping demographic update: Not same ward and not super admin.');
      }

      // --- Vaccinations ---
      console.log('Preparing vaccination update data...');
      const updatedVaccinations = await prepareVaccinationUpdateData(existingChild.id, vaccinations, administeredById);
      console.log('Prepared updatedVaccinations:', updatedVaccinations.map(v => ({ vaccineTypeId: v.vaccineTypeId, doseNumber: v.doseNumber, dateGiven: v.dateGiven, isExternallyAdministered: v.isExternallyAdministered })));

      for (const v of updatedVaccinations) {
        console.log('Processing vaccination:', { vaccineTypeId: v.vaccineTypeId, doseNumber: v.doseNumber, dateGiven: v.dateGiven });
        const existingVaccine = existingChild.vaccinations.find(
          (ev) => ev.vaccineTypeId === v.vaccineTypeId && ev.doseNumber === v.doseNumber
        );

        if (existingVaccine) {
          console.log('Found existing vaccine, updating:', { id: existingVaccine.id });
          await tx.vaccinationRecord.update({
            where: { id: existingVaccine.id },
            data: {
              ...v,
              isComplete: true,
              isExternallyAdministered: v.isExternallyAdministered || false,
              externalAdministeredBy: v.externalAdministeredBy || null,
            },
          });
          console.log('Vaccination updated successfully.');
        } else if (v.dateGiven) {
          console.log('No existing vaccine, creating new one.');
          await tx.vaccinationRecord.create({
            data: {
              ...v,
              citizenId: existingChild.id,
              createdById: currentUser.id,
              isComplete: true,
              wardOfVaccination: currentUser.wardId,
            },
          });
          console.log('New vaccination created successfully.');
        } else {
          console.log('Skipping: No dateGiven for new vaccination.');
        }

        // 🧠 Mark corresponding due vaccine as completed (instead of deleting)
        await tx.childDueVaccine.updateMany({
          where: {
            childId: existingChild.id,
            vaccineTypeId: v.vaccineTypeId,
            doseNumber: v.doseNumber,
          },
          data: { isCompleted: true },
        });
      }

      // --- Removed Vaccinations ---
      if (req.body.removedVaccinations && Array.isArray(req.body.removedVaccinations)) {
        console.log('Processing removed vaccinations:', req.body.removedVaccinations);

        for (const { vaccineTypeId, doseNumber } of req.body.removedVaccinations) {
          console.log('Deleting removed vaccination:', { vaccineTypeId, doseNumber });

          // 1️⃣ Delete vaccination record
          await tx.vaccinationRecord.deleteMany({
            where: {
              citizenId: existingChild.id,
              vaccineTypeId,
              doseNumber,
            },
          });
          console.log('Removed vaccination deleted.');

          // 2️⃣ Reactivate the due vaccine (mark isCompleted back to false)
          await tx.childDueVaccine.updateMany({
            where: {
              childId: existingChild.id,
              vaccineTypeId,
              doseNumber,
            },
            data: { isCompleted: false },
          });
          console.log(`Reactivated due vaccine: ${vaccineTypeId} - Dose ${doseNumber}`);
        }
      } else {
        console.log('No removed vaccinations provided.');
      }


      // --- Weight Records ---
      const incomingWeights = Array.isArray(weightRecords) ? weightRecords : [];
      const incomingIds = incomingWeights.filter(w => w.id).map(w => w.id);
      console.log('Processing weight records:', {
        incomingCount: incomingWeights.length,
        incomingIds,
        existingCount: existingChild.weightRecords?.length || 0,
      });

      if (existingChild.weightRecords.length > 0) {
        const toDelete = existingChild.weightRecords.filter(w => !incomingIds.includes(w.id)).map(w => w.id);
        console.log('Weights to delete:', toDelete);
        if (toDelete.length) {
          await tx.weightRecord.deleteMany({ where: { id: { in: toDelete }, childId: existingChild.id } });
          console.log(`${toDelete.length} weight records deleted.`);
        } else {
          console.log('No weight records to delete.');
        }
      }

      for (const w of incomingWeights) {
        if (!w.date) {
          console.log('Skipping weight record: No date provided:', w);
          continue;
        }
        const parsedDate = parseBsDateString(w.date);
        console.log('Processing weight record:', { id: w.id, weight: w.weight, date: w.date, parsedDate });

        if (w.id) {
          console.log('Updating existing weight record:', w.id);
          await tx.weightRecord.update({
            where: { id: w.id },
            data: { weight: w.weight, date: parsedDate, administeredById, wardOfVaccination: currentUser.wardId },
          });
          console.log('Weight record updated.');
        } else {
          console.log('Creating new weight record.');
          await tx.weightRecord.create({
            data: { childId: existingChild.id, weight: w.weight, date: parsedDate, administeredById, wardOfVaccination: currentUser.wardId, createdById: currentUser.id },
          });
          console.log('New weight record created.');
        }
      }

      if (demographicData.birthDate && demographicData.birthDate !== existingChild.birthDate) {
        console.log('Birth date changed, recalculating due vaccines...');
        const newDueVaccines = await prepareChildDueVaccines(demographicData.birthDate);

        for (const due of newDueVaccines) {
          const exists = await tx.childDueVaccine.findFirst({
            where: {
              childId: existingChild.id,
              vaccineTypeId: due.vaccineTypeId,
              doseNumber: due.doseNumber,
            },
          });

          if (!exists) {
            await tx.childDueVaccine.create({
              data: { ...due, childId: existingChild.id },
            });
            console.log(`Created new due vaccine: ${due.vaccineTypeId} - dose ${due.doseNumber}`);
          } else {
            console.log(`Skipping existing due vaccine: ${due.vaccineTypeId} - dose ${due.doseNumber}`);
          }
        }
      }


      // 🧩 CATCH-UP DELETION + LOCK LOGIC
      console.log('Processing catch-up deletion and lock logic...');
      const vaccineTypeIds = [...new Set(updatedVaccinations.map(v => v.vaccineTypeId))];
      console.log('Unique vaccineTypeIds for catch-up check:', vaccineTypeIds);

      for (const vaccineTypeId of vaccineTypeIds) {
        console.log('Checking primary completion for vaccineTypeId:', vaccineTypeId);
        const primaryComplete = await checkAllPrimaryComplete(existingChild.id, vaccineTypeId, tx);
        console.log('Primary complete status:', primaryComplete);

        if (primaryComplete) {
          console.log('Primary complete: Deleting catch-up due vaccines...');
          await tx.childDueVaccine.deleteMany({
            where: {
              childId: existingChild.id,
              vaccineTypeId,
              isCompleted: false,
              isCatchUp: true,
            },
          });
          console.log('Catch-up due vaccines deleted.');

          console.log('Locking catch-up for vaccineTypeId:', vaccineTypeId);
          await tx.childDueVaccine.updateMany({
            where: { childId: existingChild.id, vaccineTypeId },
            data: { catchUpLocked: true },
          });
          console.log('Catch-up locked successfully.');
        } else {
          console.log('Primary not complete: Skipping catch-up actions for', vaccineTypeId);
        }
      }

      console.log('Transaction completing...');
    });

    console.log('Transaction completed successfully. Fetching updated child...');
    const updatedChild = await prisma.child.findUnique({
      where: { sewaDartaNumber },
      include: { vaccinations: true, weightRecords: true, dueVaccines: true },
    });

    console.log('Updated Child Data:', {
      id: updatedChild.id,
      sewaDartaNumber: updatedChild.sewaDartaNumber,
      fullName: updatedChild.fullName,
      vaccinationsCount: updatedChild.vaccinations?.length || 0,
      weightRecordsCount: updatedChild.weightRecords?.length || 0,
      dueVaccinesCount: updatedChild.dueVaccines?.length || 0,
    });

    console.log('=== UPDATE CHILD COMPLETED SUCCESSFULLY ===');
    res.status(200).json(updatedChild);
  } catch (error) {
    console.error('ERROR in updateChild:', error);
    console.log('Error details:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to update child data', details: error.message });
  }
};
import { prisma } from '../utils/prisma.js';
import { createChildSchema } from '../schemas/childSchema.js';
import { checkPermission, filterChildData } from '../../client/src/utils/permissionService.js';
import {
  toMonths,
  mapVaccineNameToEnum,
  parseBsDateString,
} from '../utils/helpers.js';

async function prepareVaccinationCreateData(vaccines, user, administeredByUserId) {
  if (!vaccines) return [];

  // Get latest vaccine schedule version
  const scheduleVersion = await prisma.vaccineScheduleVersion.findFirst({
    orderBy: { id: 'desc' },
    include: { doses: true },
  });
  if (!scheduleVersion) throw new Error('No vaccine schedule found in the database');

  return Object.entries(vaccines).flatMap(([vaccineName, doses]) => {
    const vaccineTypeEnum = mapVaccineNameToEnum(vaccineName);

    // Get valid doses from schedule
    const validDoseNumbers = scheduleVersion.doses
      .filter(d => d.vaccineType === vaccineTypeEnum)
      .map(d => d.doseNumber);

    return doses
      .map((doseObj) => {
        if (!doseObj?.date) return null;
        if (!['current', 'booster'].includes(doseObj.type)) return null;

        const doseNumber = doseObj.doseNumber;
        if (!validDoseNumbers.includes(doseNumber)) return null; // Reject invalid doseNumber

        const dateGiven = parseBsDateString(doseObj.date);
        if (!dateGiven) return null;

        return {
          vaccineType: vaccineTypeEnum,
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
      vaccineType: dose.vaccineType,
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

      // Vaccination records
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

      // Weight records
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

      // ChildDueVaccine entries
      const dueVaccines = await prepareChildDueVaccines(validatedData.birthDate);
      if (dueVaccines.length) {
        const dueVaccinesWithChildId = dueVaccines.map((v) => ({ ...v, childId: child.id }));
        await tx.childDueVaccine.createMany({ data: dueVaccinesWithChildId });
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
    const children = await prisma.child.findMany({
      include: {
        createdBy: { select: { id: true, name: true } },
        verifiedBy: { select: { id: true, name: true } },
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
        dueVaccines: true, // include the schedule
      },
    });

    if (!children.length) {
      return res.status(404).json({ error: 'No children found' });
    }

    res.status(200).json(children);
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

    const children = await prisma.child.findMany({
      where: { wardNumber: currentUser.wardId },
      include: {
        createdBy: { select: { id: true, name: true } },
        verifiedBy: { select: { id: true, name: true } },
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
        dueVaccines: true, // include the schedule
      },
    });

    res.status(200).json(children);
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
        dueVaccines: true, // include schedule
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

    const children = await prisma.child.findMany({
      where: whereClause,
      include: { dueVaccines: true }, // include schedule for search results
      take: 20,
    });

    res.status(200).json(children);
  } catch (error) {
    console.error('Error searching children:', error);
    res.status(500).json({ error: 'Failed to perform search', details: error.message });
  }
};


//update child controller declarations and helpers
async function getLatestSchedule() {
  const scheduleVersion = await prisma.vaccineScheduleVersion.findFirst({
    orderBy: { id: 'desc' },
    include: { doses: true },
  });
  if (!scheduleVersion) throw new Error('No vaccine schedule found');
  return scheduleVersion;
}

// Map incoming vaccinations to DB schedule primary doses
async function prepareVaccinationUpdateData(childId, vaccinations, administeredById) {
  if (!vaccinations || !vaccinations.length) return [];

  const scheduleVersion = await getLatestSchedule();
  return vaccinations.flatMap((v) => {
    const vaccineType = mapVaccineNameToEnum(v.vaccineType);
    const schedule = scheduleVersion.doses
      .filter((d) => d.vaccineType === vaccineType)
      .sort((a, b) => a.doseNumber - b.doseNumber);

    const doseNumber = v.doseNumber;
    const scheduledDose = schedule.find((d) => d.doseNumber === doseNumber);
    if (!scheduledDose) return null; // skip doses not in primary schedule

    return {
      ...v,
      citizenId: childId,
      administeredById,
      createdById: v.id ? undefined : v.createdById, // only for new records
      dateGiven: v.dateGiven ? parseBsDateString(v.dateGiven) : null,
    };
  }).filter(Boolean);
}

// --- Updated controller
export const updateChild = async (req, res) => {
  const { id } = req.params;
  const sewaDartaNumber = parseInt(id, 10);
  const { vaccinations, weightRecords, administeredById, firstName, lastName, ...demographicData } = req.body;
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
      // Update demographic data if user has full permission
      const isSameWard = existingChild.wardNumber === currentUser.wardId;
      if (isSameWard || currentUser.role === 'SUPER_ADMIN') {
        const updateData = {
          fullName: `${firstName || ''} ${lastName || ''}`.trim(),
          ...demographicData.birthDate ? { birthDate: parseBsDateString(demographicData.birthDate) } : {},
          ...demographicData.phoneNumber ? { phoneNumber: demographicData.phoneNumber } : {},
          ...demographicData.gender ? { gender: demographicData.gender } : {},
          ...demographicData.wardNumber ? { wardNumber: demographicData.wardNumber } : {},
          ...demographicData.casteCode ? { casteCode: demographicData.casteCode } : {},
          ...demographicData.parentName ? { parentName: demographicData.parentName } : {},
          ...demographicData.tole ? { tole: demographicData.tole } : {},
          ...typeof demographicData.isFromOtherMunicipality === 'boolean' ? { isFromOtherMunicipality: demographicData.isFromOtherMunicipality } : {},
        };
        await tx.child.update({ where: { sewaDartaNumber }, data: updateData });
      }

      // Update vaccinations
      const updatedVaccinations = await prepareVaccinationUpdateData(existingChild.id, vaccinations, administeredById);

      for (const v of updatedVaccinations) {
        const vaccineTypeEnum = mapVaccineNameToEnum(v.vaccineType);

        const existingVaccine = existingChild.vaccinations.find(
          (ev) => ev.vaccineType === vaccineTypeEnum && ev.doseNumber === v.doseNumber
        );
        if (existingVaccine) {
          await tx.vaccinationRecord.update({ where: { id: existingVaccine.id }, data: v });
        } else if (v.dateGiven) {
          await tx.vaccinationRecord.create({
            data: {
              ...v,
              vaccineType: vaccineTypeEnum,
              citizenId: existingChild.id,
              createdById: currentUser.id, // required
              isComplete: true,           // required
              wardOfVaccination: currentUser.wardId, // required if your model needs it
            },
          });
        }
      }

      // Update weight records
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
          await tx.weightRecord.update({ where: { id: w.id }, data: { weight: w.weight, date: parsedDate, administeredById, wardOfVaccination: currentUser.wardId } });
        } else {
          await tx.weightRecord.create({ data: { childId: existingChild.id, weight: w.weight, date: parsedDate, administeredById, wardOfVaccination: currentUser.wardId, createdById: currentUser.id } });
        }
      }

      // Optionally: recalc childDueVaccines if birthDate changed
      if (demographicData.birthDate) {
        const childDueVaccines = await prepareChildDueVaccines(demographicData.birthDate);
        const dueWithChildId = childDueVaccines.map(v => ({ ...v, childId: existingChild.id }));
        await tx.childDueVaccine.deleteMany({ where: { childId: existingChild.id } });
        await tx.childDueVaccine.createMany({ data: dueWithChildId });
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
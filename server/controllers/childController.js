import { prisma } from '../utils/prisma.js';
import { vaccineSchedule } from '../utils/vaccineSchedule.js';
import { createChildSchema } from '../schemas/childSchema.js';
import { updateChildSchema } from '../schemas/childSchema.js';
import { checkPermission, filterChildData } from '../../client/src/utils/permissionService.js';
import {
  toMonths,
  mapVaccineNameToEnum,
  parseBsDateString,
} from '../utils/helpers.js';

// --- UPDATED: prepareVaccinationCreateData function
// Now it takes the administeredById from the payload
function prepareVaccinationCreateData(vaccines, user, administeredByUserId) {
  if (!vaccines) return [];

  return Object.entries(vaccines).flatMap(([vaccineName, doses]) => {
    const vaccineTypeEnum = mapVaccineNameToEnum(vaccineName);
    const schedule = vaccineSchedule[vaccineTypeEnum] || [];

    return doses
      .map((doseObj, index) => { // Added index parameter here
        if (!doseObj?.date) return null;

        const adDateGiven = parseBsDateString(doseObj.date);
        if (!adDateGiven) {
          console.error(`Invalid vaccination date for ${vaccineName}`);
          return null;
        }

        const doseNumber = index + 1; // Use the dose index to determine the dose number
        const doseSchedule = schedule.find((d) => d.dose === doseNumber);
        const recommendedAtMonths = doseSchedule
          ? Math.round(toMonths(doseSchedule) * 100) / 100
          : 0;

        return {
          vaccineType: vaccineTypeEnum,
          doseNumber,
          dateGiven: adDateGiven,
          isComplete: true,
          recommendedAtMonths,
          remarks: doseObj.remarks || null,
          type: doseObj.type || 'routine',
          createdById: user.id,
          administeredById: administeredByUserId,
        };
      })
      .filter(Boolean);
  });
}
// --- UPDATED: createChild controller
// It now expects administeredById for vaccines and weights in the request body
export const createChild = async (req, res) => {
  try {
    const validationResult = createChildSchema.safeParse(req.body);
    console.log('Validation result:', validationResult);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }
    const validatedData = validationResult.data;

    const adBirthDate = parseBsDateString(validatedData.birthDate);
    if (!adBirthDate) {
      return res.status(400).json({ error: 'Invalid BS birthDate string' });
    }

    // PurnaKhop should NOT be set on creation. We'll set it to false by default.
    const createdChild = await prisma.$transaction(async (tx) => {
      // Create child record
      const childData = {
        isFromOtherMunicipality: validatedData.isFromOtherMunicipality || false,
        fullName: validatedData.firstName + ' ' + validatedData.lastName || '',
        wardNumber: parseInt(validatedData.wardNumber, 10),
        parentName: validatedData.parentName || '',
        tole: validatedData.tole || '',
        phoneNumber: validatedData.phoneNumber || '',
        gender: validatedData.gender,
        casteCode: parseInt(validatedData.casteCode, 10),
        birthDate: adBirthDate,
        createdById: req.user.id,
        purnaKhop: false, // Always false on creation
        remarks: validatedData.remarks || '',
        verifiedById: null, // Always null on creation
      };
      const child = await tx.child.create({ data: childData });

      // Create vaccination records with both createdBy and administeredBy
      const vaccinationCreateData = prepareVaccinationCreateData(
        validatedData.vaccines,
        req.user,
        validatedData.administeredById // Pass the administeredById from the request body
      );
      if (vaccinationCreateData.length > 0) {
        const vaccinationsWithChildId = vaccinationCreateData.map((v) => ({
          ...v,
          citizenId: child.id,
          wardOfVaccination: req.user.wardId,
        }));
        await tx.vaccinationRecord.createMany({
          data: vaccinationsWithChildId,
        });
      }

      // Create weight records with both createdBy and administeredBy
      if (validatedData.weightRecords?.length) {
        const weightCreateData = validatedData.weightRecords.map((w) => ({
          childId: child.id,
          weight: w.weight,
          date: parseBsDateString(w.date),
          createdById: req.user.id, // The person entering the data
          administeredById: validatedData.administeredById, // Pass the administeredById from the request body

          wardOfVaccination: req.user.wardId,
        }));
        await tx.weightRecord.createMany({ data: weightCreateData });
      }

      // Perform a final query to get the newly created child with all related data
      const newChildWithUser = await tx.child.findUnique({
        where: { id: child.id },
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
        },
      });

      return newChildWithUser;
    });

    res.status(201).json(createdChild);
  } catch (error) {
    console.error('Child creation error:', error);
    res.status(500).json({
      error: 'Child creation failed',
      details: error.message,
    });
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
export const getAllChildren = async (req, res) => {
  try {
    const children = await prisma.child.findMany({
      include: {
        createdBy: { select: { id: true, name: true } },
        verifiedBy: { select: { id: true, name: true } }, // NEW
        vaccinations: {
          include: {
            createdBy: { select: { id: true, name: true } },
            administeredBy: { select: { id: true, name: true } }, // NEW
          },
        },
        weightRecords: {
          include: {
            createdBy: { select: { id: true, name: true } },
            administeredBy: { select: { id: true, name: true } }, // NEW
          },
        },
      },
    });

    if (!children) {
      return res.status(404).json({ error: 'No children found' });
    }

    res.status(200).json(children);
  } catch (error) {
    console.error('Error fetching all children:', error);
    res.status(500).json({
      error: 'Failed to retrieve children data',
      details: error.message,
    });
  }
};
export const getWardChildren = async (req, res) => {
  try {
    if (!req.user || !req.user.wardId) {
      return res
        .status(401)
        .json({ error: 'Unauthorized. User or wardId not found.' });
    }
    const { wardId } = req.user;
    const children = await prisma.child.findMany({
      where: {
        wardNumber: wardId,
      },
      include: {
        createdBy: { select: { id: true, } },
        verifiedBy: { select: { id: true, } },
        vaccinations: {
          include: {
            createdBy: { select: { id: true, } },
            administeredBy: { select: { id: true, } },
          },
        },
        weightRecords: {
          include: {
            createdBy: { select: { id: true, } },
            administeredBy: { select: { id: true, } },
          },
        },
      },
    });
    return res.status(200).json(children);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
export const getChild = async (req, res) => {
  try {
    const searchTerm = req.params.id;
    const isNumber = /^\d+$/.test(searchTerm);
    const currentUser = req.user;

    let child;
    if (isNumber) {
      child = await prisma.child.findUnique({
        where: { sewaDartaNumber: parseInt(searchTerm, 10) },
        include: {
          vaccinations: true,
          weightRecords: true,
        },
      });
    } else {
      child = await prisma.child.findUnique({
        where: { id: searchTerm },
        include: {
          vaccinations: true,
          weightRecords: true,
        },
      });
    }

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Check read permission and filter the data accordingly.
    const hasReadPermission = checkPermission(currentUser, 'read', child);
    if (!hasReadPermission) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to view this child.' });
    }

    const filteredChild = filterChildData(currentUser, child);
    return res.status(200).json(filteredChild);

  } catch (error) {
    console.error('Error fetching single child:', error);
    res.status(500).json({
      error: 'Failed to retrieve child data',
      details: error.message,
    });
  }
};

export const searchChildren = async (req, res) => {
  try {
    const { name, phoneNumber, sewaDartaNumber, gender, wardId, createdByMe } = req.query;
    const currentUser = req.user;

    // Initialize an empty object to build the Prisma query 'where' clause.
    const whereClause = {};

    // 1. Enforce ward filtering based on user role and query.
    // If user is WARD_OFFICER and no specific wardId is requested, default to their own ward.
    // If they request a specific wardId, the permission check will handle access.
    if (currentUser.role === 'WARD_OFFICER' && !wardId) {
      whereClause.wardNumber = currentUser.wardId;
    } else if (wardId && wardId !== 'all') {
      whereClause.wardNumber = parseInt(wardId, 10);
    }

    // 2. Build search filters for each field dynamically.
    if (name) { whereClause.fullName = { contains: name, mode: 'insensitive' }; }
    if (phoneNumber) { whereClause.phoneNumber = { contains: phoneNumber, mode: 'insensitive' }; }
    if (sewaDartaNumber) { whereClause.sewaDartaNumber = parseInt(sewaDartaNumber, 10); }
    if (gender) { whereClause.gender = gender.toUpperCase(); }
    if (createdByMe === 'true') { whereClause.createdById = currentUser.id; }

    // Perform the Prisma query.
    const children = await prisma.child.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        sewaDartaNumber: true,
        birthDate: true,
        gender: true,
        wardNumber: true,
      },
      take: 20,
    });

    res.status(200).json(children);
  } catch (error) {
    console.error('Error searching children:', error);
    res.status(500).json({
      error: 'Failed to perform search',
      details: error.message,
    });
  }
};
export const updateChild = async (req, res) => {
  const { id } = req.params;
  const sewaDartaNumber = parseInt(id, 10);
  const { vaccinations, weightRecords, administeredById, firstName, lastName, ...demographicData } = req.body;
  const currentUser = req.user;

  try {
    const existingChild = await prisma.child.findUnique({
      where: { sewaDartaNumber },
      include: { vaccinations: true, weightRecords: true }
    });

    if (!existingChild) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // STEP 1: Centralized permission check
    // Pass the demographic data to the permission service to check for partial updates
    const hasPermission = checkPermission(currentUser, 'update', existingChild, demographicData);

    if (!hasPermission) {
      return res.status(403).json({ error: 'You are not authorized to edit this child\'s data.' });
    }

    // STEP 2: The rest of the logic can proceed, now that we know the user has permission.
    // The previous hardcoded check is replaced.

    await prisma.$transaction(async (tx) => {
      // Only update demographic data if the user has full permission (i.e., from the same ward or SUPER_ADMIN).
      const isSameWard = existingChild.wardNumber === currentUser.wardId;
      if (isSameWard || currentUser.role === 'SUPER_ADMIN') {
        const updateData = {
          fullName: `${firstName || ''} ${lastName || ''}`.trim(),
        };

        if (demographicData.birthDate) { updateData.birthDate = parseBsDateString(demographicData.birthDate); }
        if (typeof demographicData.phoneNumber === 'string' && demographicData.phoneNumber.trim() !== '') { updateData.phoneNumber = demographicData.phoneNumber; }
        if (typeof demographicData.gender === 'string') { updateData.gender = demographicData.gender; }
        if (typeof demographicData.wardNumber === 'number') { updateData.wardNumber = demographicData.wardNumber; }
        if (typeof demographicData.casteCode === 'number') { updateData.casteCode = demographicData.casteCode; }
        if (typeof demographicData.parentName === 'string') { updateData.parentName = demographicData.parentName; }
        if (typeof demographicData.tole === 'string') { updateData.tole = demographicData.tole; }
        if (typeof demographicData.isFromOtherMunicipality === 'boolean') { updateData.isFromOtherMunicipality = demographicData.isFromOtherMunicipality; }

        await tx.child.update({
          where: { sewaDartaNumber },
          data: updateData,
        });
      }

      // Prepare vaccination records
      const incomingVaccs = Array.isArray(vaccinations) ? vaccinations : [];

      for (const v of incomingVaccs) {
        // Only update if the user has permission (handled by the initial check)
        const parsedDate = v.dateGiven ? parseBsDateString(v.dateGiven) : null;
        const vData = {
          remarks: v.remarks ?? null,
          administeredById: administeredById,
          wardOfVaccination: currentUser.wardId,
        };
        if (parsedDate) vData.dateGiven = parsedDate;

        const existingVaccine = existingChild.vaccinations.find((ev) => ev.vaccineType === v.vaccineType && ev.doseNumber === v.doseNumber);

        if (existingVaccine) {
          await tx.vaccinationRecord.update({ where: { id: existingVaccine.id }, data: vData });
        } else {
          if (parsedDate) {
            await tx.vaccinationRecord.create({
              data: {
                ...vData,
                vaccineType: v.vaccineType,
                doseNumber: v.doseNumber,
                citizenId: existingChild.id,
                createdById: currentUser.id,
              },
            });
          }
        }
      }

      // Create/update/delete weight records
      const incomingWeights = Array.isArray(weightRecords) ? weightRecords : [];
      const incomingIds = incomingWeights.filter(w => w.id && !isNaN(parseInt(w.id))).map(w => parseInt(w.id));

      if (existingChild.weightRecords.length > 0) {
        const toDelete = existingChild.weightRecords.filter(existing => !incomingIds.includes(existing.id)).map(wr => wr.id);
        if (toDelete.length > 0) {
          await tx.weightRecord.deleteMany({
            where: {
              id: { in: toDelete },
              childId: existingChild.id
            }
          });
        }
      }

      for (const w of incomingWeights) {
        const parsedWeightDate = w.date ? parseBsDateString(w.date) : null;
        if (!parsedWeightDate) continue;

        if (w.id) {
          await tx.weightRecord.update({
            where: { id: w.id },
            data: {
              weight: w.weight,
              date: parsedWeightDate,
              administeredById,
              wardOfVaccination: currentUser.wardId,
            },
          });
        } else {
          await tx.weightRecord.create({
            data: {
              weight: w.weight,
              date: parsedWeightDate,
              administeredById,
              wardOfVaccination: currentUser.wardId,
              childId: existingChild.id,
              createdById: currentUser.id,
            },
          });
        }
      }
    });

    const updatedChild = await prisma.child.findUnique({
      where: { sewaDartaNumber },
      include: { vaccinations: true, weightRecords: true }
    });

    res.status(200).json(updatedChild);
  } catch (error) {
    console.error('Error updating child:', error);
    res.status(500).json({
      error: 'Failed to update child data',
      details: error.message,
    });
  }
};

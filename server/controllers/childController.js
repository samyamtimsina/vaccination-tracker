import { prisma } from '../utils/prisma.js';
import { vaccineSchedule } from '../utils/vaccineSchedule.js';
import { createChildSchema } from '../schemas/childSchema.js';
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
      .map((doseObj, idx) => {
        if (!doseObj?.date) return null;

        const adDateGiven = parseBsDateString(doseObj.date);
        if (!adDateGiven) {
          console.error(
            `Invalid vaccination date for ${vaccineName} dose ${idx + 1}`,
          );
          return null;
        }

        const doseNumber = idx + 1;
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
          createdById: user.id, // The person entering the data
          administeredById: administeredByUserId, // The ID of the person who administered it
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

// --------------------------------------------------
// UPDATED: All `read` controllers to include new relations
// --------------------------------------------------

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
        verifiedBy: { select: { id: true, } }, // NEW
        vaccinations: {
          include: {
            createdBy: { select: { id: true, } },
            administeredBy: { select: { id: true, } }, // NEW
          },
        },
        weightRecords: {
          include: {
            createdBy: { select: { id: true, } },
            administeredBy: { select: { id: true, } }, // NEW
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
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Child ID is required' });
    }
    const child = await prisma.child.findUnique({
      where: {
        id: id,
      },
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
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }
    res.status(200).json(child);
  } catch (error) {
    console.error('Error fetching single child:', error);
    res.status(500).json({
      error: 'Failed to retrieve child data',
      details: error.message,
    });
  }
};
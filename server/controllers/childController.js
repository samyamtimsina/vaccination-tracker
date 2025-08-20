import { prisma } from '../utils/prisma.js';
import { vaccineSchedule } from '../utils/vaccineSchedule.js';
import { createChildSchema } from '../schemas/childSchema.js';
import { updateChildSchema } from '../schemas/childSchema.js';
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
  console.log('req.body create child', req.body)
  console.log('req.body vaccines', req.body.vaccines)
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
    const searchTerm = req.params.id;

    // Check if searchTerm is a number (sewa darta number)
    const isNumber = /^\d+$/.test(searchTerm);

    let child;
    if (isNumber) {
      // Search by sewa darta number
      const parsedSewaDartaNumber = parseInt(searchTerm, 10);
      child = await prisma.child.findUnique({
        where: {
          sewaDartaNumber: parsedSewaDartaNumber,
        },
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
    } else {
      // Search by name
      child = await prisma.child.findFirst({
        where: {
          fullName: {
            contains: searchTerm,
            mode: 'insensitive', // Case-insensitive search
          },
        },
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
    }

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
// A validation schema is required for updates, similar to create.
// Since we don't have one, we will use a hypothetical updateChildSchema.
// You'll need to create this in your schemas/childSchema.js file.
// It should be a Zod schema that makes all fields optional as they may not
export const updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const sewaDartaNumber = parseInt(id, 10);
    const {
      vaccines,
      weightRecords,
      administeredById,
      firstName,
      lastName,
      ...restUpdateData
    } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updatedChild = await prisma.$transaction(async (tx) => {
      const existingChild = await tx.child.findUnique({
        where: { sewaDartaNumber },
      });

      if (!existingChild) {
        throw new Error('Child not found');
      }

      // 1. Update basic child info
      const child = await tx.child.update({
        where: { sewaDartaNumber },
        data: {
          ...restUpdateData,
          fullName: `${firstName || ''} ${lastName || ''}`.trim(),
          birthDate: parseBsDateString(restUpdateData.birthDate),
        },
      });

      // 2. Delete all existing vaccination records
      await tx.vaccinationRecord.deleteMany({
        where: { citizenId: child.id }
      });

      // 3. Create new vaccination records if provided
      if (vaccines) {
        const vaccinationCreateData = prepareVaccinationCreateData(
          vaccines,
          req.user,
          administeredById
        );

        if (vaccinationCreateData.length > 0) {
          await tx.vaccinationRecord.createMany({
            data: vaccinationCreateData.map(v => ({
              ...v,
              citizenId: child.id,
            })),
          });
        }
      }

      // 4. Delete all existing weight records
      await tx.weightRecord.deleteMany({
        where: { childId: child.id }
      });

      // 5. Create new weight records if provided
      if (weightRecords?.length) {
        const validWeightRecords = weightRecords
          .filter(w => w.date && w.weight) // Only process records with both date and weight
          .map(w => ({
            childId: child.id,
            weight: parseFloat(w.weight),
            date: parseBsDateString(w.date),
            createdById: req.user.id,
            administeredById: administeredById,
          }));

        if (validWeightRecords.length > 0) {
          await tx.weightRecord.createMany({
            data: validWeightRecords
          });
        }
      }

      // 6. Return updated child with all relations
      return await tx.child.findUnique({
        where: { sewaDartaNumber },
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
    });

    res.status(200).json(updatedChild);
  } catch (error) {
    console.error('Child update error:', error);
    res.status(500).json({
      error: 'Child update failed',
      details: error.message,
    });
  }
};
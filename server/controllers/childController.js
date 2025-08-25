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
    const currentUserWardId = req.user.wardId; // Assuming `req.user` contains the authenticated user's data

    let child;
    if (isNumber) {
      // Find child by Sewa Darta number
      child = await prisma.child.findUnique({
        where: {
          sewaDartaNumber: parseInt(searchTerm, 10)
        },
        include: {
          vaccinations: true,
          weightRecords: true,
        },
      });
    } else {
      // Find child by ID
      child = await prisma.child.findUnique({
        where: {
          id: searchTerm
        },
        include: {
          vaccinations: true,
          weightRecords: true,
        },
      });
    }

    if (!child) {
      return res.status(404).json({
        error: 'Child not found'
      });
    }

    // Check if the user is from the same ward as the child
    if (child.wardNumber === currentUserWardId) {
      // Return full data if from the same ward
      return res.status(200).json(child);
    } else {
      // Return a limited subset of data if from a different ward
      const limitedChildData = {
        id: child.id,
        fullName: child.fullName,
        sewaDartaNumber: child.sewaDartaNumber,
        birthDate: child.birthDate,
        gender: child.gender,
        vaccinations: child.vaccinations,
        weightRecords: child.weightRecords,
      };
      return res.status(200).json(limitedChildData);
    }
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
    console.log('req.query', req.query);

    // Get the authenticated user's details.
    const currentUserWardId = req.user.wardId;
    const currentUserId = req.user.id;

    // Initialize an empty object to build the Prisma query 'where' clause.
    const whereClause = {};

    // 1. Build search filters for each field dynamically.
    // If a search term is provided, add it to the whereClause.

    // Search by full name (case-insensitive contains)
    if (name) {
      whereClause.fullName = {
        contains: name,
        mode: 'insensitive',
      };
    }

    // Search by phone number (case-insensitive contains)
    if (phoneNumber) {
      whereClause.phoneNumber = {
        contains: phoneNumber,
        mode: 'insensitive',
      };
    }

    // Search by service registration number (sewaDartaNumber)
    // Assuming this is a number field, we'll use 'equals' for an exact match.
    if (sewaDartaNumber) {
      whereClause.sewaDartaNumber = parseInt(sewaDartaNumber, 10);
    }

    // Filter by gender
    if (gender) {
      whereClause.gender = gender.toUpperCase();
    }

    // 2. Adjust ward-based filtering logic
    // The search will now default to all wards unless a specific wardId is provided.
    // The ward filter is only applied if a specific wardId is provided by the client
    // and that wardId is not 'all'.
    if (wardId && wardId !== 'all') {
      whereClause.wardNumber = parseInt(wardId, 10);
    }
    // If wardId is 'all' or not provided, no ward filter is added, and it searches all wards for any authenticated user.


    // 3. Filter by the user who created the record.
    if (createdByMe === 'true') {
      whereClause.createdById = currentUserId;
    }

    // Perform the Prisma query with the dynamically built where clause.
    const children = await prisma.child.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        sewaDartaNumber: true,
        birthDate: true,
        gender: true,
        wardNumber: true, // It's a good idea to return the wardNumber to the client
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

// A validation schema is required for updates, similar to create.
// Since we don't have one, we will use a hypothetical updateChildSchema.
// You'll need to create this in your schemas/childSchema.js file.
// It should be a Zod schema that makes all fields optional as they may not
export const updateChild = async (req, res) => {
  const {
    id
  } = req.params;
  const sewaDartaNumber = parseInt(id, 10);
  const {
    vaccines,
    weightRecords,
    administeredById,
    ...demographicData
  } = req.body;
  const currentUser = req.user;

  try {
    const existingChild = await prisma.child.findUnique({
      where: {
        sewaDartaNumber
      },
      include: {
        vaccinations: true,
        weightRecords: true,
      }
    });

    if (!existingChild) {
      return res.status(404).json({
        error: 'Child not found'
      });
    }

    // Validate if the user has permission to edit demographics
    const isSameWard = existingChild.wardNumber === currentUser.wardId;
    if (!isSameWard && (Object.keys(demographicData).length > 0)) {
      // Prevents a cross-ward officer from sending any demographic data changes
      return res.status(403).json({
        error: 'You are not authorized to edit this child\'s demographic information.'
      });
    }

    await prisma.$transaction(async (tx) => {
      if (isSameWard) {
        // Only allow demographic updates for same-ward users
        await tx.child.update({
          where: {
            sewaDartaNumber
          },
          data: {
            ...demographicData,
            fullName: `${demographicData.firstName || ''} ${demographicData.lastName || ''}`.trim(),
            birthDate: parseBsDateString(demographicData.birthDate),
          },
        });
      }

      // Update vaccine and weight records for both same-ward and cross-ward users
      const newVaccines = vaccines.map(v => ({
        ...v,
        // Ensure new records are logged with the vaccinating officer's ward
        wardOfVaccination: currentUser.wardId
      }));
      const newWeights = weightRecords.map(w => ({
        ...w,
        // Ensure new records are logged with the vaccinating officer's ward
        wardOfVaccination: currentUser.wardId
      }));

      // A note on the database schema:
      // The `VaccinationRecord` and `WeightRecord` models should have a
      // `wardOfVaccination` field to log where the record was created.
      // This is a crucial change to your database schema for the flow to work correctly.
      await tx.child.update({
        where: {
          sewaDartaNumber
        },
        data: {
          vaccinations: {
            upsert: newVaccines.map(v => ({
              where: {
                id: v.id || v.vaccineCode_childId // Handle new vs existing records
              },
              create: v,
              update: v,
            }))
          },
          weightRecords: {
            upsert: newWeights.map(w => ({
              where: {
                id: w.id || w.recordDate_childId
              },
              create: w,
              update: w,
            }))
          },
          administeredById: administeredById,
          modifiedAt: new Date(),
        },
      });
    });

    const updatedChild = await prisma.child.findUnique({
      where: {
        sewaDartaNumber
      },
      include: {
        vaccinations: true,
        weightRecords: true,
      },
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

import { prisma } from '../utils/prisma.js';
import { vaccineSchedule } from '../utils/vaccineSchedule.js';
import { createChildSchema } from '../schemas/childSchema.js';
import {
  toMonths,
  mapVaccineNameToEnum,
  parseBsDateString,
} from '../utils/helpers.js';

// Updated function to prepare vaccination data with BS date conversion
function prepareVaccinationCreateData(vaccines, user) {
  if (!vaccines) return [];

  return Object.entries(vaccines).flatMap(([vaccineName, doses]) => {
    const vaccineTypeEnum = mapVaccineNameToEnum(vaccineName);
    const schedule = vaccineSchedule[vaccineTypeEnum] || [];

    return doses
      .map((dateGiven, idx) => {
        if (!dateGiven) return null;

        // Convert BS vaccination date to AD
        const adDateGiven = parseBsDateString(dateGiven);
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
          dateGiven: adDateGiven, // Use the converted AD date
          isComplete: true,
          recommendedAtMonths,
          createdBy: {
            connect: {
              id: user.id,
            },
          },
        };
      })
      .filter(Boolean);
  });
}

export const createChild = async (req, res) => {
  try {
    // 1. Validate the request body using Zod
    const validationResult = createChildSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    const validatedData = validationResult.data;

    // Convert BS birth date to AD
    const bsBirthDateStr = validatedData.birthDate;
    console.log(bsBirthDateStr, 'bsdate');
    const adBirthDate = parseBsDateString(bsBirthDateStr);

    if (!adBirthDate) {
      return res.status(400).json({ error: 'Invalid BS birthDate string' });
    }

    // 2. Combine full name
    const combinedFullName =
      `${validatedData.fullName} ${validatedData.lastName || ''}`.trim();

    // 3. Prepare vaccination data (now handles BS dates)
    const vaccinationCreateData = prepareVaccinationCreateData(
      validatedData.vaccines,
      req.user,
    );

    // 4. Create the child record in the database
    const child = await prisma.child.create({
      data: {
        sewaDartaNumber: parseInt(validatedData.sewaDartaNumber, 10),
        isFromOtherMunicipality: validatedData.isFromOtherMunicipality || false,
        fullName: combinedFullName,
        wardNumber: parseInt(validatedData.wardNumber, 10),
        parentName: validatedData.parentName || '',
        tole: validatedData.tole || '',
        phoneNumber: validatedData.phoneNumber || '',
        gender: validatedData.gender,
        casteCode: parseInt(validatedData.casteCode, 10),
        birthDate: adBirthDate,
        createdById: req.user.id,
        purnaKhop: validatedData.purnaKhop,
        remarks: validatedData.remarks || '',
        vaccinations: {
          create: vaccinationCreateData,
        },
      },
      include: { vaccinations: true },
    });

    // 5. Send a successful response
    res.status(201).json(child);
  } catch (error) {
    console.error('Child creation error:', error);
    res.status(500).json({
      error: 'Child creation failed',
      details: error.message,
    });
  }
};

// Rest of your controllers (getAllChildren, getChild) remain the same

// Controller to get all children, including their vaccination records
export const getAllChildren = async (req, res) => {
  try {
    const children = await prisma.child.findMany({
      include: {
        vaccinations: true,
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
    // Check if the user is authenticated and has a wardId
    if (!req.user || !req.user.wardId) {
      return res
        .status(401)
        .json({ error: 'Unauthorized. User or wardId not found.' });
    }

    // Get the wardId from the authenticated user object
    const { wardId } = req.user;
    console.log('Ward ID from user:', wardId);

    // Use the user's wardId in the Prisma query to filter the children
    const children = await prisma.child.findMany({
      where: {
        wardNumber: wardId,
      },

      include: {
        vaccinations: true,
      },
    });

    // Send a successful response with the children data
    return res.status(200).json(children);
  } catch (error) {
    // Handle any server-side errors
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Controller to get a single child by ID, including their vaccination records
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
        vaccinations: true,
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

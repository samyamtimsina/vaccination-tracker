import { prisma } from '../utils/prisma.js';
import { vaccineSchedule } from '../utils/vaccineSchedule.js';
import { createChildSchema } from '../schemas/childSchema.js';
import {
  toMonths,
  mapVaccineNameToEnum,
  parseBsDateString,
  // I added a new helper to generate random BS dates for the mock function
  generateRandomBsDate,
} from '../utils/helpers.js';
import { faker } from '@faker-js/faker';

import { v4 as uuidv4 } from 'uuid';

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
        const doseSchedule = vaccineSchedule[vaccineType]?.[idx];
        const recommendedMonths = doseSchedule
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
// ... rest of your existing controller functions (createChild, getAllChildren, etc.)

/**
 * Controller to generate a large amount of mock child and vaccination data.
 * This should only be used in a development/testing environment.
 */
/**
 * Controller to generate a large amount of mock child and vaccination data.
 * This should only be used in a development/testing environment.
 */

// I have refactored this function to use the same logic as createChild
export const generateMockData = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res
      .status(403)
      .json({ error: 'This endpoint is not available in production.' });
  }

  try {
    const numberOfChildrenToCreate = parseInt(req.query.count, 10) || 500;
    const mockUser = req.user; // authenticated user info

    console.log(`Generating ${numberOfChildrenToCreate} mock children...`);

    // Delete existing data - destructive!
    // await prisma.vaccinationRecord.deleteMany();
    // await prisma.child.deleteMany();

    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < numberOfChildrenToCreate; i++) {
        // Use a random BS birth date
        const bsBirthDateStr = generateRandomBsDate();
        const adBirthDate = parseBsDateString(bsBirthDateStr);

        const combinedFullName = `${faker.person.firstName()} ${faker.person.lastName()}`;

        // Create a mock vaccination object with BS dates
        // Inside generateMockData
        // Create a mock vaccination object with BS dates
        const mockVaccines = {};
        const numberOfVaccines = faker.number.int({ min: 0, max: 5 });
        // Filter out vaccines with empty schedules (e.g., OTHERS)
        const vaccineTypes = Object.keys(vaccineSchedule).filter(
          (key) => vaccineSchedule[key].length > 0,
        );

        for (let j = 0; j < numberOfVaccines; j++) {
          const vaccineType = faker.helpers.arrayElement(vaccineTypes);
          // Use the actual number of doses defined in the schedule, or a random number
          const maxDoses = vaccineSchedule[vaccineType]?.length || 1;
          const numberOfDoses = faker.number.int({ min: 1, max: maxDoses });
          const doses = [];
          for (let k = 0; k < numberOfDoses; k++) {
            doses.push(generateRandomBsDate());
          }
          mockVaccines[vaccineType] = doses;
        }

        // Use the existing prepareVaccinationCreateData helper
        // This function would need to be defined elsewhere, but we can assume its existence
        const prepareVaccinationCreateData = (vaccinations, user) => {
          const createData = [];

          for (const [vaccineName, dates] of Object.entries(vaccinations)) {
            // Get the standardized vaccine type
            const vaccineType = mapVaccineNameToEnum(vaccineName);

            // Skip if vaccineType is invalid or not found in vaccineSchedule
            if (!vaccineType || !vaccineSchedule[vaccineType]) {
              console.warn(
                `Invalid or unmapped vaccine type: ${vaccineName} -> ${vaccineType}`,
              );
              continue;
            }

            // Get the schedule for this vaccine type (array of dose objects)
            const schedule = vaccineSchedule[vaccineType] || [];

            // Skip if schedule is empty (e.g., OTHERS)
            if (schedule.length === 0) {
              console.warn(
                `No schedule defined for vaccine type: ${vaccineType}`,
              );
              continue;
            }

            dates.forEach((dateStr, index) => {
              // Convert BS date to AD
              const adDate = parseBsDateString(dateStr);
              if (!adDate) {
                console.warn(
                  `Invalid date for ${vaccineName} dose ${index + 1}: ${dateStr}`,
                );
                return;
              }

              // Get the dose schedule for the current index, if available
              const doseSchedule = schedule[index] || {};

              // Convert recommended age to months
              let recommendedMonths = 0;
              if (doseSchedule.recommendedAtMonths) {
                recommendedMonths = doseSchedule.recommendedAtMonths;
              } else if (doseSchedule.recommendedAtWeeks) {
                recommendedMonths =
                  Math.round((doseSchedule.recommendedAtWeeks / 4.345) * 100) /
                  100; // Convert weeks to months
              } else if (doseSchedule.recommendedAtDays) {
                recommendedMonths =
                  Math.round((doseSchedule.recommendedAtDays / 30.417) * 100) /
                  100; // Convert days to months
              }

              createData.push({
                vaccineType: vaccineType,
                doseNumber: index + 1,
                dateGiven: adDate,
                isComplete: true,
                recommendedAtMonths: recommendedMonths,
                createdBy: {
                  connect: {
                    id: user.id,
                  },
                },
              });
            });
          }

          return createData;
        };

        const vaccinationCreateData = prepareVaccinationCreateData(
          mockVaccines,
          mockUser,
        );

        // Replicate the createChild function's logic for a single child
        await tx.child.create({
          data: {
            sewaDartaNumber: faker.number.int({ min: 100000, max: 999999 }),
            isFromOtherMunicipality: faker.datatype.boolean(),
            fullName: combinedFullName,
            wardNumber: faker.number.int({ min: 1, max: 30 }),
            parentName: faker.person.fullName(),
            tole: faker.location.street(),
            phoneNumber: faker.phone.number('98########'),
            gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
            casteCode: faker.number.int({ min: 1, max: 10 }),
            birthDate: adBirthDate,
            purnaKhop: faker.datatype.boolean(),
            remarks: faker.lorem.sentences(),
            // The key is to use nested create just like in the controller
            vaccinations: {
              create: vaccinationCreateData,
            },
            createdBy: {
              connect: {
                id: mockUser.id,
              },
            },
          },
        });
      }
    });

    res.status(200).json({
      message: `Successfully created ${numberOfChildrenToCreate} mock children and their vaccinations.`,
    });
  } catch (error) {
    console.error('Error generating mock data:', error);
    res
      .status(500)
      .json({ error: 'Failed to generate mock data', details: error.message });
  }
};

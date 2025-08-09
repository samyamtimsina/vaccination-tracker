import { prisma } from '../utils/prisma.js';
import { vaccineSchedule } from '../utils/vaccineSchedule.js';
import { createChildSchema } from '../schemas/childSchema.js'; // Import the Zod schema
import { toMonths, mapVaccineNameToEnum } from '../utils/helpers.js'; // We'll move these here

// Function to prepare vaccination data - extracted for clarity
function prepareVaccinationCreateData(vaccines) {
  if (!vaccines) return [];

  return Object.entries(vaccines).flatMap(([vaccineName, doses]) => {
    const vaccineTypeEnum = mapVaccineNameToEnum(vaccineName);
    const schedule = vaccineSchedule[vaccineTypeEnum] || [];

    return doses
      .map((dateGiven, idx) => {
        if (!dateGiven) return null;
        const doseNumber = idx + 1;
        const doseSchedule = schedule.find((d) => d.dose === doseNumber);
        const recommendedAtMonths = doseSchedule
          ? Math.round(toMonths(doseSchedule) * 100) / 100
          : 0;

        return {
          vaccineType: vaccineTypeEnum,
          doseNumber,
          dateGiven: new Date(dateGiven),
          isComplete: true,
          recommendedAtMonths,
        };
      })
      .filter(Boolean);
  });
}

export const createChild = async (req, res) => {
  try {
    console.log(req.body, 'req.body');
    // 1. Validate the request body using Zod
    const validationResult = createChildSchema.safeParse(req.body);
    console.log('validation result', validationResult);

    if (!validationResult.success) {
      // Return a 400 with detailed Zod errors
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    const validatedData = validationResult.data;

    // 2. Combine full name
    const combinedFullName =
      `${validatedData.fullName} ${validatedData.lastName || ''}`.trim();

    // 3. Prepare vaccination data using the extracted helper function
    const vaccinationCreateData = prepareVaccinationCreateData(
      validatedData.vaccines,
    );

    // 4. Create the child record in the database
    const child = await prisma.child.create({
      data: {
        sewaDartaNumber: parseInt(validatedData.sewaDartaNumber, 10),
        fullName: combinedFullName,
        wardNumber: parseInt(validatedData.wardNumber, 10),
        parentName: validatedData.parentName || '',
        tole: validatedData.tole || '',
        phoneNumber: validatedData.phoneNumber || '',
        gender: validatedData.gender,
        casteCode: parseInt(validatedData.casteCode, 10),
        birthDate: new Date(validatedData.birthDate),
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
    // You could also check for specific Prisma errors here
    res.status(500).json({
      error: 'Child creation failed',
      details: error.message,
    });
  }
};
// Controller to get all children, including their vaccination records
export const getAllChildren = async (req, res) => {
  try {
    // Find all children in the database
    // The `include` option ensures that each child's vaccination history is also retrieved
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

// Controller to get a single child by ID, including their vaccination records
export const getChild = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Child ID is required' });
    }

    // Find a unique child record by ID
    const child = await prisma.child.findUnique({
      where: {
        id: id,
      },
      include: {
        vaccinations: true, // This includes all vaccination records for the child
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

import { prisma } from '../utils/prisma.js';
import { vaccineSchedule } from '../utils/vaccineSchedule.js';
import { createChildSchema } from '../schemas/childSchema.js';
import { toMonths, mapVaccineNameToEnum } from '../utils/helpers.js';
import { bsToAd } from '@sbmdkl/nepali-date-converter';

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
    // 1. Validate the request body using Zod
    const validationResult = createChildSchema.safeParse(req.body);
    console.log('validation result', validationResult);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    const validatedData = validationResult.data;

    // Parse BS date string to AD Date object using @sbmdkl/nepali-date-converter
    function parseBsDateString(bsDateStr) {
      if (!bsDateStr) return null;
      try {
        // Expect bsDateStr in 'YYYY-MM-DD' format
        const [yearStr, monthStr, dayStr] = bsDateStr.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10); // 1-based (e.g., 4 = Shrawan)
        const day = parseInt(dayStr, 10);

        if (
          !year ||
          !month ||
          !day ||
          isNaN(year) ||
          isNaN(month) ||
          isNaN(day)
        ) {
          throw new Error('Invalid date components');
        }

        // Log input for debugging
        console.log('BS date input:', { year, month, day });

        // Convert BS to AD using bsToAd function
        const formattedBsDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const adDateStr = bsToAd(formattedBsDate);

        // Convert the AD date string to a Date object
        const adDate = new Date(adDateStr);

        // Validate the resulting date
        if (isNaN(adDate.getTime())) {
          throw new Error('Invalid AD date generated');
        }

        return adDate;
      } catch (error) {
        console.error('Invalid BS date string:', bsDateStr, error);
        return null;
      }
    }

    // Usage
    const bsBirthDateStr = validatedData.birthDate; // e.g., '2082-04-01'
    const adBirthDate = parseBsDateString(bsBirthDateStr);

    if (!adBirthDate) {
      return res.status(400).json({ error: 'Invalid BS birthDate string' });
    }

    console.log('AD birthDate:', adBirthDate);

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
        birthDate: adBirthDate, // Use the converted AD date
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

import { prisma } from '../utils/prisma.js';
import { createMotherSchema } from '../schemas/motherSchema.js'; // Import the new schema
import { parseBsDateString } from '../utils/helpers.js';

export const createMother = async (req, res) => {
  // Use Zod's safeParse to validate the request body
  const validationResult = createMotherSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validationResult.error.errors,
    });
  }

  const { fullName, lastName, ...motherData } = validationResult.data;

  const validatedData = validationResult.data;
  // Convert BS birth date to AD
  const bsBirthDateStr = validatedData.birthDate;
  const bsDose1DateStr = validatedData.tdDose1;
  const bsDose2DateStr = validatedData.tdDose2;
  const bsDose2PlusDateStr = validatedData.tdDose2Plus;

  const adBirthDate = parseBsDateString(bsBirthDateStr);
  const adDose1Date = parseBsDateString(bsDose1DateStr);
  const adDose2Date = parseBsDateString(bsDose2DateStr);
  const adDose2PlusDate = parseBsDateString(bsDose2PlusDateStr);

  try {
    // Combine full name and last name inside the controller
    const combinedName = `${fullName} ${lastName || ''}`.trim();

    const mother = await prisma.mother.create({
      data: {
        sewaDartaNumber: parseInt(validatedData.sewaDartaNumber, 10),
        phoneNumber: validatedData.phoneNumber,

        casteCode: parseInt(validatedData.casteCode, 10),
        age: parseInt(validatedData.age, 10),

        tole: validatedData.tole || '',

        wardNumber: parseInt(validatedData.wardNumber, 10),
        pregnancyCount: parseInt(validatedData.pregnancyCount),
        previousTDTakenCount: parseInt(validatedData.previousTDTakenCount),
        tdDose1: adDose1Date,
        tdDose2: adDose2Date,
        tdDose2Plus: adDose2PlusDate,
        name: combinedName,
        createdById: req.user.id, // Assuming user ID is from auth middleware
        remarks: validatedData.remarks || '',
        isFromOtherMunicipality: validatedData.isFromOtherMunicipality || false,
      },
    });

    res.status(201).json(mother);
  } catch (error) {
    console.error('Error creating mother:', error);
    res.status(500).json({
      error: 'Failed to create mother',
      details: error.message,
    });
  }
};

export const getMothers = async (req, res) => {
  try {
    const mothers = await prisma.mother.findMany();
    res.status(200).json(mothers);
  } catch (error) {
    console.error('Error fetching mothers:', error);
    res.status(500).json({
      error: 'Failed to fetch mothers',
      details: error.message,
    });
  }
};

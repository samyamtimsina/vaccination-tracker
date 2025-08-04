import { prisma } from '../utils/prisma.js';

export const createMother = async (req, res) => {
  try {
    const {
      sewaDartaNumber,
      fullName,
      lastName,
      casteCode,
      age,
      phoneNumber,
      tole,
      wardNumber,
      pregnancyCount,
      previousTDTakenCount,
      tdDose1,
      tdDose2,
      tdDose2Plus,
      remarks,
    } = req.body;

    const combinedFullName = `${fullName || ''} ${lastName || ''}`.trim();
    if (!combinedFullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    // Parse the number values using parseInt()
    const parsedSewaDartaNumber = parseInt(sewaDartaNumber, 10);
    const parsedCasteCode = parseInt(casteCode, 10);
    const parsedAge = parseInt(age, 10);
    const parsedWardNumber = parseInt(wardNumber, 10);
    const parsedPregnancyCount = parseInt(pregnancyCount, 10);
    const parsedPreviousTDTakenCount = parseInt(previousTDTakenCount, 10);

    const mother = await prisma.mother.create({
      data: {
        sewaDartaNumber: parsedSewaDartaNumber || null,
        name: combinedFullName,
        casteCode: parsedCasteCode || null,
        age: parsedAge || null,
        phoneNumber,
        tole,
        wardNumber: parsedWardNumber || null,
        pregnancyCount: parsedPregnancyCount || null,
        previousTDTakenCount: parsedPreviousTDTakenCount || null,
        tdDose1: tdDose1 ? new Date(tdDose1) : null,
        tdDose2: tdDose2 ? new Date(tdDose2) : null,
        tdDose2Plus: tdDose2Plus ? new Date(tdDose2Plus) : null,
        remarks,
        createdById: req.user.id,
      },
    });

    res.status(201).json(mother);
  } catch (error) {
    console.error('Error creating mother:', error);
    res
      .status(500)
      .json({ error: 'Failed to create mother', details: error.message });
  }
};

export const getMothers = async (req, res) => {
  try {
    const mothers = await prisma.mother.findMany();
    res.status(200).json(mothers);
  } catch (error) {
    console.error('Error fetching mothers:', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch mothers', details: error.message });
  }
};

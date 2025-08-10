import { prisma } from '../utils/prisma.js';
import { createMotherSchema } from '../schemas/motherSchema.js'; // Import the new schema

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

  try {
    // Combine full name and last name inside the controller
    const combinedName = `${fullName} ${lastName || ''}`.trim();

    const mother = await prisma.mother.create({
      data: {
        ...motherData,
        name: combinedName,
        createdById: req.user.id, // Assuming user ID is from auth middleware
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

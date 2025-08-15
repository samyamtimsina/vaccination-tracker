import { prisma } from '../utils/prisma.js';
import { createMotherSchema } from '../schemas/motherSchema.js';
import { parseBsDateString } from '../utils/helpers.js';

export const createMother = async (req, res) => {
  try {
    console.log('Received req.body:', req.body);

    // Validate the request body
    const validationResult = createMotherSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log('Validation errors:', validationResult.error.errors); // Log specific errors
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    console.log('Validated data:', validationResult.data); // Log full validated data

    const { fullName, lastName, tdDoses = [], ...motherData } = validationResult.data; // Default to empty array
    console.log('Validated mother data:', motherData);
    console.log('TD Doses:', tdDoses);
    console.log('Full Name:', fullName);
    console.log('Last Name:', lastName);

    const user = req.user; // Assuming user is available from auth middleware
    const combinedName = `${fullName} ${lastName || ''}`.trim();

    // Prepare TD dose data
    const tdDosesToCreate = Array.isArray(tdDoses)
      ? tdDoses.map((dose) => ({
        ...dose,
        dateGiven: parseBsDateString(dose.dateGiven),
        createdById: user.id,
      }))
      : [];

    console.log('TD Doses to create:', tdDosesToCreate); // Log before Prisma call

    const newMother = await prisma.mother.create({
      data: {
        ...motherData,
        name: combinedName,
        createdById: user.id,
        tdDoses: {
          create: tdDosesToCreate,
        },
      },
      include: {
        tdDoses: {
          include: {
            createdBy: {
              select: { id: true, name: true },
            },
            administeredBy: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    res.status(201).json(newMother);
  } catch (error) {
    console.error('Error creating mother record:', error);
    res.status(500).json({ error: 'Something went wrong.', details: error.message });
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

export const getWardMothers = async (req, res) => {
  try {
    if (!req.user || !req.user.wardId) {
      return res
        .status(401)
        .json({ error: 'Unauthorized. User or wardId not found.' });
    }
    const { wardId } = req.user;
    const mothers = await prisma.mother.findMany({
      where: {
        wardNumber: wardId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
        tdDoses: {
          include: {
            createdBy: {
              select: { id: true, name: true },
            },
            administeredBy: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!mothers) {
      return res.status(404).json({ error: 'No mothers found' });
    }

    res.status(200).json(mothers);

  } catch (error) {

  }
}

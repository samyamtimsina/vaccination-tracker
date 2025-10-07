import { prisma } from '../utils/prisma.js';
import { createMotherSchema } from '../schemas/motherSchema.js';
import { parseBsDateString } from '../utils/helpers.js';

export const createMother = async (req, res) => {
  try {
    // Parse dateOfBirth from BS to AD before validation
    let { dateOfBirth, tdDoses = [], ...rest } = req.body;

    // Convert dateOfBirth if present
    if (dateOfBirth) {
      dateOfBirth = parseBsDateString(dateOfBirth);
    }

    // Convert all tdDoses.dateGiven from BS to AD
    const tdDosesParsed = Array.isArray(tdDoses)
      ? tdDoses.map((dose) => ({
        ...dose,
        dateGiven: dose.dateGiven ? parseBsDateString(dose.dateGiven) : null,
      }))
      : [];

    // Validate the request body with converted dates
    const validationResult = createMotherSchema.safeParse({
      ...rest,
      dateOfBirth,
      tdDoses: tdDosesParsed,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    const { fullName, lastName, ...motherData } = validationResult.data;

    // Use req.user for ward and createdById
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Prepare TD dose data
    const tdDosesToCreate = Array.isArray(motherData.tdDoses)
      ? motherData.tdDoses.map((dose) => ({
        ...dose,
        createdById: user.id,
      }))
      : [];

    const newMother = await prisma.mother.create({
      data: {
        ...motherData,
        name: `${fullName} ${lastName || ''}`.trim(),
        createdById: user.id,
        wardNumber: user.wardId, // Set ward from user
        tdDoses: {
          create: tdDosesToCreate,
        },
      },
      include: {
        tdDoses: {
          include: {
            createdBy: { select: { id: true, name: true } },
            administeredBy: { select: { id: true, name: true } },
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

// Get all mothers (admin/superadmin, paginated, partial fields)
export const getAllMothers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [total, mothers] = await Promise.all([
      prisma.mother.count(),
      prisma.mother.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          sewaDartaNumber: true,
          name: true,
          casteCode: true,
          dateOfBirth: true,
          phoneNumber: true,
          tole: true,
          wardNumber: true,
          pregnancyCount: true,
          previousTDTakenCount: true,
          remarks: true,
          createdAt: true,
          isFromOtherMunicipality: true,
          tdDoses: { select: { id: true, doseNumber: true } },
          createdBy: { select: { id: true, name: true } },
        }
      })
    ]);
    res.status(200).json({ mothers, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mothers', details: error.message });
  }
};

// Get mothers for a ward (ward officer, paginated, partial fields)
export const getWardMothers = async (req, res) => {
  try {
    if (!req.user || !req.user.wardId) {
      return res.status(401).json({ error: 'Unauthorized. User or wardId not found.' });
    }
    const { wardId } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [total, mothers] = await Promise.all([
      prisma.mother.count({ where: { wardNumber: wardId } }),
      prisma.mother.findMany({
        where: { wardNumber: wardId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          sewaDartaNumber: true,
          name: true,
          casteCode: true,
          dateOfBirth: true,
          phoneNumber: true,
          tole: true,
          wardNumber: true,
          pregnancyCount: true,
          previousTDTakenCount: true,
          remarks: true,
          createdAt: true,
          isFromOtherMunicipality: true,
          tdDoses: { select: { id: true, doseNumber: true } },
          createdBy: { select: { id: true, name: true } },
        }
      })
    ]);
    res.status(200).json({ mothers, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mothers', details: error.message });
  }
};

// Search mothers (paginated, partial fields)
export const searchMothers = async (req, res) => {
  try {
    const { name, phoneNumber, sewaDartaNumber, wardId, createdByMe, page = 1, limit = 20 } = req.query;
    const user = req.user;
    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (phoneNumber) where.phoneNumber = { contains: phoneNumber, mode: 'insensitive' };
    if (sewaDartaNumber) where.sewaDartaNumber = Number(sewaDartaNumber);
    if (wardId && wardId !== 'all') where.wardNumber = Number(wardId);
    if (createdByMe && user) where.createdById = user.id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [total, mothers] = await Promise.all([
      prisma.mother.count({ where }),
      prisma.mother.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          sewaDartaNumber: true,
          name: true,
          casteCode: true,
          dateOfBirth: true,
          phoneNumber: true,
          tole: true,
          wardNumber: true,
          pregnancyCount: true,
          previousTDTakenCount: true,
          remarks: true,
          createdAt: true,
          isFromOtherMunicipality: true,
          tdDoses: { select: { id: true, doseNumber: true } },
          createdBy: { select: { id: true, name: true } },
        }
      })
    ]);
    res.status(200).json({ mothers, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search mothers', details: error.message });
  }
};

// Get single mother (full details)
export const getMother = async (req, res) => {
  try {
    const { sewaDartaNumber } = req.params;
    const mother = await prisma.mother.findUnique({
      where: { sewaDartaNumber: Number(sewaDartaNumber) },
      include: {
        tdDoses: {
          include: {
            createdBy: { select: { id: true, name: true } },
            administeredBy: { select: { id: true, name: true } },
          },
        },
        createdBy: { select: { id: true, name: true } },
      },
    });
    if (!mother) {
      return res.status(404).json({ error: 'Mother not found' });
    }
    res.status(200).json(mother);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mother', details: error.message });
  }
};

// Update a mother
// motherController.js

export const updateMother = async (req, res) => {
  try {
    const { sewaDartaNumber } = req.params;
    let { dateOfBirth, tdDoses = [], ...rest } = req.body;

    // Convert dateOfBirth from BS to AD
    if (dateOfBirth) {
      dateOfBirth = parseBsDateString(dateOfBirth);
    }

    // Convert all tdDoses.dateGiven from BS to AD
    const tdDosesParsed = Array.isArray(tdDoses)
      ? tdDoses.map((dose) => ({
        ...dose,
        dateGiven: dose.dateGiven ? parseBsDateString(dose.dateGiven) : null,
      }))
      : [];

    // Validate
    const validationResult = createMotherSchema.safeParse({
      ...rest,
      dateOfBirth,
      tdDoses: tdDosesParsed,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    // FIX LINE: Destructure tdDoses out of the validated data
    const { fullName, lastName, tdDoses: validatedTDDoses, ...motherDataWithoutDoses } = validationResult.data;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 1. Update mother main fields (Use motherDataWithoutDoses)
    const updatedMother = await prisma.mother.update({
      where: { sewaDartaNumber: Number(sewaDartaNumber) },
      data: {
        ...motherDataWithoutDoses,
        name: `${fullName} ${lastName || ''}`.trim(),
      },
    });

    // 2. Remove all previous tdDoses and re-create (simple approach)
    await prisma.tDDose.deleteMany({
      where: { motherId: updatedMother.id },
    });
    // Use the validated array
    if (validatedTDDoses.length > 0) {
      await prisma.tDDose.createMany({
        data: validatedTDDoses.map((dose) => ({
          ...dose,
          motherId: updatedMother.id,
          createdById: user.id,
        })),
      });
    }

    // 3. Return updated mother with doses
    const motherWithDoses = await prisma.mother.findUnique({
      where: { sewaDartaNumber: Number(sewaDartaNumber) },
      include: {
        tdDoses: {
          include: {
            createdBy: { select: { id: true, name: true } },
            administeredBy: { select: { id: true, name: true } },
          },
        },
        createdBy: { select: { id: true, name: true } },
      },
    });

    res.status(200).json(motherWithDoses);
  } catch (error) {
    console.error('Error updating mother:', error);
    res.status(500).json({ error: 'Failed to update mother', details: error.message });
  }
};
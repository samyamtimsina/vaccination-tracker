import { prisma } from '../utils/prisma.js';

export const createCitizen = async (req, res) => {
  const {
    fullName,
    wardNumber,
    parentName,
    address,
    phoneNumber,
    casteCode,
    birthDate,
    vaccinations,
  } = req.body;

  try {
    const citizen = await prisma.citizen.create({
      data: {
        fullName,
        wardNumber,
        parentName,
        address,
        phoneNumber,
        casteCode,
        birthDate: new Date(birthDate),
        createdById: req.user.id,
        vaccinations: {
          create: vaccinations.map((v) => ({
            vaccineType: v.vaccineType,
            customVaccineName: v.customVaccineName || null,
            doseNumber: v.doseNumber,
            date: new Date(v.dateGiven),
            isComplete: v.isComplete,
            remarks: v.remarks,
            recommendedAtMonth: v.recommendedAtMonths,
          })),
        },
      },
      include: {
        vaccinations: true,
      },
    });
    res.status(201).json(citizen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Citizen creation failed' });
  }
};

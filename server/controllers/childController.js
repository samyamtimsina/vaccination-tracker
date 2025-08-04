import { prisma } from '../utils/prisma.js';
import { vaccineSchedule } from '../utils/vaccineSchedule.js';

// Helper to convert days/weeks/months to months (approximate)
function toMonths({
  recommendedAtDays = 0,
  recommendedAtWeeks = 0,
  recommendedAtMonths = 0,
}) {
  return (
    recommendedAtMonths + recommendedAtWeeks / 4.345 + recommendedAtDays / 30.44
  );
}

function mapVaccineNameToEnum(name) {
  if (!name) return 'OTHERS';
  const normalized = name.toLowerCase();

  switch (normalized) {
    case 'bcg':
      return 'BCG';
    case 'rota':
      return 'ROTA';
    case 'polio':
    case 'opv': // added here
      return 'OPV';
    case 'fipv':
      return 'fIPV';
    case 'pcv':
      return 'PCV';
    case 'dpt-hepb-hib':
    case 'dpt_hepb_hib':
    case 'dpthepbhib':
      return 'DPT_HepB_hib';
    case 'mr':
      return 'MR';
    case 'je':
      return 'JE';
    case 'tcv':
      return 'TCV';
    case 'hpv':
      return 'HPV';
    default:
      return 'OTHERS';
  }
}

//create child
export const createChild = async (req, res) => {
  try {
    const {
      sewaDartaNumber,
      fullName,
      lastName,
      wardNumber,
      parentName,
      tole,
      phoneNumber,
      gender,
      casteCode,
      birthDate,
      vaccines = {},
      purnaKhop = false,
      remarks = '',
    } = req.body;

    const combinedFullName = `${fullName || ''} ${lastName || ''}`.trim();
    if (!combinedFullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    const parsedSewaDartaNumber = parseInt(sewaDartaNumber, 10);
    const parsedCasteCode = parseInt(casteCode, 10);
    const parsedWardNumber = parseInt(wardNumber, 10);

    const vaccinationCreateData = Object.entries(vaccines).flatMap(
      ([vaccineName, doses]) => {
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
      },
    );

    const child = await prisma.child.create({
      data: {
        sewaDartaNumber: parsedSewaDartaNumber,
        fullName: combinedFullName,
        wardNumber: parsedWardNumber,
        parentName: parentName?.trim() || '',
        tole: tole?.trim() || '',
        phoneNumber: phoneNumber?.trim() || '',
        gender,
        casteCode: parsedCasteCode,
        birthDate: new Date(birthDate),
        createdById: req.user.id,
        vaccinations: {
          create: vaccinationCreateData,
        },
        purnaKhop,
        remarks,
      },
      include: { vaccinations: true },
    });

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

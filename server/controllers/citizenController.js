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
  switch (name) {
    case 'BCG':
      return 'BCG';
    case 'Rota':
      return 'ROTA';
    case 'Polio':
      return 'OPV';
    case 'fIPV':
      return 'fIPV';
    case 'PCV':
      return 'PCV';
    case 'DPT-HepB-Hib':
      return 'DPT_HepB_hib';
    case 'MR':
      return 'MR';
    case 'JE':
      return 'JE';
    case 'TCV':
      return 'TCV';
    case 'HPV':
      return 'HPV';
    default:
      return 'OTHERS';
  }
}

export const createCitizen = async (req, res) => {
  try {
    const { citizens } = req.body;

    if (!Array.isArray(citizens)) {
      return res.status(400).json({ error: 'Invalid citizens data' });
    }

    const createdCitizens = [];

    for (const c of citizens) {
      const fullName = ((c.fullName || '') + ' ' + (c.lastName || '')).trim();
      if (!fullName) continue; // skip empty

      const wardNumber = c.wardNumber;
      const casteCode = Number(c.casteCode);
      const birthDate = new Date(c.birthDate);

      // Prepare vaccinations array with recommendedAtMonths included
      const vaccinationCreateData = Object.entries(c.vaccines).flatMap(
        ([vaccineName, doses]) => {
          const vaccineTypeEnum = mapVaccineNameToEnum(vaccineName);

          // get vaccine schedule for this vaccine enum key
          const schedule = vaccineSchedule[vaccineTypeEnum] || [];

          return doses
            .map((dateGiven, idx) => {
              if (!dateGiven) return null;

              // Dose numbers start at 1
              const doseNumber = idx + 1;

              // Find matching dose schedule for recommended time
              const doseSchedule = schedule.find((d) => d.dose === doseNumber);

              if (!doseSchedule) {
                // For unknown doses, use 0 as fallback
                return {
                  vaccineType: vaccineTypeEnum,
                  doseNumber,
                  dateGiven: new Date(dateGiven),
                  isComplete: true,
                  recommendedAtMonths: 0,
                };
              }

              // Calculate recommendedAtMonths for this dose
              const recommendedAtMonths =
                Math.round(toMonths(doseSchedule) * 100) / 100;

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

      const citizen = await prisma.citizen.create({
        data: {
          fullName,
          wardNumber,
          parentName: (c.parentName || '').trim(),
          tole: (c.tole || '').trim(),
          phoneNumber: (c.phoneNumber || '').trim(),
          gender: c.gender,
          casteCode,
          birthDate,
          createdById: req.user.id,
          vaccinations: {
            create: vaccinationCreateData,
          },
          purnaKhop: c.purnaKhop || false,
          remarks: c.remarks || '',
        },
        include: { vaccinations: true },
      });

      createdCitizens.push(citizen);
    }

    res.status(201).json(createdCitizens);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Citizen creation failed', details: error.message });
  }
};

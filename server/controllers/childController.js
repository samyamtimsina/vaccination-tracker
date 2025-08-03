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
  console.log('Mapping vaccine name:', name);
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
export const createChild = async (req, res) => {
  try {
    const { childs } = req.body;

    if (!Array.isArray(childs)) {
      return res.status(400).json({ error: 'Invalid Child data' });
    }

    const createdChilds = [];

    for (const c of childs) {
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

      const child = await prisma.child.create({
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

      createdChilds.push(child);
    }

    res.status(201).json(createdChilds);
  } catch (error) {
    console.error(error);
    res.status(500);
    console.log.json({
      error: 'Child creation failed',
      details: error.message,
    });
  }
};

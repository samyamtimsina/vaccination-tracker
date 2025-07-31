import { vaccineSchedule } from './vaccineSchedule.js';

function addTimeToDate(date, { days = 0, weeks = 0, months = 0 }) {
  const newDate = new Date(date);
  if (days) newDate.setDate(newDate.getDate() + days);
  if (weeks) newDate.setDate(newDate.getDate() + weeks * 7);
  if (months) newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

export function getVaccinationStatus(birthDate, vaccinations) {
  const today = new Date();

  // Map vaccinations by vaccineType and doseNumber for quick lookup
  const vaccinationMap = {};
  vaccinations.forEach((v) => {
    if (!vaccinationMap[v.vaccineType]) vaccinationMap[v.vaccineType] = {};
    vaccinationMap[v.vaccineType][v.doseNumber] = v;
  });

  const status = [];

  for (const vaccineType in vaccineSchedule) {
    const doses = vaccineSchedule[vaccineType];

    const dosesStatus = doses.map(
      ({
        dose,
        recommendedAtDays,
        recommendedAtWeeks,
        recommendedAtMonths,
      }) => {
        // Calculate due date using birthDate + recommended time
        const dueDate = addTimeToDate(birthDate, {
          days: recommendedAtDays || 0,
          weeks: recommendedAtWeeks || 0,
          months: recommendedAtMonths || 0,
        });

        //lookup if a record for this specific vaccinetype and dose exists
        const record = vaccinationMap[vaccineType]?.[dose];

        let doseStatus = 'pending';
        if (record) {
          doseStatus = 'completed';
        } else if (today > dueDate) {
          doseStatus = 'overdue';
        } else {
          doseStatus = 'due'; // Not yet due or upcoming
        }

        return {
          doseNumber: dose,
          dueDate,
          status: doseStatus,
          dateGiven: record ? record.dateGiven : null,
        };
      },
    );

    status.push({
      vaccineType,
      doses: dosesStatus,
    });
  }

  return status;
}

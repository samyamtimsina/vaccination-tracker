// recalculateChildVaccines.js
import { prisma } from '../utils/prisma.js';
import { getMissedPrimaryVaccineTypes, calculateDueDate, sendCorrectionSMS } from '../utils/helpers.js';
import dayjs from 'dayjs';

// Helper to calculate age in months
const getAgeInMonths = (birthDate) => dayjs().diff(dayjs(birthDate), 'month');

// Helper to get changed vaccine types between versions
const getChangedVaccineTypes = async (oldVersionId, newVersionId) => {
    const oldDoses = await prisma.dose.findMany({ where: { scheduleVersionId: oldVersionId } });
    const newDoses = await prisma.dose.findMany({ where: { scheduleVersionId: newVersionId } });

    const changedTypes = new Set();

    // Compare doses
    newDoses.forEach((newDose) => {
        const oldDose = oldDoses.find(d => d.vaccineTypeId === newDose.vaccineTypeId && d.doseNumber === newDose.doseNumber);
        if (!oldDose ||
            oldDose.recommendedAtDays !== newDose.recommendedAtDays ||
            oldDose.recommendedAtWeeks !== newDose.recommendedAtWeeks ||
            oldDose.recommendedAtMonths !== newDose.recommendedAtMonths ||
            oldDose.recommendedAtYears !== newDose.recommendedAtYears ||
            oldDose.isBooster !== newDose.isBooster ||
            oldDose.isPrimary !== newDose.isPrimary ||
            oldDose.maxAgeDays !== newDose.maxAgeDays ||
            oldDose.maxAgeWeeks !== newDose.maxAgeWeeks ||
            oldDose.maxAgeMonths !== newDose.maxAgeMonths ||
            oldDose.maxAgeYears !== newDose.maxAgeYears
        ) {
            changedTypes.add(newDose.vaccineTypeId);
        }
    });

    // Also include removed types
    oldDoses.forEach((oldDose) => {
        if (!newDoses.some(d => d.vaccineTypeId === oldDose.vaccineTypeId && d.doseNumber === oldDose.doseNumber)) {
            changedTypes.add(oldDose.vaccineTypeId);
        }
    });

    return Array.from(changedTypes);
};

export const recalculateChildVaccines = async (newScheduleVersionId, oldScheduleVersionId) => {
    console.log(`--- Recalculation started for schedule version ${newScheduleVersionId} (from ${oldScheduleVersionId}) ---`);

    const changedVaccineTypeIds = await getChangedVaccineTypes(oldScheduleVersionId, newScheduleVersionId);
    if (changedVaccineTypeIds.length === 0) {
        console.log('No changes detected in doses. Skipping recalculation.');
        return;
    }
    console.log(`Changed vaccine types: ${changedVaccineTypeIds}`);

    const children = await prisma.child.findMany({
        include: { dueVaccines: true, vaccinations: true },
    });

    let totalChanges = 0;

    for (const child of children) {
        console.log(`Processing child: ${child.fullName} (${child.id})`);
        const birthDate = child.birthDate;
        const ageMonths = getAgeInMonths(birthDate);

        const missedPrimaryVaccineTypeIds = await getMissedPrimaryVaccineTypes(child.id);
        const scheduleDoses = await prisma.dose.findMany({
            where: {
                scheduleVersionId: newScheduleVersionId,
                vaccineTypeId: { in: changedVaccineTypeIds },
            },
        });

        for (const dose of scheduleDoses) {
            const existingDue = child.dueVaccines.find(
                (v) => v.vaccineTypeId === dose.vaccineTypeId && v.doseNumber === dose.doseNumber
            );

            const newDueDate = calculateDueDate(birthDate, dose);
            const oldDueDate = existingDue ? new Date(existingDue.dueDate) : null;

            console.log(`Dose: VaccineType ${dose.vaccineTypeId}, DoseNumber ${dose.doseNumber}`);
            console.log(`Existing due: ${oldDueDate}`);
            console.log(`Calculated new due: ${newDueDate}`);

            const isPrimary = dose.isPrimary;

            if (!existingDue) {
                console.log(`Creating new due (${isPrimary ? 'primary' : 'booster'})`);
                await prisma.childDueVaccine.create({
                    data: {
                        childId: child.id,
                        vaccineTypeId: dose.vaccineTypeId,
                        doseNumber: dose.doseNumber,
                        dueDate: newDueDate,
                        isCompleted: false,
                        catchUpLocked: false,
                        notificationSent: false,
                        correctiveSent: false,
                        scheduleVersion: newScheduleVersionId,
                        isCatchUp: false,  // Regular dose
                    },
                });
                totalChanges++;
            } else if (!existingDue.isCompleted &&
                (isPrimary || (!existingDue.catchUpLocked)) &&
                oldDueDate.getTime() !== newDueDate.getTime()) {
                console.log(`Updating due date (${isPrimary ? 'primary' : 'booster'})`);
                await prisma.childDueVaccine.update({
                    where: { id: existingDue.id },
                    data: {
                        previousDueDate: existingDue.dueDate,
                        dueDate: newDueDate,
                        correctiveSent: existingDue.notificationSent ? true : false,
                        scheduleVersion: newScheduleVersionId,
                    },
                });
                if (existingDue.notificationSent) {
                    console.log('Sending correction SMS');
                    await sendCorrectionSMS(child, dose, newDueDate);
                }
                totalChanges++;
            } else {
                console.log('No change needed');
            }
        }
    }

    console.log(`--- Recalculation completed. Total changes: ${totalChanges} ---`);
};
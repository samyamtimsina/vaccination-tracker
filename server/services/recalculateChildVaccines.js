// recalculateChildVaccines.js
import { prisma } from '../utils/prisma.js';
import { getMissedPrimaryVaccineTypes, calculateDueDate, isChildOverMonths, sendCorrectionSMS, addMonthsToDate } from '../utils/helpers.js';  // Assume addMonthsToDate handles approximate month adds
import dayjs from 'dayjs';

// Helper to calculate age in months
const getAgeInMonths = (birthDate) => dayjs().diff(dayjs(birthDate), 'month');

// Helper to convert rule maxAge to months (approximate)
const getMaxAgeMonths = (rule) => {
    let months = rule.maxAgeMonths || 0;
    months += (rule.maxAgeWeeks || 0) / 4.345;
    months += (rule.maxAgeDays || 0) / 30.44;
    months += (rule.maxAgeYears || 0) * 12;
    return months;
};

// Helper to get changed vaccine types between versions
// Helper to get changed vaccine types between versions
const getChangedVaccineTypes = async (oldVersionId, newVersionId) => {
    const oldDoses = await prisma.dose.findMany({ where: { scheduleVersionId: oldVersionId } });
    const newDoses = await prisma.dose.findMany({ where: { scheduleVersionId: newVersionId } });
    const oldRules = await prisma.catchUpRule.findMany({ where: { scheduleVersionId: oldVersionId } });
    const newRules = await prisma.catchUpRule.findMany({ where: { scheduleVersionId: newVersionId } });

    const changedTypes = new Set();

    // Compare doses
    newDoses.forEach((newDose) => {
        const oldDose = oldDoses.find(d => d.vaccineTypeId === newDose.vaccineTypeId && d.doseNumber === newDose.doseNumber);
        if (!oldDose ||
            oldDose.recommendedAtDays !== newDose.recommendedAtDays ||
            oldDose.recommendedAtWeeks !== newDose.recommendedAtWeeks ||
            oldDose.recommendedAtMonths !== newDose.recommendedAtMonths ||
            oldDose.recommendedAtYears !== newDose.recommendedAtYears ||
            oldDose.isBooster !== newDose.isBooster) {
            changedTypes.add(newDose.vaccineTypeId);
        }
    });

    // Compare catch-up rules
    newRules.forEach((newRule) => {
        const oldRule = oldRules.find(r => r.vaccineTypeId === newRule.vaccineTypeId);
        if (!oldRule ||
            oldRule.maxAgeDays !== newRule.maxAgeDays ||
            oldRule.maxAgeWeeks !== newRule.maxAgeWeeks ||
            oldRule.maxAgeMonths !== newRule.maxAgeMonths ||
            oldRule.maxAgeYears !== newRule.maxAgeYears ||
            oldRule.minIntervalWeeks !== newRule.minIntervalWeeks ||
            oldRule.totalDoses !== newRule.totalDoses) {
            changedTypes.add(newRule.vaccineTypeId);
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
        console.log('No changes detected in doses or rules. Skipping recalculation.');
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
        const catchUpRules = await prisma.catchUpRule.findMany({
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

            const isPrimary = !dose.isBooster;  // Fixed assumption

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
                (isPrimary || (!existingDue.catchUpLocked)) &&  // Respect lock for non-primary
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

        // Handle catch-up rules for changed types
        for (const rule of catchUpRules) {
            if (!missedPrimaryVaccineTypeIds.includes(rule.vaccineTypeId)) continue;  // Only if missed

            const maxAgeMonths = getMaxAgeMonths(rule);
            if (ageMonths > maxAgeMonths) continue;  // Too old for catch-up

            // Delete old catch-up dues for this type (if not completed/locked)
            await prisma.childDueVaccine.deleteMany({
                where: {
                    childId: child.id,
                    vaccineTypeId: rule.vaccineTypeId,
                    isCatchUp: true,
                    isCompleted: false,
                    catchUpLocked: false,
                },
            });

            // Generate new catch-up doses (e.g., compressed schedule)
            let currentDueDate = new Date();  // Start now
            for (let doseNum = 1; doseNum <= rule.totalDoses; doseNum++) {
                console.log(`Creating catch-up dose ${doseNum} for ${rule.vaccineTypeId}`);
                await prisma.childDueVaccine.create({
                    data: {
                        childId: child.id,
                        vaccineTypeId: rule.vaccineTypeId,
                        doseNumber: doseNum,  // Sequential for catch-up
                        dueDate: currentDueDate,
                        isCompleted: false,
                        catchUpLocked: false,
                        notificationSent: false,
                        correctiveSent: false,
                        scheduleVersion: newScheduleVersionId,
                        isCatchUp: true,
                    },
                });
                totalChanges++;
                // Add min interval for next
                if (rule.minIntervalWeeks) {
                    currentDueDate = addMonthsToDate(currentDueDate, rule.minIntervalWeeks / 4.345);
                }
            }
        }
    }

    console.log(`--- Recalculation completed. Total changes: ${totalChanges} ---`);
};
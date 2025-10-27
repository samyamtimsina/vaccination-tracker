import { prisma } from '../utils/prisma.js';
import { getMissedPrimaryVaccineTypes, calculateDueDate, sendCorrectionSMS } from '../utils/helpers.js';
import dayjs from 'dayjs';

const BATCH_SIZE = 1000; // Adjust based on memory

// Calculate age in months
const getAgeInMonths = (birthDate) => dayjs().diff(dayjs(birthDate), 'month');

// Simple log with timestamp
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

// Prefetch doses for given vaccine types
const getScheduleDosesMap = async (scheduleVersionId, changedVaccineTypeIds) => {
    const doses = await prisma.dose.findMany({
        where: { scheduleVersionId, vaccineTypeId: { in: changedVaccineTypeIds } },
    });

    const doseMap = new Map();
    doses.forEach(d => {
        if (!doseMap.has(d.vaccineTypeId)) doseMap.set(d.vaccineTypeId, new Map());
        doseMap.get(d.vaccineTypeId).set(d.doseNumber, d);
    });

    return doseMap;
};

// Get changed vaccine types between old/new versions
export const getChangedVaccineTypes = async (oldVersionId, newVersionId) => {
    const oldDoses = await prisma.dose.findMany({ where: { scheduleVersionId: oldVersionId } });
    const newDoses = await prisma.dose.findMany({ where: { scheduleVersionId: newVersionId } });

    const changedTypes = new Set();

    newDoses.forEach(newDose => {
        const oldDose = oldDoses.find(d =>
            d.vaccineTypeId === newDose.vaccineTypeId && d.doseNumber === newDose.doseNumber
        );
        if (
            !oldDose ||
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

    oldDoses.forEach(oldDose => {
        if (!newDoses.some(d => d.vaccineTypeId === oldDose.vaccineTypeId && d.doseNumber === oldDose.doseNumber)) {
            changedTypes.add(oldDose.vaccineTypeId);
        }
    });

    return Array.from(changedTypes);
};

// 🧩 Main recalculation function (fixed version)
export const recalculateChildVaccines = async (newScheduleVersionId, oldScheduleVersionId) => {
    log(`--- Recalculation started for schedule version ${newScheduleVersionId} ---`);

    const changedVaccineTypeIds = await getChangedVaccineTypes(oldScheduleVersionId, newScheduleVersionId);
    if (changedVaccineTypeIds.length === 0) {
        log('No changes detected. Skipping recalculation.');
        return;
    }
    log(`Changed vaccine types: ${changedVaccineTypeIds}`);

    const scheduleDosesMap = await getScheduleDosesMap(newScheduleVersionId, changedVaccineTypeIds);

    const totalChildren = await prisma.child.count();
    log(`Total children to process: ${totalChildren}`);

    let skip = 0;
    let totalChanges = 0;

    while (true) {
        const children = await prisma.child.findMany({
            skip,
            take: BATCH_SIZE,
            include: { dueVaccines: true, vaccinations: true },
        });

        if (children.length === 0) break;

        const newDueVaccines = [];
        const updateDueVaccines = [];
        const correctionSMSQueue = [];

        for (const child of children) {
            const birthDate = child.birthDate;

            //  Optional if you use it elsewhere
            const missedPrimaryVaccineTypeIds = await getMissedPrimaryVaccineTypes(child.id);

            // ️ Pre-index given vaccines to prevent re-creating deleted ones
            const givenDoses = new Set(
                child.vaccinations.map(v => `${v.vaccineTypeId}-${v.doseNumber}`)
            );

            for (const vaccineTypeId of changedVaccineTypeIds) {
                const dosesMap = scheduleDosesMap.get(vaccineTypeId);
                if (!dosesMap) continue;

                for (const [doseNumber, dose] of dosesMap) {
                    const existingDue = child.dueVaccines.find(
                        v => v.vaccineTypeId === dose.vaccineTypeId && v.doseNumber === dose.doseNumber
                    );

                    const newDueDate = calculateDueDate(birthDate, dose);
                    const oldDueDate = existingDue ? new Date(existingDue.dueDate) : null;
                    const isPrimary = dose.isPrimary;

                    const alreadyGiven = givenDoses.has(`${dose.vaccineTypeId}-${dose.doseNumber}`);

                    //  Only create new due if not already given AND no existing due
                    if (!existingDue && !alreadyGiven) {
                        newDueVaccines.push({
                            childId: child.id,
                            vaccineTypeId: dose.vaccineTypeId,
                            doseNumber: dose.doseNumber,
                            dueDate: newDueDate,
                            isCompleted: false,
                            catchUpLocked: false,
                            notificationSent: false,
                            correctiveSent: false,
                            scheduleVersion: newScheduleVersionId,
                            isCatchUp: false,
                        });
                        totalChanges++;
                    }
                    //  Only update existing if not completed and due date changed
                    else if (
                        existingDue &&
                        !existingDue.isCompleted &&
                        (isPrimary || !existingDue.catchUpLocked) &&
                        oldDueDate.getTime() !== newDueDate.getTime()
                    ) {
                        updateDueVaccines.push({
                            id: existingDue.id,
                            previousDueDate: existingDue.dueDate,
                            dueDate: newDueDate,
                            correctiveSent: existingDue.notificationSent ? true : false,
                            scheduleVersion: newScheduleVersionId,
                        });

                        if (existingDue.notificationSent) {
                            correctionSMSQueue.push({ child, dose, newDueDate });
                        }
                        totalChanges++;
                        console.log(
                            `Updated dueDate for child ${child.id}, vaccineType ${dose.vaccineTypeId}, dose ${doseNumber}`
                        );
                    }
                }
            }
        }

        // Bulk insert new due vaccines
        if (newDueVaccines.length > 0) {
            await prisma.childDueVaccine.createMany({
                data: newDueVaccines,
                skipDuplicates: true,
            });
        }

        // Sequential update (small batches for safety)
        for (const upd of updateDueVaccines) {
            await prisma.childDueVaccine.update({
                where: { id: upd.id },
                data: {
                    previousDueDate: upd.previousDueDate,
                    dueDate: upd.dueDate,
                    correctiveSent: upd.correctiveSent,
                    scheduleVersion: upd.scheduleVersion,
                },
            });
        }

        // Send correction SMS
        for (const sms of correctionSMSQueue) {
            sendCorrectionSMS(sms.child, sms.dose, sms.newDueDate).catch(err => console.error(err));
        }

        skip += BATCH_SIZE;
        console.log(`Processed ${skip}/${totalChildren} children so far. Total changes: ${totalChanges}`);

        // Prevent CPU/memory spike
        await new Promise(r => setTimeout(r, 20));
    }

    log(`--- Recalculation completed. Total changes: ${totalChanges} ---`);
};

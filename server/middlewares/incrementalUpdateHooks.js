// File: server/middleware/incrementalUpdateHooks.js

import { prisma } from '../utils/prisma.js';
import { clearCache } from '../utils/analyticsCache.js';

export async function updateChildFactOnVaccination(vacc) {
    const dayStr = format(vacc.dateGiven, 'yyyy-MM-dd');
    const child = await prisma.child.findUnique({ where: { id: vacc.citizenId }, select: { gender: true, birthDate: true, wardNumber: true, casteCode: true } });
    if (!child) return;

    const ageGroup = (() => {
        const ageMs = Date.now() - new Date(child.birthDate).getTime();
        return ageMs < 3.156e10 ? '0-1y' : ageMs < 1.577e11 ? '1-5y' : '5y+';
    })();

    const key = {
        day: dayStr,
        ward: vacc.wardOfVaccination || child.wardNumber,
        vaccineTypeId: vacc.vaccineTypeId,
        doseNumber: vacc.doseNumber,
        gender: child.gender,
        ageGroup,
        casteCode: child.casteCode
    };

    await prisma.childAnalyticsFact.upsert({
        where: { day_ward_vaccineTypeId_doseNumber_gender_ageGroup_casteCode: key },
        update: { vaccinatedChildren: { increment: vacc.isComplete ? 1 : 0 }, updatedAt: new Date() },
        create: { ...key, totalRegisteredChildren: 1, vaccinatedChildren: vacc.isComplete ? 1 : 0, zeroDoseChildren: 0, dueToday: 0, overdue: 0, onTime: 0, late: 0, dropoutRate: 0 }
    });

    clearCache();
}

export async function updateMotherFactOnTD(td) {
    const dayStr = format(td.dateGiven, 'yyyy-MM-dd');
    const mother = await prisma.mother.findUnique({ where: { id: td.motherId }, select: { wardNumber: true, casteCode: true } });
    if (!mother) return;

    const key = { day: dayStr, ward: mother.wardNumber, doseNumber: td.doseNumber, casteCode: mother.casteCode };

    await prisma.motherAnalyticsFact.upsert({
        where: { day_ward_doseNumber_casteCode: key },
        update: { tdDosesGiven: { increment: 1 }, mothersWithFullTD: { increment: td.doseNumber >= 2 ? 1 : 0 }, updatedAt: new Date() },
        create: { ...key, totalRegisteredMothers: 1, tdDosesGiven: 1, mothersWithZeroTD: 0, mothersWithFullTD: td.doseNumber >= 2 ? 1 : 0, dueToday: 0, overdue: 0 }
    });

    clearCache();
}

export async function updateGrowthFactOnWeight(wr) {
    const dayStr = format(wr.date, 'yyyy-MM-dd');
    const child = await prisma.child.findUnique({ where: { id: wr.childId }, select: { gender: true, birthDate: true, casteCode: true } });
    if (!child) return;

    const ageGroup = (() => {
        const ageMs = Date.now() - new Date(child.birthDate).getTime();
        return ageMs < 3.156e10 ? '0-1y' : ageMs < 1.577e11 ? '1-5y' : '5y+';
    })();

    const key = { day: dayStr, ward: wr.wardOfVaccination, gender: child.gender, ageGroup, casteCode: child.casteCode };

    // Simplified thresholds; use percentiles in worker for accuracy
    const under = wr.weight < 5 ? 1 : 0;
    const normal = wr.weight >= 5 && wr.weight <= 20 ? 1 : 0;
    const over = wr.weight > 20 ? 1 : 0;

    await prisma.growthAnalyticsFact.upsert({
        where: { day_ward_gender_ageGroup_casteCode: key },
        update: {
            totalWeightRecords: { increment: 1 },
            underweightCount: { increment: under },
            normalWeightCount: { increment: normal },
            overweightCount: { increment: over },
            updatedAt: new Date()
        },
        create: { ...key, totalWeightRecords: 1, avgWeightKg: wr.weight, underweightCount: under, normalWeightCount: normal, overweightCount: over }
    });

    clearCache();
}

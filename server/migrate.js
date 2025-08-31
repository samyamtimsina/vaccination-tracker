import { PrismaClient } from './generated/prisma/client.js';

const prisma = new PrismaClient();

const vaccineSchedule = {
    BCG: [{ dose: 1, recommendedAtDays: 0 }],
    DPT_HepB_hib: [
        { dose: 1, recommendedAtWeeks: 6 },
        { dose: 2, recommendedAtWeeks: 10 },
        { dose: 3, recommendedAtWeeks: 14 },
        { dose: 4, recommendedAtMonths: 18, isBooster: true },
        { dose: 5, recommendedAtYears: 5, isBooster: true },
    ],
    ROTA: [
        { dose: 1, recommendedAtWeeks: 6 },
        { dose: 2, recommendedAtWeeks: 10 },
    ],
    OPV: [
        { dose: 1, recommendedAtWeeks: 6 },
        { dose: 2, recommendedAtWeeks: 10 },
        { dose: 3, recommendedAtWeeks: 14 },
        { dose: 4, recommendedAtMonths: 18, isBooster: true },
        { dose: 5, recommendedAtYears: 5, isBooster: true },
    ],
    fIPV: [
        { dose: 1, recommendedAtWeeks: 14 },
        { dose: 2, recommendedAtMonths: 9 },
    ],
    PCV: [
        { dose: 1, recommendedAtWeeks: 6 },
        { dose: 2, recommendedAtWeeks: 10 },
        { dose: 3, recommendedAtMonths: 9 },
        { dose: 4, recommendedAtMonths: 18, isBooster: true },
    ],
    MR: [
        { dose: 1, recommendedAtMonths: 9 },
        { dose: 2, recommendedAtMonths: 15 },
    ],
    JE: [
        { dose: 1, recommendedAtMonths: 12 },
        { dose: 2, recommendedAtMonths: 24 },
    ],
    TCV: [{ dose: 1, recommendedAtMonths: 15 }],
    HPV: [
        { dose: 1, recommendedAtYears: 10 },
        { dose: 2, recommendedAtYears: 10.5 },
    ],
};

const catchUpRules = {
    BCG: { maxAgeMonths: 60, totalDoses: 1 },
    ROTA: { maxAgeWeeks: 32, totalDoses: 2 },
    DPT_HepB_hib: { maxAgeMonths: 180, minIntervalWeeks: 4, totalDoses: 5 },
    OPV: { maxAgeMonths: 59, minIntervalWeeks: 4, totalDoses: 5 },
    fIPV: { maxAgeMonths: 59, minIntervalWeeks: 4, totalDoses: 2 },
    PCV: { maxAgeMonths: 59, minIntervalWeeks: 4, totalDoses: 4 },
    MR: { maxAgeMonths: 180, minIntervalWeeks: 4, totalDoses: 2 },
    JE: { maxAgeMonths: 180, totalDoses: 2 },
    TCV: { maxAgeMonths: 180, totalDoses: 1 },
    HPV: { maxAgeYears: 26, totalDoses: 2 },
};

async function seed() {
    try {
        console.log('Starting vaccine schedule migration...');

        // 1. Create new VaccineScheduleVersion
        const version = await prisma.vaccineScheduleVersion.create({ data: {} });
        const scheduleVersionId = version.id;

        // 2. Insert VaccineTypes
        const vaccineTypes = await Promise.all(
            Object.keys(vaccineSchedule).map((name) =>
                prisma.vaccineType.upsert({
                    where: { name },
                    update: {},
                    create: { name },
                })
            )
        );

        const vaccineTypeMap = Object.fromEntries(
            vaccineTypes.map((vt) => [vt.name, vt.id])
        );

        // 3. Insert Doses
        const doseData = Object.entries(vaccineSchedule).flatMap(([vaccine, doses]) =>
            doses.map((dose) => ({
                vaccineTypeId: vaccineTypeMap[vaccine],
                doseNumber: dose.dose,
                recommendedAtDays: dose.recommendedAtDays ?? null,
                recommendedAtWeeks: dose.recommendedAtWeeks ?? null,
                recommendedAtMonths: dose.recommendedAtMonths ?? null,
                recommendedAtYears: dose.recommendedAtYears ?? null,
                isBooster: dose.isBooster ?? false,
                scheduleVersionId,
            }))
        );

        await prisma.dose.createMany({ data: doseData });
        console.log(`Inserted ${doseData.length} Dose records.`);

        // 4. Insert CatchUpRules
        const catchUpData = Object.entries(catchUpRules).map(([vaccine, rules]) => ({
            vaccineTypeId: vaccineTypeMap[vaccine],
            maxAgeDays: rules.maxAgeDays ?? null,
            maxAgeWeeks: rules.maxAgeWeeks ?? null,
            maxAgeMonths: rules.maxAgeMonths ?? null,
            maxAgeYears: rules.maxAgeYears ?? null,
            minIntervalWeeks: rules.minIntervalWeeks ?? null,
            totalDoses: rules.totalDoses ?? null,
            scheduleVersionId,
        }));

        await prisma.catchUpRule.createMany({ data: catchUpData });
        console.log(`Inserted ${catchUpData.length} CatchUpRule records.`);

        console.log('Vaccine schedule migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

seed();

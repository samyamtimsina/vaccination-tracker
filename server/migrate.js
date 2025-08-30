import { PrismaClient } from './generated/prisma/client.js';

const prisma = new PrismaClient();

// NOTE: This is the complete mock data for the migration script,
// based on the provided vaccine schedule.
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
        { dose: 2, recommendedAtYears: 10.5 }, // 10.5 years = 126 months
    ],
};

// ---------------------
// Catch-up rules
// ---------------------
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

        // 1. Create a new VaccineScheduleVersion
        const version = await prisma.vaccineScheduleVersion.create({
            data: {},
        });
        console.log(`Created VaccineScheduleVersion with ID: ${version.id}`);

        const scheduleVersionId = version.id;

        // 2. Populate Dose table
        const doseData = Object.entries(vaccineSchedule).flatMap(([vaccine, doses]) => {
            const vaccineType = vaccine.toUpperCase().replace(/-/g, '_');
            return doses.map((dose) => ({
                vaccineType,
                doseNumber: dose.dose,
                recommendedAtDays: dose.recommendedAtDays ?? null,
                recommendedAtWeeks: dose.recommendedAtWeeks ?? null,
                recommendedAtMonths: dose.recommendedAtMonths ?? null,
                recommendedAtYears: dose.recommendedAtYears ?? null,
                isBooster: dose.isBooster ?? false,
                scheduleVersionId,
            }));
        });

        await prisma.dose.createMany({
            data: doseData,
            skipDuplicates: true,
        });
        console.log(`Inserted ${doseData.length} Dose records.`);

        // 3. Populate CatchUpRule table
        const catchUpData = Object.entries(catchUpRules).map(([vaccine, rules]) => {
            const vaccineType = vaccine.toUpperCase().replace(/-/g, '_');
            return {
                vaccineType,
                maxAgeDays: rules.maxAgeDays ?? null,
                maxAgeWeeks: rules.maxAgeWeeks ?? null,
                maxAgeMonths: rules.maxAgeMonths ?? null,
                maxAgeYears: rules.maxAgeYears ?? null,
                minIntervalWeeks: rules.minIntervalWeeks ?? null,
                totalDoses: rules.totalDoses ?? null,
                scheduleVersionId,
            };
        });

        await prisma.catchUpRule.createMany({
            data: catchUpData,
            skipDuplicates: true,
        });
        console.log(`Inserted ${catchUpData.length} CatchUpRule records.`);

        console.log('Vaccine schedule migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

seed();

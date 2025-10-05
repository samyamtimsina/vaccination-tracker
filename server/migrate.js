import { prisma } from './utils/prisma.js';

const vaccineSchedule = {
    BCG: [
        { dose: 1, recommendedAtDays: 0, isBooster: false, isPrimary: true, maxAgeMonths: 23 },
        { dose: 2, recommendedAtDays: 0, isBooster: true, isPrimary: false, maxAgeYears: 5 },
    ],

    DPT_HepB_hib: [
        { dose: 1, recommendedAtWeeks: 6, isPrimary: true, maxAgeMonths: 23 },
        { dose: 2, recommendedAtWeeks: 10, isPrimary: true, maxAgeMonths: 23 },
        { dose: 3, recommendedAtWeeks: 14, isPrimary: true, maxAgeMonths: 23 },
        { dose: 4, recommendedAtMonths: 18, isBooster: true, maxAgeMonths: 59 },
        { dose: 5, recommendedAtYears: 5, isBooster: true, maxAgeYears: 5 },
    ],

    ROTA: [
        { dose: 1, recommendedAtWeeks: 6, isPrimary: true, maxAgeWeeks: 32 },
        { dose: 2, recommendedAtWeeks: 10, isPrimary: true, maxAgeWeeks: 32 },
    ],

    OPV: [
        { dose: 1, recommendedAtWeeks: 6, isPrimary: true, maxAgeMonths: 23 },
        { dose: 2, recommendedAtWeeks: 10, isPrimary: true, maxAgeMonths: 23 },
        { dose: 3, recommendedAtWeeks: 14, isPrimary: true, maxAgeMonths: 23 },
        { dose: 4, recommendedAtMonths: 18, isBooster: true, maxAgeMonths: 59 },
        { dose: 5, recommendedAtYears: 5, isBooster: true, maxAgeYears: 5 },
    ],

    fIPV: [
        { dose: 1, recommendedAtWeeks: 14, isPrimary: true, maxAgeMonths: 23 },
        { dose: 2, recommendedAtMonths: 9, isPrimary: true, maxAgeMonths: 23 },
        { dose: 3, recommendedAtYears: 2, isBooster: true, maxAgeYears: 5 },
        { dose: 4, recommendedAtYears: 2.5, isBooster: true, maxAgeYears: 5 },
    ],

    PCV: [
        { dose: 1, recommendedAtWeeks: 6, isPrimary: true, maxAgeMonths: 23 },
        { dose: 2, recommendedAtWeeks: 10, isPrimary: true, maxAgeMonths: 23 },
        { dose: 3, recommendedAtMonths: 9, isPrimary: true, maxAgeMonths: 23 },
        { dose: 4, recommendedAtMonths: 18, isBooster: true, maxAgeMonths: 59 },
        { dose: 5, recommendedAtYears: 2, isBooster: true, maxAgeYears: 5 },
    ],

    MR: [
        { dose: 1, recommendedAtMonths: 9, isPrimary: true, maxAgeMonths: 23 },
        { dose: 2, recommendedAtMonths: 15, isPrimary: true, maxAgeMonths: 23 },
        { dose: 3, recommendedAtYears: 2, isBooster: true, maxAgeYears: 5 },
    ],

    JE: [
        { dose: 1, recommendedAtMonths: 12, isPrimary: true, maxAgeMonths: 23 },
        { dose: 2, recommendedAtMonths: 24, isBooster: true, maxAgeYears: 5 },
    ],

    TCV: [
        { dose: 1, recommendedAtMonths: 15, isPrimary: true, maxAgeYears: 5 },
    ],

    HPV: [
        { dose: 1, recommendedAtYears: 10, isPrimary: true, maxAgeYears: 26, requiredGender: "female", minSchoolClass: 6 },
        { dose: 2, recommendedAtYears: 10.5, isPrimary: true, maxAgeYears: 26, requiredGender: "female", minSchoolClass: 6 },
    ],
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

        // 3. Insert Doses with eligibility
        const doseData = Object.entries(vaccineSchedule).flatMap(([vaccine, doses]) =>
            doses.map((dose) => ({
                vaccineTypeId: vaccineTypeMap[vaccine],
                doseNumber: dose.dose,
                recommendedAtDays: dose.recommendedAtDays ?? null,
                recommendedAtWeeks: dose.recommendedAtWeeks ?? null,
                recommendedAtMonths: dose.recommendedAtMonths ?? null,
                recommendedAtYears: dose.recommendedAtYears ?? null,
                isBooster: dose.isBooster ?? false,
                isPrimary: dose.isPrimary ?? !dose.isBooster,
                maxAgeDays: dose.maxAgeDays ?? null,
                maxAgeWeeks: dose.maxAgeWeeks ?? null,
                maxAgeMonths: dose.maxAgeMonths ?? null,
                maxAgeYears: dose.maxAgeYears ?? null,

                // New eligibility fields
                requiredGender: dose.requiredGender ?? null,
                minSchoolClass: dose.minSchoolClass ?? null,
                maxSchoolClass: dose.maxSchoolClass ?? null,
                otherCriteria: dose.otherCriteria ?? null,

                scheduleVersionId,
            }))
        );

        await prisma.dose.createMany({ data: doseData });
        console.log(`Inserted ${doseData.length} Dose records.`);

        console.log('Vaccine schedule migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

seed();

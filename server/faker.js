import { faker } from '@faker-js/faker';
import { prisma } from './utils/prisma.js';

// --- Helper to generate random date ---
const getRandomDate = (start, end) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// --- Prepare ChildDueVaccine entries based on schedule ---
const prepareChildDueVaccines = (birthDate, doses, scheduleVersionId) => {
    return doses.map((dose) => {
        let dueDate = new Date(birthDate.getTime());
        if (dose.recommendedAtDays != null) dueDate.setDate(dueDate.getDate() + dose.recommendedAtDays);
        if (dose.recommendedAtWeeks != null) dueDate.setDate(dueDate.getDate() + dose.recommendedAtWeeks * 7);
        if (dose.recommendedAtMonths != null) dueDate.setMonth(dueDate.getMonth() + dose.recommendedAtMonths);
        if (dose.recommendedAtYears != null) dueDate.setFullYear(dueDate.getFullYear() + dose.recommendedAtYears);

        return {
            vaccineTypeId: dose.vaccineTypeId,
            doseNumber: dose.doseNumber,
            dueDate,
            isCompleted: false,
            scheduleVersion: scheduleVersionId,
        };
    });
};

// --- Main data generation ---
const generateData = async (totalChildren, batchSize = 1000) => {
    console.log(`Generating ${totalChildren} children in batches of ${batchSize}...`);

    const users = await prisma.user.findMany({ where: { role: { in: ['ADMIN', 'WARD_OFFICER'] } } });
    if (!users.length) throw new Error('No admin/ward officer users found.');

    const vaccineTypes = await prisma.vaccineType.findMany();
    if (!vaccineTypes.length) throw new Error('No vaccine types found.');

    const scheduleVersion = await prisma.vaccineScheduleVersion.findFirst({
        orderBy: { id: 'desc' },
        include: { doses: true },
    });
    if (!scheduleVersion) throw new Error('No vaccine schedule version found.');

    let createdCount = 0;

    while (createdCount < totalChildren) {
        const batch = [];

        // --- Create child batch ---
        for (let i = 0; i < Math.min(batchSize, totalChildren - createdCount); i++) {
            const gender = faker.helpers.arrayElement(['MALE', 'FEMALE']);
            const birthDate = getRandomDate(new Date('2020-01-01'), new Date('2024-12-31'));
            const creatorUser = faker.helpers.arrayElement(users);

            batch.push({
                isFromOtherMunicipality: faker.datatype.boolean(),
                fullName: faker.person.fullName({ gender: gender.toLowerCase() }),
                wardNumber: faker.number.int({ min: 1, max: 10 }),
                parentName: faker.person.fullName({ sex: 'female' }),
                tole: faker.location.street(),
                phoneNumber: faker.phone.number('98########'),
                gender,
                casteCode: faker.number.int({ min: 1, max: 5 }),
                birthDate,
                createdById: creatorUser.id,
                remarks: faker.lorem.sentence(),
                verifiedById: null,
                email: faker.internet.email().toLowerCase()
            });
        }

        await prisma.child.createMany({ data: batch });
        const children = await prisma.child.findMany({
            orderBy: { createdAt: 'desc' },
            take: batch.length,
        });

        const vaccinationRecords = [];
        const dueVaccinesRecords = [];
        const weightRecords = [];

        // --- Generate dense vaccination records ---
        for (const child of children) {
            const creatorUser = faker.helpers.arrayElement(users);

            for (const vaccine of vaccineTypes) {
                const dosesForVaccine = scheduleVersion.doses.filter(d => d.vaccineTypeId === vaccine.id);
                for (const dose of dosesForVaccine) {
                    // Randomly decide if the dose was already given (dense but not always 100%)
                    if (Math.random() < 0.8) {
                        vaccinationRecords.push({
                            citizenId: child.id,
                            vaccineTypeId: vaccine.id,
                            doseNumber: dose.doseNumber,
                            dateGiven: getRandomDate(child.birthDate, new Date()),
                            isComplete: true,
                            type: faker.helpers.arrayElement(['current', 'booster']),
                            createdById: creatorUser.id,
                            administeredById: creatorUser.id,
                            wardOfVaccination: child.wardNumber,
                            remarks: faker.lorem.sentence(),
                        });
                    }
                }
            }

            // ChildDueVaccine
            const dueVaccines = prepareChildDueVaccines(child.birthDate, scheduleVersion.doses, scheduleVersion.id);
            dueVaccines.forEach(v => dueVaccinesRecords.push({ ...v, childId: child.id }));

            // Weight records
            const numWeights = faker.number.int({ min: 0, max: 3 });
            for (let k = 0; k < numWeights; k++) {
                weightRecords.push({
                    childId: child.id,
                    weight: faker.number.float({ min: 2.5, max: 15, precision: 0.01, fixed: 2 }),
                    date: getRandomDate(child.birthDate, new Date()),
                    createdById: creatorUser.id,
                    administeredById: creatorUser.id,
                    wardOfVaccination: child.wardNumber,
                });
            }
        }

        if (vaccinationRecords.length) await prisma.vaccinationRecord.createMany({ data: vaccinationRecords });
        if (dueVaccinesRecords.length) await prisma.childDueVaccine.createMany({ data: dueVaccinesRecords });
        if (weightRecords.length) await prisma.weightRecord.createMany({ data: weightRecords });

        createdCount += batch.length;
        console.log(`Generated ${createdCount}/${totalChildren} children...`);
    }

    console.log('Data generation complete!');
    await prisma.$disconnect();
};

// --- Run generator ---
generateData(100000, 1000);

// // File: prisma/seed_debug_schedule.js
// // import { prisma } from "../utils/prisma.js";

// import { prisma } from './utils/prisma.js';

// const today = new Date();

// async function main() {
//     console.log("🧩 Seeding precise debug dataset with real schedule…");

//     // --- Clean previous test data (safe for dev only) ---
//     await prisma.vaccinationRecord.deleteMany();
//     await prisma.childDueVaccine.deleteMany();
//     await prisma.child.deleteMany();

//     const admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
//     const schedule = await prisma.vaccineScheduleVersion.findFirst({
//         include: { doses: { include: { vaccineType: true } } },
//     });

//     const children = await prisma.child.createManyAndReturn({
//         data: Array.from({ length: 10 }, (_, i) => ({
//             fullName: `Child_${i + 1}`,
//             wardNumber: 1,
//             gender: i % 2 === 0 ? "MALE" : "FEMALE",
//             birthDate: new Date(2023, 0, 1),
//             createdById: admin.id,
//             casteCode: 1,
//             isFromOtherMunicipality: false,
//             parentName: "Parent",
//             phoneNumber: `98000000${i}`,
//             email: `child${i + 1}@test.com`,
//             tole: "Central Tole",
//         })),
//     });

//     const vaccs = [];
//     const dues = [];

//     for (const child of children) {
//         const index = parseInt(child.fullName.split("_")[1]);
//         const allDoses = schedule.doses;

//         // Each child gets a unique pattern
//         for (const d of allDoses) {
//             const give = (() => {
//                 if (index <= 3) return true; // fully vaccinated
//                 if (index <= 6) return d.doseNumber <= 2; // partial (early doses only)
//                 if (index <= 8) return false; // zero-dose
//                 if (index >= 9) {
//                     // 10-year-old girl scenario (HPV only)
//                     if (child.gender === "FEMALE" && d.vaccineType.name === "HPV")
//                         return d.doseNumber === 1;
//                     return false;
//                 }
//             })();

//             dues.push({
//                 childId: child.id,
//                 vaccineTypeId: d.vaccineTypeId,
//                 doseNumber: d.doseNumber,
//                 dueDate: today,
//                 isCompleted: give,
//                 scheduleVersion: schedule.id,
//             });

//             if (give) {
//                 vaccs.push({
//                     citizenId: child.id,
//                     vaccineTypeId: d.vaccineTypeId,
//                     doseNumber: d.doseNumber,
//                     dateGiven: today,
//                     isComplete: true,
//                     type: "current",
//                     createdById: admin.id,
//                     administeredById: admin.id,
//                     wardOfVaccination: 1,
//                 });
//             }
//         }
//     }

//     await prisma.childDueVaccine.createMany({ data: dues });
//     await prisma.vaccinationRecord.createMany({ data: vaccs });

//     console.log("✅ Seeded 10 children:");
//     console.log("- 3 fully vaccinated");
//     console.log("- 3 partial");
//     console.log("- 2 zero-dose");
//     console.log("- 2 HPV-only (age/gender test)");
// }

// main()
//     .catch(console.error)
//     .finally(() => prisma.$disconnect());


// import { prisma } from './utils/prisma.js';

// const today = new Date();

// async function simpleTest() {
//     console.log("🧪 Simple test: 4 kids, 2 real vaccines");

//     // Clean slate
//     await prisma.vaccinationRecord.deleteMany();
//     await prisma.childDueVaccine.deleteMany();
//     await prisma.child.deleteMany();

//     const admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });

//     // Create 4 identical-age boys
//     const children = await prisma.child.createManyAndReturn({
//         data: Array.from({ length: 4 }, (_, i) => ({
//             fullName: `Test_${i + 1}`,
//             wardNumber: 1,
//             gender: "MALE",
//             birthDate: new Date(2024, 0, 1),  // ~1.75yo today
//             createdById: admin.id,
//             casteCode: 1,
//             isFromOtherMunicipality: false,
//             parentName: "Parent",
//             phoneNumber: `98000000${i + 1}`,
//             email: `test${i + 1}@example.com`,
//             tole: "Test Tole",
//         })),
//     });

//     // Use real vaccine IDs from your database
//     // BCG (ID 6) - usually early/single dose
//     // DPT_HepB_hib (ID 7) - multi-dose vaccine
//     const testDoses = [
//         { vaccineTypeId: 6, doseNumber: 1 },  // BCG dose 1 (early)
//         { vaccineTypeId: 7, doseNumber: 3 },  // DPT_HepB_hib dose 3 (later)
//     ];

//     const dues = [];
//     const vaccs = [];

//     for (const [idx, child] of children.entries()) {
//         const childIndex = idx + 1;  // 1-4

//         for (const d of testDoses) {
//             const give = (() => {
//                 if (childIndex === 1) return true;  // Full: both vaccines
//                 if (childIndex === 2) return d.doseNumber <= 2;  // Partial: BCG only (dose1), miss DPT (dose3)
//                 if (childIndex === 3) return d.vaccineTypeId === 7;  // DPT only, miss BCG
//                 return false;  // 4: zero
//             })();

//             dues.push({
//                 childId: child.id,
//                 vaccineTypeId: d.vaccineTypeId,
//                 doseNumber: d.doseNumber,
//                 dueDate: today,
//                 isCompleted: give,
//                 scheduleVersion: 1,
//             });

//             if (give) {
//                 vaccs.push({
//                     citizenId: child.id,
//                     vaccineTypeId: d.vaccineTypeId,
//                     doseNumber: d.doseNumber,
//                     dateGiven: today,
//                     isComplete: true,
//                     type: "current",
//                     createdById: admin.id,
//                     administeredById: admin.id,
//                     wardOfVaccination: 1,
//                 });
//             }
//         }
//     }

//     await prisma.childDueVaccine.createMany({ data: dues });
//     await prisma.vaccinationRecord.createMany({ data: vaccs });

//     console.log("✅ Seeded 4 children:");
//     console.log("- Test1: BCG + DPT (full)");
//     console.log("- Test2: BCG only (partial)");
//     console.log("- Test3: DPT only (partial)");
//     console.log("- Test4: Zero doses");
//     console.log("🎯 Expected Results:");
//     console.log("- BCG (ID 6): 2/4 vaccinated (Test1, Test2) = 50% coverage");
//     console.log("- DPT (ID 7): 2/4 vaccinated (Test1, Test3) = 50% coverage");
//     console.log("- Zero-dose: 1 child (Test4)");
// }

// simpleTest()
//     .catch(console.error)
//     .finally(() => prisma.$disconnect());
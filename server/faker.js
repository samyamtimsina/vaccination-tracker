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
            isCompleted: false, // Default to false, will update based on vaccinations
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

        // --- Generate vaccination records and sync with due vaccines ---
        for (const child of children) {
            const creatorUser = faker.helpers.arrayElement(users);

            // First create due vaccines for this child
            const dueVaccines = prepareChildDueVaccines(child.birthDate, scheduleVersion.doses, scheduleVersion.id);

            // Track which doses will be completed
            const completedDoses = new Set();

            // Generate vaccination records
            for (const vaccine of vaccineTypes) {
                const dosesForVaccine = scheduleVersion.doses.filter(d => d.vaccineTypeId === vaccine.id);
                for (const dose of dosesForVaccine) {
                    // Randomly decide if the dose was already given (80% chance)
                    if (Math.random() < 0.8) {
                        const dateGiven = getRandomDate(child.birthDate, new Date());

                        vaccinationRecords.push({
                            citizenId: child.id,
                            vaccineTypeId: vaccine.id,
                            doseNumber: dose.doseNumber,
                            dateGiven: dateGiven,
                            isComplete: true,
                            type: faker.helpers.arrayElement(['routine', 'booster']),
                            createdById: creatorUser.id,
                            administeredById: creatorUser.id,
                            wardOfVaccination: child.wardNumber,
                            remarks: faker.lorem.sentence(),
                        });

                        // Mark this dose as completed for due vaccines
                        completedDoses.add(`${vaccine.id}-${dose.doseNumber}`);
                    }
                }
            }

            // Create due vaccines - mark as completed if vaccination exists
            dueVaccines.forEach(v => {
                const doseKey = `${v.vaccineTypeId}-${v.doseNumber}`;
                const isCompleted = completedDoses.has(doseKey);

                dueVaccinesRecords.push({
                    ...v,
                    childId: child.id,
                    isCompleted: isCompleted
                });
            });

            // Weight records
            const numWeights = faker.number.int({ min: 0, max: 3 });
            for (let k = 0; k < numWeights; k++) {
                weightRecords.push({
                    childId: child.id,
                    weight: faker.number.float({ min: 2.5, max: 15, precision: 0.01, fractionDigits: 2 }),
                    date: getRandomDate(child.birthDate, new Date()),
                    createdById: creatorUser.id,
                    administeredById: creatorUser.id,
                    wardOfVaccination: child.wardNumber,
                });
            }
        }

        // Insert all records
        if (vaccinationRecords.length) await prisma.vaccinationRecord.createMany({ data: vaccinationRecords });
        if (dueVaccinesRecords.length) await prisma.childDueVaccine.createMany({ data: dueVaccinesRecords });
        if (weightRecords.length) await prisma.weightRecord.createMany({ data: weightRecords });

        // Log completion stats for this batch
        const completedCount = dueVaccinesRecords.filter(d => d.isCompleted).length;
        const totalDueVaccines = dueVaccinesRecords.length;
        console.log(`Batch ${createdCount + batch.length}: ${completedCount}/${totalDueVaccines} due vaccines marked completed (${Math.round((completedCount / totalDueVaccines) * 100)}%)`);

        createdCount += batch.length;
        console.log(`Generated ${createdCount}/${totalChildren} children...`);
    }

    console.log('✅ Data generation complete!');
    console.log('📊 Now run your analytics worker to see correct vaccinated counts!');
    await prisma.$disconnect();
};

// --- Run generator ---
generateData(100000, 1000).catch(console.error);

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

// import { prisma } from './utils/prisma.js';

// const today = new Date();
// const yesterday = new Date(today);
// yesterday.setDate(yesterday.getDate() - 1);

// async function comprehensiveTest() {
//     console.log("🧪 COMPREHENSIVE TEST: 8 kids across 2 wards, multiple vaccines");

//     try {
//         // Test connection first
//         await prisma.$connect();
//         console.log("✅ Connected to database");

//         const admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
//         if (!admin) {
//             throw new Error("No SUPER_ADMIN user found in database");
//         }

//         console.log("👤 Using admin user:", admin.email);

//         // Create 8 children across 2 wards with different ages
//         console.log("👶 Creating test children...");
//         const children = await prisma.child.createManyAndReturn({
//             data: [
//                 // Ward 1 - Mixed scenarios
//                 { fullName: 'W1_Full_Vax', wardNumber: 1, gender: 'MALE', birthDate: new Date(2023, 6, 1), casteCode: 1, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000001', email: 'w1f@test.com', tole: 'Tole 1', isFromOtherMunicipality: false },
//                 { fullName: 'W1_Partial_Vax', wardNumber: 1, gender: 'FEMALE', birthDate: new Date(2023, 8, 1), casteCode: 2, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000002', email: 'w1p@test.com', tole: 'Tole 1', isFromOtherMunicipality: false },
//                 { fullName: 'W1_Zero_Dose', wardNumber: 1, gender: 'MALE', birthDate: new Date(2024, 0, 1), casteCode: 3, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000003', email: 'w1z@test.com', tole: 'Tole 1', isFromOtherMunicipality: false },
//                 { fullName: 'W1_Overdue', wardNumber: 1, gender: 'FEMALE', birthDate: new Date(2023, 3, 1), casteCode: 1, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000004', email: 'w1o@test.com', tole: 'Tole 1', isFromOtherMunicipality: false },

//                 // Ward 2 - All vaccinated scenarios
//                 { fullName: 'W2_Full_Vax1', wardNumber: 2, gender: 'MALE', birthDate: new Date(2023, 5, 1), casteCode: 2, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000005', email: 'w2f1@test.com', tole: 'Tole 2', isFromOtherMunicipality: false },
//                 { fullName: 'W2_Full_Vax2', wardNumber: 2, gender: 'FEMALE', birthDate: new Date(2023, 7, 1), casteCode: 3, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000006', email: 'w2f2@test.com', tole: 'Tole 2', isFromOtherMunicipality: false },
//                 { fullName: 'W2_Partial_Vax', wardNumber: 2, gender: 'MALE', birthDate: new Date(2024, 1, 1), casteCode: 1, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000007', email: 'w2p@test.com', tole: 'Tole 2', isFromOtherMunicipality: false },
//                 { fullName: 'W2_Zero_Dose', wardNumber: 2, gender: 'FEMALE', birthDate: new Date(2024, 2, 1), casteCode: 2, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000008', email: 'w2z@test.com', tole: 'Tole 2', isFromOtherMunicipality: false },
//             ],
//         });

//         console.log(`✅ Created ${children.length} children`);

//         // Test vaccines: BCG (single), DPT (multi-dose), OPV (multi-dose)
//         const testVaccines = [
//             { id: 6, name: 'BCG', doses: [1] },           // Single dose
//             { id: 7, name: 'DPT_HepB_hib', doses: [1, 2, 3] }, // Multi-dose primary
//             { id: 8, name: 'OPV', doses: [1, 2, 3] },    // Multi-dose primary
//         ];

//         const dues = [];
//         const vaccs = [];

//         // Define vaccination patterns for each child
//         const childVaccinationPatterns = {
//             // Ward 1
//             'W1_Full_Vax': {
//                 BCG: [1],
//                 DPT_HepB_hib: [1, 2, 3],
//                 OPV: [1, 2, 3]
//             },
//             'W1_Partial_Vax': {
//                 BCG: [1],
//                 DPT_HepB_hib: [1],      // Only dose 1
//                 OPV: [1, 2]             // Missing dose 3
//             },
//             'W1_Zero_Dose': {
//                 // No vaccines
//             },
//             'W1_Overdue': {
//                 BCG: [1],
//                 DPT_HepB_hib: [1],      // Only dose 1 (overdue on 2,3)
//                 OPV: [1]                // Only dose 1 (overdue on 2,3)
//             },

//             // Ward 2
//             'W2_Full_Vax1': {
//                 BCG: [1],
//                 DPT_HepB_hib: [1, 2, 3],
//                 OPV: [1, 2, 3]
//             },
//             'W2_Full_Vax2': {
//                 BCG: [1],
//                 DPT_HepB_hib: [1, 2, 3],
//                 OPV: [1, 2, 3]
//             },
//             'W2_Partial_Vax': {
//                 BCG: [1],
//                 DPT_HepB_hib: [1, 2],   // Missing dose 3
//                 OPV: [1]                // Missing doses 2,3
//             },
//             'W2_Zero_Dose': {
//                 // No vaccines
//             }
//         };

//         console.log("💉 Generating vaccination records...");

//         // Generate due vaccines and vaccination records
//         for (const child of children) {
//             const pattern = childVaccinationPatterns[child.fullName];

//             for (const vaccine of testVaccines) {
//                 for (const doseNumber of vaccine.doses) {
//                     const hasVaccine = pattern[vaccine.name]?.includes(doseNumber) || false;

//                     // Create due vaccine entry - SET TO YESTERDAY so it's definitely eligible
//                     dues.push({
//                         childId: child.id,
//                         vaccineTypeId: vaccine.id,
//                         doseNumber: doseNumber,
//                         dueDate: yesterday,  // FIXED: Set to yesterday
//                         isCompleted: hasVaccine,
//                         scheduleVersion: 1,
//                     });

//                     // Create vaccination record if administered
//                     if (hasVaccine) {
//                         vaccs.push({
//                             citizenId: child.id,
//                             vaccineTypeId: vaccine.id,
//                             doseNumber: doseNumber,
//                             dateGiven: today,
//                             isComplete: true,
//                             type: "routine",
//                             createdById: admin.id,
//                             administeredById: admin.id,
//                             wardOfVaccination: child.wardNumber,
//                         });
//                     }
//                 }
//             }
//         }

//         await prisma.childDueVaccine.createMany({ data: dues });
//         await prisma.vaccinationRecord.createMany({ data: vaccs });

//         console.log("✅ Created due vaccines:", dues.length);
//         console.log("✅ Created vaccination records:", vaccs.length);

//         console.log("");
//         console.log("🎉 TEST DATA CREATION COMPLETE!");
//         console.log("");
//         console.log("📊 EXPECTED ANALYTICS RESULTS:");
//         console.log("WARD 1 (4 children): Total: 4 | Vaccinated: 3 | Zero-dose: 1 | Overdue: 2");
//         console.log("WARD 2 (4 children): Total: 4 | Vaccinated: 3 | Zero-dose: 1 | Overdue: 1");
//         console.log("VACCINES: BCG: 75% | DPT: 50% | OPV: 37.5%");
//         console.log("");
//         console.log("🚀 Now run: node analyticsFactUpdater.js");
//         console.log("Then check your frontend to verify the numbers!");

//     } catch (error) {
//         console.error("❌ Error:", error.message);
//         console.error(error);
//     }
// }

// // Run the test
// comprehensiveTest()
//     .catch(console.error)
//     .finally(async () => {
//         await prisma.$disconnect();
//         console.log("🔌 Disconnected from database");
//     });
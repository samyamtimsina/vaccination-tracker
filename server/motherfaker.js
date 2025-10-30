// faker.js
import { faker } from '@faker-js/faker';
import { prisma } from './utils/prisma.js';

// --- Helper to generate random date ---
const getRandomDate = (start, end) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// --- Helper to generate TD Doses for a Mother (0–3 doses) ---
const generateTDDoses = (motherBirthDate, creatorUser, administeredByUser, motherId) => {
    const tdDoses = [];
    const maxDoses = faker.number.int({ min: 0, max: 3 }); // 0 to 3 doses

    for (let i = 1; i <= maxDoses; i++) {
        const dateGiven = getRandomDate(motherBirthDate, new Date());
        tdDoses.push({
            motherId,
            doseNumber: i,
            dateGiven,
            remarks: faker.lorem.sentence(),
            createdById: creatorUser.id,
            administeredById: administeredByUser.id,
        });
    }

    return tdDoses;
};

// --- Main data generation ---
const generateMotherData = async (totalMothers, batchSize = 1000) => {
    console.log(`Generating ${totalMothers} mothers in batches of ${batchSize}...`);

    // Fetch eligible users
    const users = await prisma.user.findMany({
        where: { role: { in: ['ADMIN', 'WARD_OFFICER'] } },
    });
    if (!users.length) throw new Error('No eligible users found (ADMIN or WARD_OFFICER).');

    // Get last sewaDartaNumber
    const lastMother = await prisma.mother.findFirst({
        orderBy: { sewaDartaNumber: 'desc' },
        select: { sewaDartaNumber: true },
    });
    let nextSewaDartaNumber = lastMother ? lastMother.sewaDartaNumber + 1 : 10000;

    let createdCount = 0;

    while (createdCount < totalMothers) {
        const motherBatch = [];

        for (let i = 0; i < Math.min(batchSize, totalMothers - createdCount); i++) {
            const creatorUser = faker.helpers.arrayElement(users);
            const firstName = faker.person.firstName('female');
            const lastName = faker.person.lastName();
            const dob = getRandomDate(new Date('1980-01-01'), new Date('2005-12-31'));

            motherBatch.push({
                sewaDartaNumber: nextSewaDartaNumber++,
                name: `${firstName} ${lastName}`,
                casteCode: faker.number.int({ min: 1, max: 10 }),
                dateOfBirth: dob,
                phoneNumber: faker.phone.number('98########'),
                tole: faker.location.street(),
                wardNumber: creatorUser.wardId || faker.number.int({ min: 1, max: 20 }),
                pregnancyCount: faker.number.int({ min: 0, max: 5 }),
                previousTDTakenCount: faker.number.int({ min: 0, max: 5 }),
                remarks: faker.lorem.sentence(),
                createdById: creatorUser.id,
                isFromOtherMunicipality: faker.datatype.boolean(),
            });
        }

        // Insert mothers individually with nested TD doses
        for (const motherData of motherBatch) {
            const creatorUser = faker.helpers.arrayElement(users);
            const administeredByUser = faker.helpers.arrayElement(users);

            await prisma.mother.create({
                data: {
                    ...motherData,
                    tdDoses: {
                        create: generateTDDoses(
                            motherData.dateOfBirth,
                            creatorUser,
                            administeredByUser,
                            undefined // Prisma will set motherId automatically
                        ),
                    },
                },
            });
        }

        createdCount += motherBatch.length;
        console.log(`✅ Created ${createdCount}/${totalMothers} mothers...`);
    }

    console.log('🎉 Mother data generation complete!');
    await prisma.$disconnect();
};

// --- Run generator ---
generateMotherData(100000, 500).catch((err) => {
    console.error('❌ Error generating data:', err);
    prisma.$disconnect();
});
// import { prisma } from './utils/prisma.js'

// async function seedMothers() {
//     try {
//         console.log("🧪 Seeding test mothers...");

//         const mothers = [
//             {
//                 name: "M1_Full_TD",
//                 wardNumber: 1,
//                 phoneNumber: "9800000101",
//                 dateOfBirth: new Date("1995-02-14"),
//                 pregnancyCount: 1,
//                 previousTDTakenCount: 3,
//                 remarks: "",
//                 createdById: 3,
//                 casteCode: 1,
//                 tole: "Ward-1 Tope",
//                 tdDoses: [
//                     { doseNumber: 1, dateGiven: new Date(), createdById: 3, administeredById: 3 },
//                     { doseNumber: 2, dateGiven: new Date(), createdById: 3, administeredById: 3 },
//                     { doseNumber: 3, dateGiven: new Date(), createdById: 3, administeredById: 3 },
//                 ],
//             },
//             {
//                 name: "M2_Partial_TD",
//                 wardNumber: 1,
//                 phoneNumber: "9800000102",
//                 dateOfBirth: new Date("1994-05-20"),
//                 pregnancyCount: 2,
//                 previousTDTakenCount: 1,
//                 remarks: "",
//                 createdById: 3,
//                 casteCode: 2,
//                 tole: "Ward-1 Tope",
//                 tdDoses: [
//                     { doseNumber: 1, dateGiven: new Date(), createdById: 3, administeredById: 3 },
//                 ],
//             },
//             {
//                 name: "M3_Zero_TD",
//                 wardNumber: 2,
//                 phoneNumber: "9800000103",
//                 dateOfBirth: new Date("1992-08-10"),
//                 pregnancyCount: 1,
//                 previousTDTakenCount: 0,
//                 remarks: "",
//                 createdById: 3,
//                 casteCode: 3,
//                 tole: "Ward-2 Tope",
//                 tdDoses: [],
//             },
//             {
//                 name: "M4_Overdue_TD",
//                 wardNumber: 2,
//                 phoneNumber: "9800000104",
//                 dateOfBirth: new Date("1990-12-01"),
//                 pregnancyCount: 3,
//                 previousTDTakenCount: 2,
//                 remarks: "",
//                 createdById: 3,
//                 casteCode: 1,
//                 tole: "Ward-2 Tope",
//                 tdDoses: [
//                     { doseNumber: 1, dateGiven: new Date("2025-01-01"), createdById: 3, administeredById: 3 },
//                 ],
//             },
//         ];

//         for (const mother of mothers) {
//             await prisma.mother.create({
//                 data: {
//                     ...mother,
//                     tdDoses: { create: mother.tdDoses },
//                 },
//             });
//         }

//         console.log("✅ Mothers seeded successfully!");
//     } catch (error) {
//         console.error("❌ Error seeding mothers:", error);
//     } finally {
//         await prisma.$disconnect();
//     }
// }

// seedMothers();

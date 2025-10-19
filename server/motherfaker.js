// faker.js
import { faker } from '@faker-js/faker';
import { prisma } from './utils/prisma.js';

// --- Helper to generate random date ---
const getRandomDate = (start, end) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// --- Helper to generate TD Doses for a Mother ---
const generateTDDoses = (motherBirthDate, creatorUser, administeredByUser, motherId) => {
    const tdDoses = [];
    const maxDoses = faker.number.int({ min: 0, max: 5 });

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

    // Get users eligible for data creation
    const users = await prisma.user.findMany({
        where: { role: { in: ['ADMIN', 'WARD_OFFICER'] } },
    });
    if (!users.length) throw new Error('No eligible users found (ADMIN or WARD_OFFICER).');

    // Find last sewaDartaNumber
    const lastMother = await prisma.mother.findFirst({
        orderBy: { sewaDartaNumber: 'desc' },
        select: { sewaDartaNumber: true },
    });

    let nextSewaDartaNumber = lastMother ? lastMother.sewaDartaNumber + 1 : 10000;
    let createdCount = 0;

    while (createdCount < totalMothers) {
        const motherBatch = [];
        const tdDoseBatch = [];

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

        // Insert mothers
        await prisma.mother.createMany({ data: motherBatch });

        // Fetch back to get IDs
        const mothers = await prisma.mother.findMany({
            where: {
                sewaDartaNumber: {
                    gte: nextSewaDartaNumber - motherBatch.length,
                    lt: nextSewaDartaNumber,
                },
            },
            orderBy: { sewaDartaNumber: 'asc' },
        });

        // Generate and insert TDDoses
        for (const mother of mothers) {
            const creatorUser = faker.helpers.arrayElement(users);
            const administeredByUser = faker.helpers.arrayElement(users);

            const tdDoses = generateTDDoses(
                mother.dateOfBirth,
                creatorUser,
                administeredByUser,
                mother.id
            );

            tdDoseBatch.push(...tdDoses);
        }

        if (tdDoseBatch.length) {
            await prisma.tDDose.createMany({ data: tdDoseBatch });
        }

        createdCount += motherBatch.length;
        console.log(`✅ Created ${createdCount}/${totalMothers} mothers...`);
    }

    console.log('🎉 Mother data generation complete!');
    await prisma.$disconnect();
};

// --- Run generator ---
generateMotherData(500000, 500).catch((err) => {
    console.error('❌ Error generating data:', err);
    prisma.$disconnect();
});

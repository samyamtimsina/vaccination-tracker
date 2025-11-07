import { prisma } from './utils/prisma.js';

// --- Controlled test data ---
const controlledChildren = [
    { name: 'Child A', wardNumber: 1, birthDate: new Date('2022-01-01'), weightKg: 8.0 },
    { name: 'Child B', wardNumber: 1, birthDate: new Date('2022-06-15'), weightKg: 9.5 },
    { name: 'Child C', wardNumber: 2, birthDate: new Date('2021-12-01'), weightKg: 7.0 },
    { name: 'Child D', wardNumber: 3, birthDate: new Date('2023-03-01'), weightKg: 11.0 },
    { name: 'Child E', wardNumber: 3, birthDate: new Date('2022-09-10'), weightKg: 6.5 },
];

export const seedControlledWeights = async () => {
    console.log('🧮 Inserting controlled children + weight records...');

    const users = await prisma.user.findMany({ where: { role: { in: ['ADMIN', 'WARD_OFFICER'] } } });
    if (!users.length) throw new Error('No admin/ward officer users found.');
    const creatorUser = users[0];

    const createdChildren = [];

    for (const childData of controlledChildren) {
        const child = await prisma.child.create({
            data: {
                fullName: childData.name,
                wardNumber: childData.wardNumber,
                parentName: 'Test Parent',
                casteCode: 1,
                gender: 'MALE',
                birthDate: childData.birthDate,
                createdById: creatorUser.id,
                tole: 'Test Tole',
                phoneNumber: '9800000000',
            },
        });

        createdChildren.push(child);

        await prisma.weightRecord.create({
            data: {
                childId: child.id,
                weight: childData.weightKg,
                date: new Date(),
                createdById: creatorUser.id,
                administeredById: creatorUser.id,
                wardOfVaccination: childData.wardNumber,
            },
        });
    }

    console.log('✅ Controlled test data inserted.');
    console.log(
        '➡️ Now run your analyticsFact updater and verify that weight analytics reflect these values!'
    );

    await prisma.$disconnect();
};

seedControlledWeights().catch(console.error);

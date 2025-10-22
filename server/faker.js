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
                wardNumber: faker.number.int({ min: 1, max: 20 }),
                parentName: faker.person.fullName({ sex: 'female' }),
                tole: faker.location.street(),
                phoneNumber: faker.phone.number('98########'),
                gender,
                casteCode: faker.number.int({ min: 1, max: 10 }),
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
generateData(1000000, 1000);

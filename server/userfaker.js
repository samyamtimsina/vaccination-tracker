// prisma/seed.js
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { prisma } from './utils/prisma.js';

async function main() {
    console.log('🌱 Seeding database with fake users...');

    // create users in parallel for speed
    const users = Array.from({ length: 10 }).map(async () => {
        const name = faker.person.fullName();
        const email = faker.internet.email().toLowerCase();
        const wardId = faker.number.int({ min: 1, max: 5 });
        const password = await bcrypt.hash('password123', 10);
        const phoneNumber = faker.phone.number('98########');

        return prisma.user.create({
            data: {
                name,
                email,
                passwordHash: password,
                role: 'WARD_OFFICER',
                status: 'PENDING',
                wardId,
                phoneNumber,
            },
        });
    });

    await Promise.all(users); // wait for all users to be created

    console.log('✅ Done seeding users.');

    // Now activate all pending users
    const result = await prisma.user.updateMany({
        where: { status: 'PENDING' },
        data: { status: 'ACTIVE' },
    });

    console.log(`✅ Updated ${result.count} users from PENDING to ACTIVE.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

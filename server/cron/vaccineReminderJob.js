// src/cron/vaccineReminderJob.js
import { PrismaClient } from '../generated/prisma/client.js';
import twilio from 'twilio';
import { getVaccinationStatus } from '../utils/vaccinationStatus.js';

const prisma = new PrismaClient();

const isTest = process.env.NODE_ENV === 'test';
const client = twilio(
  isTest ? process.env.TWILIO_TEST_ACCOUNT_SID : process.env.TWILIO_ACCOUNT_SID,
  isTest ? process.env.TWILIO_TEST_AUTH_TOKEN : process.env.TWILIO_AUTH_TOKEN,
);

export async function runVaccinationReminderJob() {
  console.log('🔔 Running vaccination reminder job...');

  const citizens = await prisma.citizen.findMany({
    include: { vaccinations: true },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const citizen of citizens) {
    if (!citizen.phoneNumber) continue;

    const statusList = getVaccinationStatus(
      citizen.birthDate,
      citizen.vaccinations,
    );

    for (const vaccine of statusList) {
      for (const dose of vaccine.doses) {
        const alreadySent = await prisma.notificationLog.findFirst({
          where: {
            citizenId: citizen.id,
            vaccineType: vaccine.vaccineType,
            doseNumber: dose.doseNumber,
            type: 'due',
          },
        });

        if (alreadySent) continue;

        const oneWeekBeforeDueDate = new Date(dose.dueDate);
        oneWeekBeforeDueDate.setDate(oneWeekBeforeDueDate.getDate() - 7);
        oneWeekBeforeDueDate.setHours(0, 0, 0, 0);

        const isOneWeekReminderDueToday =
          oneWeekBeforeDueDate.toDateString() === today.toDateString();

        if (isOneWeekReminderDueToday) {
          try {
            const message = `Upcoming: ${citizen.fullName}'s ${vaccine.vaccineType} (Dose ${dose.doseNumber}) is due next week on ${dose.dueDate.toLocaleDateString()}.`;

            await client.messages.create({
              body: message,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: isTest ? '+15005550006' : citizen.phoneNumber, // test vs real
            });

            await prisma.notificationLog.create({
              data: {
                citizenId: citizen.id,
                vaccineType: vaccine.vaccineType,
                doseNumber: dose.doseNumber,
                type: 'due',
              },
            });

            console.log(`📨 Reminder sent to ${citizen.fullName} `);
          } catch (err) {
            console.error(
              `❌ Failed to send SMS to ${citizen.fullName}
`,
              err.message,
            );
          }
        }
      }
    }
  }

  console.log(`✅ Job completed ${isTest ? 'test' : 'not test'}`);
}

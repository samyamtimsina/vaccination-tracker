// sendUpcomingVaccinationSMS.js
import { prisma } from '../utils/prisma.js';
import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const NepaliDate = require('nepali-date');

/**
 * Dummy SMS sender
 */
const sendSMS = async (phoneNumber, message) => {
  console.log(`✅ SMS sent to ${phoneNumber}: ${message}`);
  return true;
};

/**
 * Converts a date from AD to Bikram Sambat.
 */
const convertToBikramSambat = (date) => {
  const nepaliDate = new NepaliDate(date);
  return nepaliDate.format('yyyy-mm-dd');
};

/**
 * Send SMS reminders for due vaccines:
 * - 3 days ahead
 * - missed yesterday/today (catch-up)
 * - respects dose maxAge
 */
export const sendUpcomingVaccinationSMS = async () => {
  const today = dayjs().startOf('day');
  const threeDaysAhead = today.add(3, 'day').endOf('day');

  console.log(`[${new Date().toISOString()}] Starting SMS notification job...`);

  const BATCH_SIZE = 1000;
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    console.log(`[${new Date().toISOString()}] Fetching batch starting at offset ${skip}...`);

    const dueVaccines = await prisma.childDueVaccine.findMany({
      skip,
      take: BATCH_SIZE,
      where: {
        dueDate: { lte: threeDaysAhead.toDate() },
        isCompleted: false,
        notificationSent: false,
      },
      include: {
        child: true,
        vaccineType: { include: { doses: true } },
      },
    });

    console.log(`[${new Date().toISOString()}] Fetched ${dueVaccines.length} due vaccines`);

    if (dueVaccines.length === 0) {
      hasMore = false;
      break;
    }

    for (const v of dueVaccines) {
      const birthDate = v.child.birthDate;
      const dose = v.vaccineType.doses.find(d => d.doseNumber === v.doseNumber);

      // maxAge validation
      if (dose) {
        let maxAge = dayjs(birthDate);
        if (dose.maxAgeDays) maxAge = maxAge.add(dose.maxAgeDays, 'day');
        if (dose.maxAgeWeeks) maxAge = maxAge.add(dose.maxAgeWeeks, 'week');
        if (dose.maxAgeMonths) maxAge = maxAge.add(dose.maxAgeMonths, 'month');
        if (dose.maxAgeYears) maxAge = maxAge.add(dose.maxAgeYears, 'year');

        if (dayjs().isAfter(maxAge)) {
          console.log(`⚠️ Skipping ${v.child.fullName} (DOB: ${dayjs(birthDate).format('YYYY-MM-DD')}): ` +
            `dose ${v.doseNumber} of ${v.vaccineType.name} exceeds max age (${maxAge.format('YYYY-MM-DD')}) today is ${dayjs().format('YYYY-MM-DD')}`);
          continue;
        }
      }

      // Convert dueDate and today to Bikram Sambat
      const formattedDueDateBS = convertToBikramSambat(v.dueDate);
      const formattedTodayBS = convertToBikramSambat(today.toDate());

      // Dynamic message depending on overdue or upcoming
      let msg;
      if (dayjs(v.dueDate).isAfter(today)) {
        // Upcoming vaccine
        msg = `Dear parent, your child ${v.child.fullName} has ${v.vaccineType.name} scheduled on ${formattedDueDateBS}`;
      } else {
        // Overdue vaccine
        msg = `Dear parent, your child ${v.child.fullName} missed ${v.vaccineType.name} scheduled on ${formattedDueDateBS}. Please visit the clinic to catch up.`;
      }

      try {
        await sendSMS(v.child.phoneNumber, msg);

        // log in NotificationLog
        await prisma.notificationLog.create({
          data: {
            childId: v.childId,
            message: msg,
            sentAt: new Date(),
          },
        });

        // update ChildDueVaccine
        await prisma.childDueVaccine.update({
          where: { id: v.id },
          data: { notificationSent: true },
        });

        console.log(`[${new Date().toISOString()}] Notification sent and updated for ${v.child.fullName}`);
      } catch (err) {
        console.error(`❌ Failed to send SMS for ${v.child.fullName}`, err);
      }
    }

    skip += BATCH_SIZE;
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`[${new Date().toISOString()}] SMS notification job completed`);
};

/**
 * Run directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  sendUpcomingVaccinationSMS().catch(err => console.error('Job failed:', err));
}

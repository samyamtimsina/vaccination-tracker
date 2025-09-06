import { prisma } from '../utils/prisma.js';
import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const NepaliDate = require('nepali-date');
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// import Twilio from 'twilio'; // Twilio setup (commented out)

dotenv.config();

// Twilio client (commented out)
// const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Toggle dev mode: logs instead of sending
const DEV_MODE = process.env.DEV_MODE === 'true';

/**
 * Send Email via nodemailer or log in dev mode
 */
const sendEmail = async (to, subject, message) => {
  if (!to) {
    console.warn(`⚠️ Skipping email: no email address provided`);
    return;
  }

  if (DEV_MODE) {
    console.log(`📧 [DEV MODE] Email to ${to}: ${subject}\n${message}`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text: message,
    });

    console.log(`✅ Email sent to ${to}: ${subject}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}`, err);
    throw err;
  }
};

/**
 * Send SMS via Twilio or log in dev mode (commented out)
 */
// const sendSMS = async (phoneNumber, message) => {
//   if (DEV_MODE) {
//     console.log(`📱 [DEV MODE] SMS to ${phoneNumber}: ${message}`);
//     return true;
//   }

//   try {
//     const msg = await client.messages.create({
//       body: message,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: phoneNumber
//     });
//     console.log(`✅ SMS sent to ${phoneNumber}: ${message}`);
//     return msg;
//   } catch (err) {
//     console.error(`❌ Failed to send SMS to ${phoneNumber}`, err);
//     throw err;
//   }
// };

/**
 * Converts a date from AD to Bikram Sambat
 */
const convertToBikramSambat = (date) => {
  const nepaliDate = new NepaliDate(date);
  return nepaliDate.format('yyyy-mm-dd');
};

/**
 * Send Email reminders for due vaccines in Nepali
 */
export const sendUpcomingVaccinationNotifications = async () => {
  const today = dayjs().startOf('day');
  const threeDaysAhead = today.add(3, 'day').endOf('day');

  console.log(`[${new Date().toISOString()}] 🕒 Starting notification job...`);

  const BATCH_SIZE = 1000;
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    console.log(`[${new Date().toISOString()}] 🔄 Fetching batch starting at offset ${skip}...`);

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

    console.log(`[${new Date().toISOString()}] 📊 Fetched ${dueVaccines.length} due vaccines`);

    if (dueVaccines.length === 0) {
      hasMore = false;
      break;
    }

    for (const v of dueVaccines) {
      const birthDate = v.child.birthDate;
      const dose = v.vaccineType.doses.find(d => d.doseNumber === v.doseNumber);

      if (dose) {
        let maxAge = dayjs(birthDate);
        if (dose.maxAgeDays) maxAge = maxAge.add(dose.maxAgeDays, 'day');
        if (dose.maxAgeWeeks) maxAge = maxAge.add(dose.maxAgeWeeks, 'week');
        if (dose.maxAgeMonths) maxAge = maxAge.add(dose.maxAgeMonths, 'month');
        if (dose.maxAgeYears) maxAge = maxAge.add(dose.maxAgeYears, 'year');

        if (dayjs().isAfter(maxAge)) {
          console.log(`⚠️ Skipping ${v.child.fullName}: dose ${v.doseNumber} exceeds max age`);
          continue;
        }
      }

      const formattedDueDateBS = convertToBikramSambat(v.dueDate);

      let subject, msg;
      if (dayjs(v.dueDate).isAfter(today)) {
        subject = `💉 खोप सूचना: ${v.vaccineType.name}`;
        msg = `प्रिय अभिभावक, तपाईंको बच्चा ${v.child.fullName} को ${v.vaccineType.name} खोप ${formattedDueDateBS} मा तय गरिएको छ। कृपया समयमा खोप दिनुहोस्।`;
      } else {
        subject = `⚠️ खोप छुट्यो: ${v.vaccineType.name}`;
        msg = `प्रिय अभिभावक, तपाईंको बच्चा ${v.child.fullName} को ${v.vaccineType.name} खोप ${formattedDueDateBS} मा छुट्यो। कृपया नजिकको स्वास्थ्य संस्था पुगेर खोप पूरा गर्नुहोस्।`;
      }

      try {
        // Send via email
        await sendEmail(v.child.email, subject, msg);

        // Send via SMS (commented out)
        // await sendSMS(v.child.phoneNumber, msg);

        await prisma.notificationLog.create({
          data: {
            childId: v.childId,
            message: msg,
            sentAt: new Date(),
          },
        });

        await prisma.childDueVaccine.update({
          where: { id: v.id },
          data: { notificationSent: true },
        });

        console.log(`✅ Notification sent and updated for ${v.child.fullName}`);
      } catch (err) {
        console.error(`❌ Failed to send notification for ${v.child.fullName}`, err);
      }
    }

    skip += BATCH_SIZE;
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`[${new Date().toISOString()}] 🏁 Notification job completed`);
};

/**
 * Run directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  sendUpcomingVaccinationNotifications().catch(err => console.error('Job failed:', err));
}

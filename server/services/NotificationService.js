
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Simulates sending a notification and logs it to the database.
 * @param {string} childId The ID of the child.
 * @param {string} message The reminder message to "send".
 */
export async function sendChildVaccinationReminder(childId, message) {
    try {
        // 1. Log the notification to the database
        await prisma.notificationLog.create({
            data: {
                childId: childId,
                message: message,
            },
        });

        // 2. Mock the SMS message by logging it to the console
        console.log(`[MOCK SMS] To Child ID: ${childId}, Message: "${message}"`);
        console.log(`Reminder logged for child ${childId}.`);
    } catch (error) {
        console.error(`Error sending mock notification for child ${childId}:`, error);
    }
}
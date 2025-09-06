import cron from 'node-cron';
import { sendUpcomingVaccinationNotifications } from './vaccineReminderJob.js';
import path from 'path';
import url from 'url';

console.log('hello');

// Schedule to run every day at 6:00 AM server time
cron.schedule('0 6 * * *', async () => {
    console.log(`[${new Date().toISOString()}] ✅ Starting daily vaccination SMS job...`);
    try {
        await sendUpcomingVaccinationSMS();
        console.log(`[${new Date().toISOString()}] ✅ Daily vaccination SMS job completed`);
    } catch (err) {
        console.error(`[${new Date().toISOString()}] ❌ Error in daily vaccination SMS job:`, err);
    }
});

// Immediately run if this file is executed directly
const __filename = url.fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === path.resolve(__filename)) {
    console.log(`[${new Date().toISOString()}] ⚡ Running vaccination SMS job immediately for testing...`);
    sendUpcomingVaccinationNotifications()
        .then(() => console.log(`[${new Date().toISOString()}] ⚡ Immediate job completed`))
        .catch(err => console.error(`[${new Date().toISOString()}] ⚡ Immediate job failed:`, err));
}

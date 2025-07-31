// runCronManually.js
import dotenv from 'dotenv';
dotenv.config();

import { runVaccinationReminderJob } from './cron/vaccineReminderJob.js';

runVaccinationReminderJob();

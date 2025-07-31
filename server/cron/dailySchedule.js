// src/cron/dailySchedule.js
import cron from 'node-cron';
import { runVaccinationReminderJob } from './vaccineReminderJob.js';

cron.schedule('0 9 * * *', runVaccinationReminderJob);

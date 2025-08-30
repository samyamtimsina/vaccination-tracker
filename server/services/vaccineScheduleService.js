
import { prisma } from '../utils/prisma.js';
// In-memory cache for the vaccine schedule
let scheduleCache = null;
let lastVersion = null;

/**
 * Checks the current version of the vaccine schedule in the database.
 * If the version has changed, it invalidates the cache.
 */
const checkAndInvalidateCache = async () => {
    try {
        const currentVersion = await prisma.vaccineScheduleVersion.findFirst({
            orderBy: { lastModifiedAt: 'desc' }, // Corrected field
            select: { id: true },
        });

        if (currentVersion && currentVersion.id !== lastVersion) {
            console.log('New vaccine schedule version detected. Invalidating cache.');
            scheduleCache = null;
            lastVersion = currentVersion.id;
        }
    } catch (error) {
        console.error('Error checking for new vaccine schedule version:', error);
        // In case of an error, we can log it but don't want to stop the application.
    }
};

/**
 * Fetches the vaccine schedule from the database with caching.
 * The cache is invalidated when a new version is created.
 * @returns {Promise<Map<string, { doses: any[], catchUpRules: any }>>} A map of the vaccine schedule.
 */
export const getVaccineScheduleFromDB = async () => {
    // Check and invalidate the cache before returning the cached data.
    await checkAndInvalidateCache();

    // Return the cached data if it exists.
    if (scheduleCache) {
        return scheduleCache;
    }

    try {
        // Fetch all doses from the database
        const doses = await prisma.dose.findMany({
            orderBy: [{ vaccineType: 'asc' }, { doseNumber: 'asc' }],
        });

        // Transform the list of doses into a more usable map
        const schedule = new Map();
        doses.forEach((dose) => {
            if (!schedule.has(dose.vaccineType)) {
                schedule.set(dose.vaccineType, { doses: [], catchUpRules: null });
            }
            schedule.get(dose.vaccineType).doses.push(dose);
        });

        // Fetch all catch-up rules and add them to the map
        const catchUpRules = await prisma.catchUpRule.findMany();
        catchUpRules.forEach((rule) => {
            if (schedule.has(rule.vaccineType)) {
                schedule.get(rule.vaccineType).catchUpRules = rule;
            }
        });

        // Populate the cache and set the current version
        scheduleCache = schedule;
        const currentVersion = await prisma.vaccineScheduleVersion.findFirst({
            orderBy: { lastModifiedAt: 'desc' }, // Corrected field
            select: { id: true },
        });
        lastVersion = currentVersion ? currentVersion.id : null;

        return schedule;
    } catch (error) {
        console.error('Error fetching vaccine schedule from DB:', error);
        throw new Error('Could not retrieve vaccine schedule.');
    }
};

// New function to expose the schedule data through an API endpoint
// This will be used by the new GET /api/vaccine-schedule endpoint
export const getVaccineScheduleData = async (req, res) => {
    try {
        const schedule = await getVaccineScheduleFromDB();
        // Convert the Map to a plain object for JSON serialization
        const scheduleObject = Object.fromEntries(schedule.entries());
        res.status(200).json(scheduleObject);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve vaccine schedule',
            details: error.message,
        });
    }
};
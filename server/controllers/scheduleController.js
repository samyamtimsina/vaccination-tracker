// controllers/vaccineScheduleController.js

import { prisma } from '../utils/prisma.js';

export const getLatestVaccineSchedule = async (req, res) => {
    try {
        const scheduleVersion = await prisma.vaccineScheduleVersion.findFirst({
            orderBy: { id: 'desc' },
            include: {
                doses: true,
                catchUpRules: true,
            },
        });

        if (!scheduleVersion) {
            return res.status(404).json({ error: 'No vaccine schedule found' });
        }

        res.status(200).json(scheduleVersion);
    } catch (error) {
        console.error('Error fetching vaccine schedule:', error);
        res.status(500).json({ error: 'Failed to fetch vaccine schedule' });
    }
};

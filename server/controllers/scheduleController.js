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
export const getAllVaccineSchedules = async (req, res) => {
    try {
        const schedules = await prisma.vaccineScheduleVersion.findMany({
            include: { doses: true, catchUpRules: true },
            orderBy: { id: 'desc' },
        });
        res.json(schedules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch schedules' });
    }
};



export const createVaccineSchedule = async (req, res) => {
    try {
        const { versionName, doses, catchUpRules } = req.body;

        const newSchedule = await prisma.vaccineScheduleVersion.create({
            data: {
                versionName,
                doses: {
                    create: doses.map(d => ({
                        vaccineName: d.vaccineName,
                        doseNumber: d.doseNumber,
                        recommendedAgeWeeks: d.recommendedAgeWeeks,
                        recommendedAgeMonths: d.recommendedAgeMonths,
                    })),
                },
                catchUpRules: {
                    create: catchUpRules.map(r => ({
                        vaccineName: r.vaccineName,
                        ruleText: r.ruleText,
                    })),
                },
            },
            include: { doses: true, catchUpRules: true },
        });

        res.status(201).json(newSchedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create schedule' });
    }
};

// UPDATE existing schedule version (basic)
export const updateVaccineSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { versionName } = req.body;

        const updated = await prisma.vaccineScheduleVersion.update({
            where: { id: parseInt(id) },
            data: { versionName },
            include: { doses: true, catchUpRules: true },
        });

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update schedule' });
    }
};


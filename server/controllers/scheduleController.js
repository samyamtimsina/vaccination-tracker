// controllers/vaccineScheduleController.js

import { prisma } from '../utils/prisma.js';
export const getLatestVaccineSchedule = async (req, res) => {
    try {
        const scheduleVersion = await prisma.vaccineScheduleVersion.findFirst({
            orderBy: { id: 'desc' },
            include: {
                doses: {
                    include: { vaccineType: true }, // include related vaccineType
                },
                catchUpRules: {
                    include: { vaccineType: true }, // include related vaccineType
                },
            },
        });

        if (!scheduleVersion) {
            return res.status(404).json({ error: 'No vaccine schedule found' });
        }

        // Transform to include vaccineName like the old layout
        const dosesWithNames = scheduleVersion.doses.map(d => ({
            ...d,
            vaccineName: d.vaccineType.name, // add human-readable name
        }));

        const catchUpWithNames = scheduleVersion.catchUpRules.map(r => ({
            ...r,
            vaccineName: r.vaccineType.name,
        }));

        res.status(200).json({
            ...scheduleVersion,
            doses: dosesWithNames,
            catchUpRules: catchUpWithNames,
        });
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
        const { doses, catchUpRules, userId } = req.body;

        const newSchedule = await prisma.vaccineScheduleVersion.create({
            data: {
                lastModifiedBy: userId,
                doses: {
                    create: doses.map(d => ({
                        vaccineType: d.vaccineType,
                        doseNumber: d.doseNumber,
                        recommendedAtDays: d.recommendedAtDays,
                        recommendedAtWeeks: d.recommendedAtWeeks,
                        recommendedAtMonths: d.recommendedAtMonths,
                        recommendedAtYears: d.recommendedAtYears,
                        isBooster: d.isBooster ?? false,
                    })),
                },
                catchUpRules: {
                    create: catchUpRules.map(r => ({
                        vaccineType: r.vaccineType,
                        maxAgeDays: r.maxAgeDays,
                        maxAgeWeeks: r.maxAgeWeeks,
                        maxAgeMonths: r.maxAgeMonths,
                        maxAgeYears: r.maxAgeYears,
                        minIntervalWeeks: r.minIntervalWeeks,
                        totalDoses: r.totalDoses,
                    })),
                },
            },
            include: { doses: true, catchUpRules: true },
        });

        res.status(201).json(newSchedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create schedule" });
    }
};



export const updateVaccineSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { doses, catchUpRules, userId } = req.body;

        // Clear old relations
        await prisma.dose.deleteMany({ where: { scheduleVersionId: parseInt(id) } });
        await prisma.catchUpRule.deleteMany({ where: { scheduleVersionId: parseInt(id) } });

        // Update version + recreate relations
        const updated = await prisma.vaccineScheduleVersion.update({
            where: { id: parseInt(id) },
            data: {
                lastModifiedBy: userId,
                doses: {
                    create: doses.map(d => ({
                        vaccineType: d.vaccineType,
                        doseNumber: d.doseNumber,
                        recommendedAtDays: d.recommendedAtDays,
                        recommendedAtWeeks: d.recommendedAtWeeks,
                        recommendedAtMonths: d.recommendedAtMonths,
                        recommendedAtYears: d.recommendedAtYears,
                        isBooster: d.isBooster ?? false,
                    })),
                },
                catchUpRules: {
                    create: catchUpRules.map(r => ({
                        vaccineType: r.vaccineType,
                        maxAgeDays: r.maxAgeDays,
                        maxAgeWeeks: r.maxAgeWeeks,
                        maxAgeMonths: r.maxAgeMonths,
                        maxAgeYears: r.maxAgeYears,
                        minIntervalWeeks: r.minIntervalWeeks,
                        totalDoses: r.totalDoses,
                    })),
                },
            },
            include: { doses: true, catchUpRules: true },
        });

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update schedule" });
    }
};

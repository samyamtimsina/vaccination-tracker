// controllers/vaccineScheduleController.js
import { prisma } from '../utils/prisma.js';
import { recalculateChildVaccines } from '../services/recalculateChildVaccines.js';
import { Worker } from 'node:worker_threads';

// --- Schedule endpoints ---

// Get latest schedule version
export const getLatestVaccineSchedule = async (req, res) => {
    try {
        const scheduleVersion = await prisma.vaccineScheduleVersion.findFirst({
            orderBy: { id: 'desc' },
            include: {
                doses: { include: { vaccineType: true } },
            },
        });
        if (!scheduleVersion)
            return res.status(404).json({ error: 'No vaccine schedule found' });

        const dosesWithNames = scheduleVersion.doses.map(d => ({
            ...d,
            vaccineName: d.vaccineType.name,
        }));

        res.status(200).json({
            ...scheduleVersion,
            doses: dosesWithNames,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch vaccine schedule' });
    }
};

// Get all versions
export const getAllVaccineSchedules = async (req, res) => {
    try {
        const schedules = await prisma.vaccineScheduleVersion.findMany({
            include: {
                doses: { include: { vaccineType: true } },
            },
            orderBy: { id: 'desc' },
        });

        const schedulesWithNames = schedules.map(version => ({
            ...version,
            doses: version.doses.map(d => ({
                ...d,
                vaccineName: d.vaccineType.name,
            })),
        }));

        res.json(schedulesWithNames);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch schedules', details: err.message });
    }
};


// Create new schedule version (snapshot + optional modifications)
export const createNewScheduleVersion = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { copyFromVersionId, doses } = req.body;

        if (!copyFromVersionId) {
            return res.status(400).json({ error: "copyFromVersionId is required" });
        }

        // Get old version
        const oldVersion = await prisma.vaccineScheduleVersion.findUnique({
            where: { id: parseInt(copyFromVersionId) },
            include: { doses: true },
        });

        if (!oldVersion) {
            return res.status(404).json({ error: "Base version not found" });
        }

        // Helper to sanitize Dose objects
        const sanitizeDose = (d) => ({
            vaccineType: { connect: { id: d.vaccineTypeId } },
            doseNumber: d.doseNumber,
            recommendedAtDays: d.recommendedAtDays,
            recommendedAtWeeks: d.recommendedAtWeeks,
            recommendedAtMonths: d.recommendedAtMonths,
            recommendedAtYears: d.recommendedAtYears,
            isBooster: d.isBooster,
            isPrimary: d.isPrimary,
            maxAgeDays: d.maxAgeDays,
            maxAgeWeeks: d.maxAgeWeeks,
            maxAgeMonths: d.maxAgeMonths,
            maxAgeYears: d.maxAgeYears,
        });

        // Decide what to copy/create
        const dosesToCreate =
            doses?.length > 0
                ? doses.map(sanitizeDose) // use incoming changes
                : oldVersion.doses.map(sanitizeDose); // fallback to clone

        // If nothing actually changed → return old version
        const noChanges =
            JSON.stringify(dosesToCreate) === JSON.stringify(oldVersion.doses.map(sanitizeDose));

        if (noChanges) {
            return res.status(200).json({
                message: "No changes detected, not creating a new version",
                version: oldVersion,
            });
        }

        // Create the new schedule version
        const newVersion = await prisma.vaccineScheduleVersion.create({
            data: {
                user: { connect: { id: userId } },
                copiedFromVersion: { connect: { id: parseInt(copyFromVersionId) } },
                doses: { create: dosesToCreate },
            },
            include: { doses: true },
        });
        // Launch worker for recalculation
        const worker = new Worker('../server/services/recalculateWorker.js', {
            workerData: { newVersionId: newVersion.id, oldVersionId: copyFromVersionId },
        });

        worker.on('message', (msg) => {
            if (msg.error) console.error('Worker error:', msg.error);
            else if (msg.done) console.log(`✅ Recalculation finished for version ${newVersion.id}`);
            else console.log(`Progress: ${msg.processed}/${msg.totalChildren} children, total changes: ${msg.totalChanges}`);
        });

        worker.on('error', (err) => console.error('Worker thread error:', err));
        worker.on('exit', (code) => console.log(`Worker exited with code ${code}`));

        res.status(201).json(newVersion);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to create new schedule version",
            details: err.message,
        });
    }
};



// --- Vaccine Type CRUD ---

export const createVaccineType = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Vaccine name required' });

    try {
        const vt = await prisma.vaccineType.create({ data: { name } });
        res.status(201).json(vt);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create vaccine type', details: err.message });
    }
};

export const getVaccineTypes = async (req, res) => {
    try {
        const types = await prisma.vaccineType.findMany({ orderBy: { name: 'asc' } });
        res.status(200).json(types);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch vaccine types', details: err.message });
    }
};

export const updateVaccineType = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Vaccine name required' });

    try {
        const vt = await prisma.vaccineType.update({ where: { id: parseInt(id, 10) }, data: { name } });
        res.status(200).json(vt);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update vaccine type', details: err.message });
    }
};

export const deleteVaccineType = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.vaccineType.delete({ where: { id: parseInt(id, 10) } });
        res.status(200).json({ message: 'Vaccine type deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete vaccine type', details: err.message });
    }
};
// Disable instead of delete
export const disableVaccineType = async (req, res) => {
    const { id } = req.params;
    try {
        const vt = await prisma.vaccineType.update({
            where: { id: parseInt(id, 10) },
            data: { isActive: false },
        });
        res.status(200).json({ message: 'Vaccine type disabled', vt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to disable vaccine type', details: err.message });
    }
};

// Enable a vaccine type
export const enableVaccineType = async (req, res) => {
    const { id } = req.params;
    try {
        const vt = await prisma.vaccineType.update({
            where: { id: parseInt(id, 10) },
            data: { isActive: true },
        });
        res.status(200).json({ message: 'Vaccine type enabled', vt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to enable vaccine type', details: err.message });
    }
};

// --- Dose CRUD (always linked to latest schedule version) ---

// export const createDose = async (req, res) => {
//     const { vaccineTypeId, doseNumber, recommendedAtDays, recommendedAtWeeks, recommendedAtMonths, recommendedAtYears, isBooster } = req.body;
//     if (!vaccineTypeId || !doseNumber) return res.status(400).json({ error: 'vaccineTypeId and doseNumber required' });

//     try {
//         const latestVersion = await prisma.vaccineScheduleVersion.findFirst({ orderBy: { id: 'desc' } });
//         if (!latestVersion) return res.status(400).json({ error: 'No vaccine schedule version found' });

//         const dose = await prisma.dose.create({
//             data: {
//                 vaccineTypeId,
//                 doseNumber,
//                 recommendedAtDays: recommendedAtDays ?? null,
//                 recommendedAtWeeks: recommendedAtWeeks ?? null,
//                 recommendedAtMonths: recommendedAtMonths ?? null,
//                 recommendedAtYears: recommendedAtYears ?? null,
//                 isBooster: isBooster ?? false,
//                 scheduleVersionId: latestVersion.id,
//             },
//         });

//         res.status(201).json(dose);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to create dose', details: err.message });
//     }
// };

// export const updateDose = async (req, res) => {
//     const { id } = req.params;
//     const updateData = req.body;

//     try {
//         const dose = await prisma.dose.update({ where: { id: parseInt(id, 10) }, data: updateData });
//         res.status(200).json(dose);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to update dose', details: err.message });
//     }
// };

// export const deleteDose = async (req, res) => {
//     const { id } = req.params;
//     try {
//         await prisma.dose.delete({ where: { id: parseInt(id, 10) } });
//         res.status(200).json({ message: 'Dose deleted' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to delete dose', details: err.message });
//     }
// };

// // --- Catch-Up Rule CRUD (linked to latest schedule version) ---

// export const createCatchUpRule = async (req, res) => {
//     const { vaccineTypeId, maxAgeDays, maxAgeWeeks, maxAgeMonths, maxAgeYears, minIntervalWeeks, totalDoses } = req.body;
//     if (!vaccineTypeId) return res.status(400).json({ error: 'vaccineTypeId required' });

//     try {
//         const latestVersion = await prisma.vaccineScheduleVersion.findFirst({ orderBy: { id: 'desc' } });
//         if (!latestVersion) return res.status(400).json({ error: 'No vaccine schedule version found' });

//         const rule = await prisma.catchUpRule.create({
//             data: {
//                 vaccineTypeId,
//                 maxAgeDays: maxAgeDays ?? null,
//                 maxAgeWeeks: maxAgeWeeks ?? null,
//                 maxAgeMonths: maxAgeMonths ?? null,
//                 maxAgeYears: maxAgeYears ?? null,
//                 minIntervalWeeks: minIntervalWeeks ?? null,
//                 totalDoses: totalDoses ?? null,
//                 scheduleVersionId: latestVersion.id,
//             },
//         });

//         res.status(201).json(rule);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to create catch-up rule', details: err.message });
//     }
// };

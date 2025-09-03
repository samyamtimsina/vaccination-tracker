async function recalcDueDates(newScheduleVersionId: number) {
    const batchSize = 500; // adjust based on your server
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
        const children = await prisma.child.findMany({
            skip,
            take: batchSize,
            include: { dueVaccines: true },
        });

        if (!children.length) break;

        const updates: any[] = [];

        for (const child of children) {
            const birthDate = child.birthDate;
            for (const due of child.dueVaccines) {
                if (due.isCompleted) continue; // skip already completed doses

                // fetch dose from new schedule
                const dose = await prisma.dose.findFirst({
                    where: {
                        scheduleVersionId: newScheduleVersionId,
                        vaccineTypeId: due.vaccineTypeId,
                        doseNumber: due.doseNumber
                    }
                });
                if (!dose) continue;

                let newDueDate = new Date(birthDate);
                if (dose.recommendedAtDays) newDueDate.setDate(newDueDate.getDate() + dose.recommendedAtDays);
                if (dose.recommendedAtWeeks) newDueDate.setDate(newDueDate.getDate() + dose.recommendedAtWeeks * 7);
                if (dose.recommendedAtMonths) newDueDate.setMonth(newDueDate.getMonth() + dose.recommendedAtMonths);
                if (dose.recommendedAtYears) newDueDate.setFullYear(newDueDate.getFullYear() + dose.recommendedAtYears);

                if (due.dueDate.getTime() !== newDueDate.getTime()) {
                    updates.push({
                        id: due.id,
                        previousDueDate: due.dueDate,
                        dueDate: newDueDate,
                        scheduleVersion: newScheduleVersionId,
                        correctiveSent: false, // reset corrective flag
                    });
                }
            }
        }

        // bulk update
        for (const upd of updates) {
            await prisma.childDueVaccine.update({
                where: { id: upd.id },
                data: {
                    previousDueDate: upd.previousDueDate,
                    dueDate: upd.dueDate,
                    scheduleVersion: upd.scheduleVersion,
                    correctiveSent: upd.correctiveSent
                }
            });
        }

        skip += batchSize;
        hasMore = children.length === batchSize;
    }

    console.log('Recalculation finished.');
}

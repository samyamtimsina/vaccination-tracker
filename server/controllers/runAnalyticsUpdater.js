import { prisma } from '../utils/prisma.js';
import { subDays, startOfDay } from 'date-fns';

class AnalyticsFactUpdater {
    async updateAllFacts() {
        try {
            console.log('🔄 Starting analytics fact update...');

            await this.updateChildAnalytics();
            await this.updateMotherAnalytics();
            await this.updateGrowthAnalytics();

            console.log('✅ Analytics facts updated successfully');
        } catch (error) {
            console.error('❌ Error updating analytics facts:', error);
            throw error;
        }
    }

    async updateChildAnalytics() {
        // Get data from last fact update or beginning of time
        const meta = await prisma.analyticsMeta.upsert({
            where: { domain: 'child' },
            update: {},
            create: {
                domain: 'child',
                lastProcessedTimestamp: new Date('2024-01-01'),
                recordsProcessed: 0
            }
        });

        console.log('📊 Updating child analytics facts...');
        console.log(`📅 Processing records since: ${meta.lastProcessedTimestamp}`);

        try {
            // Main aggregation query
            const childData = await prisma.$queryRaw`
          WITH child_metrics AS (
            SELECT 
              DATE(c."createdAt") as day,
              c."wardNumber",
              vr."vaccineTypeId",
              c.gender,
              CASE
                WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 1 THEN '0-1y'
                WHEN EXTRACT(YEAR FROM AGE(c."birthDate")) < 5 THEN '1-5y'
                ELSE '5y+'
              END as age_group,
              COUNT(DISTINCT c.id) as total_children,
              COUNT(DISTINCT CASE WHEN vr.id IS NOT NULL AND vr."isComplete" = true THEN vr.id END) as vaccinated_children,
              COUNT(DISTINCT CASE WHEN NOT EXISTS (
                SELECT 1 FROM "VaccinationRecord" vr2 
                WHERE vr2."citizenId" = c.id AND vr2."isComplete" = true
              ) THEN c.id END) as zero_dose_children,
              
              COUNT(DISTINCT CASE WHEN cdv."dueDate" = CURRENT_DATE THEN cdv.id END) as due_today,
              COUNT(DISTINCT CASE WHEN cdv."dueDate" < CURRENT_DATE AND cdv."isCompleted" = false THEN cdv.id END) as overdue,
              
              COUNT(DISTINCT CASE WHEN vr."dateGiven" <= cdv."dueDate" THEN vr.id END) as on_time,
              COUNT(DISTINCT CASE WHEN vr."dateGiven" > cdv."dueDate" THEN vr.id END) as late_vaccinations,
              
              COUNT(DISTINCT CASE WHEN vr."doseNumber" = 1 THEN vr.id END) as started_vaccinations,
              COUNT(DISTINCT CASE WHEN vr."isComplete" = true THEN vr.id END) as completed_vaccinations
              
            FROM "Child" c
            LEFT JOIN "VaccinationRecord" vr ON c.id = vr."citizenId"
            LEFT JOIN "ChildDueVaccine" cdv ON c.id = cdv."childId"
            WHERE c."createdAt" > ${meta.lastProcessedTimestamp}
            GROUP BY 1, 2, 3, 4, 5
          )
          INSERT INTO "ChildAnalyticsFact" (
            "day", "wardNumber", "vaccineTypeId", "gender", "ageGroup",
            "totalRegisteredChildren", "vaccinatedChildren", "zeroDoseChildren",
            "dueToday", "overdue", "onTimeVaccinations", "lateVaccinations", "dropoutRate"
          )
          SELECT 
            day, "wardNumber", "vaccineTypeId", gender, age_group,
            total_children,
            vaccinated_children,
            zero_dose_children,
            due_today,
            overdue,
            on_time,
            late_vaccinations,
            CASE 
              WHEN started_vaccinations > 0 
              THEN (started_vaccinations - completed_vaccinations)::float / started_vaccinations
              ELSE 0 
            END as dropout_rate
          FROM child_metrics
          ON CONFLICT ("day", "wardNumber", "vaccineTypeId", "gender", "ageGroup") 
          DO UPDATE SET
            "totalRegisteredChildren" = EXCLUDED."totalRegisteredChildren",
            "vaccinatedChildren" = EXCLUDED."vaccinatedChildren",
            "zeroDoseChildren" = EXCLUDED."zeroDoseChildren",
            "dueToday" = EXCLUDED."dueToday",
            "overdue" = EXCLUDED."overdue",
            "onTimeVaccinations" = EXCLUDED."onTimeVaccinations",
            "lateVaccinations" = EXCLUDED."lateVaccinations",
            "dropoutRate" = EXCLUDED."dropoutRate"
          RETURNING *
        `;

            // Update meta
            await prisma.analyticsMeta.update({
                where: { domain: 'child' },
                data: {
                    lastProcessedTimestamp: new Date(),
                    recordsProcessed: { increment: 1 }
                }
            });

            console.log(`✅ Child analytics updated: ${childData.length} fact rows`);
        } catch (error) {
            console.error('❌ Error in child analytics:', error);
            throw error;
        }
    }

    async updateMotherAnalytics() {
        const meta = await prisma.analyticsMeta.upsert({
            where: { domain: 'mother' },
            update: {},
            create: {
                domain: 'mother',
                lastProcessedTimestamp: new Date('2024-01-01'),
                recordsProcessed: 0
            }
        });

        console.log('👩 Updating mother analytics facts...');

        try {
            const motherData = await prisma.$queryRaw`
          WITH mother_metrics AS (
            SELECT 
              DATE(m."createdAt") as day,
              m."wardNumber",
              CASE
                WHEN EXTRACT(YEAR FROM AGE(m."dateOfBirth")) < 25 THEN '15-25'
                WHEN EXTRACT(YEAR FROM AGE(m."dateOfBirth")) < 35 THEN '25-35'
                ELSE '35+'
              END as age_group,
              COUNT(DISTINCT m.id) as total_mothers,
              COUNT(DISTINCT td.id) as td_doses,
              COUNT(DISTINCT CASE WHEN m."pregnancyCount" = 1 THEN m.id END) as first_time_mothers,
              COUNT(DISTINCT CASE WHEN (
                SELECT COUNT(*) FROM "TDDose" td2 
                WHERE td2."motherId" = m.id AND td2."doseNumber" >= 2
              ) >= 2 THEN m.id END) as completed_schedule
            FROM "Mother" m
            LEFT JOIN "TDDose" td ON m.id = td."motherId"
            WHERE m."createdAt" > ${meta.lastProcessedTimestamp}
            GROUP BY 1, 2, 3
          )
          INSERT INTO "MotherAnalyticsFact" (
            "day", "wardNumber", "ageGroup",
            "totalRegisteredMothers", "tdDosesAdministered", "firstTimeMothers", "completedTDSchedule"
          )
          SELECT 
            day, "wardNumber", age_group,
            total_mothers, td_doses, first_time_mothers, completed_schedule
          FROM mother_metrics
          ON CONFLICT ("day", "wardNumber", "ageGroup") 
          DO UPDATE SET
            "totalRegisteredMothers" = EXCLUDED."totalRegisteredMothers",
            "tdDosesAdministered" = EXCLUDED."tdDosesAdministered",
            "firstTimeMothers" = EXCLUDED."firstTimeMothers",
            "completedTDSchedule" = EXCLUDED."completedTDSchedule"
          RETURNING *
        `;

            await prisma.analyticsMeta.update({
                where: { domain: 'mother' },
                data: {
                    lastProcessedTimestamp: new Date(),
                    recordsProcessed: { increment: 1 }
                }
            });

            console.log(`✅ Mother analytics updated: ${motherData.length} fact rows`);
        } catch (error) {
            console.error('❌ Error in mother analytics:', error);
            throw error;
        }
    }

    async updateGrowthAnalytics() {
        console.log('📈 Growth analytics update skipped for now...');
        // Implementation for growth metrics
    }
}

// SIMPLE DIRECT EXECUTION FOR ES MODULES
async function main() {
    console.log('🚀 Starting Analytics Fact Updater...');
    const updater = new AnalyticsFactUpdater();

    try {
        await updater.updateAllFacts();
        console.log('🎉 All analytics facts updated successfully!');
    } catch (error) {
        console.error('💥 Failed to update analytics facts:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        console.log('🔌 Database connection closed.');
    }
}

// ES Modules direct execution check
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default AnalyticsFactUpdater;
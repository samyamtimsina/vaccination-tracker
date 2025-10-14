-- CreateTable
CREATE TABLE "public"."AnalyticsMeta" (
    "domain" TEXT NOT NULL,
    "lastProcessedTimestamptz" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsMeta_pkey" PRIMARY KEY ("domain")
);

-- CreateTable
CREATE TABLE "public"."ChildAnalyticsFact" (
    "id" SERIAL NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "ward" INTEGER NOT NULL,
    "vaccineTypeId" INTEGER,
    "doseNumber" INTEGER,
    "gender" TEXT,
    "ageGroup" TEXT,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "totalRegisteredChildren" INTEGER NOT NULL DEFAULT 0,
    "vaccinatedChildren" INTEGER NOT NULL DEFAULT 0,
    "zeroDoseChildren" INTEGER NOT NULL DEFAULT 0,
    "dueToday" INTEGER NOT NULL DEFAULT 0,
    "overdue" INTEGER NOT NULL DEFAULT 0,
    "upcomingDue" INTEGER NOT NULL DEFAULT 0,
    "onTime" INTEGER NOT NULL DEFAULT 0,
    "late" INTEGER NOT NULL DEFAULT 0,
    "dropoutFirstLast" INTEGER NOT NULL DEFAULT 0,
    "dropoutRate" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ChildAnalyticsFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MotherAnalyticsFact" (
    "id" SERIAL NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "ward" INTEGER NOT NULL,
    "ageGroup" TEXT,
    "totalRegisteredMothers" INTEGER NOT NULL DEFAULT 0,
    "td1Given" INTEGER NOT NULL DEFAULT 0,
    "td2Given" INTEGER NOT NULL DEFAULT 0,
    "td2plusGiven" INTEGER NOT NULL DEFAULT 0,
    "tdDropoutFirstLast" INTEGER NOT NULL DEFAULT 0,
    "tdDropoutRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "td2OnTime" INTEGER NOT NULL DEFAULT 0,
    "td2Late" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MotherAnalyticsFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GrowthAnalyticsFact" (
    "id" SERIAL NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "ward" INTEGER NOT NULL,
    "ageGroup" TEXT,
    "gender" TEXT,
    "underweightCount" INTEGER NOT NULL DEFAULT 0,
    "severelyUnderweightCount" INTEGER NOT NULL DEFAULT 0,
    "normalWeightCount" INTEGER NOT NULL DEFAULT 0,
    "overweightCount" INTEGER NOT NULL DEFAULT 0,
    "avgWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recordsCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GrowthAnalyticsFact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChildAnalyticsFact_day_idx" ON "public"."ChildAnalyticsFact"("day");

-- CreateIndex
CREATE INDEX "ChildAnalyticsFact_ward_idx" ON "public"."ChildAnalyticsFact"("ward");

-- CreateIndex
CREATE INDEX "ChildAnalyticsFact_vaccineTypeId_idx" ON "public"."ChildAnalyticsFact"("vaccineTypeId");

-- CreateIndex
CREATE INDEX "ChildAnalyticsFact_ageGroup_idx" ON "public"."ChildAnalyticsFact"("ageGroup");

-- CreateIndex
CREATE INDEX "MotherAnalyticsFact_day_idx" ON "public"."MotherAnalyticsFact"("day");

-- CreateIndex
CREATE INDEX "MotherAnalyticsFact_ward_idx" ON "public"."MotherAnalyticsFact"("ward");

-- CreateIndex
CREATE INDEX "GrowthAnalyticsFact_day_idx" ON "public"."GrowthAnalyticsFact"("day");

-- CreateIndex
CREATE INDEX "GrowthAnalyticsFact_ward_idx" ON "public"."GrowthAnalyticsFact"("ward");

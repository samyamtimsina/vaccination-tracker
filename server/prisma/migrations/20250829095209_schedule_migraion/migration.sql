-- CreateTable
CREATE TABLE "public"."Dose" (
    "id" SERIAL NOT NULL,
    "vaccineType" "public"."VaccineType" NOT NULL,
    "doseNumber" INTEGER NOT NULL,
    "recommendedAtDays" INTEGER,
    "recommendedAtWeeks" INTEGER,
    "recommendedAtMonths" INTEGER,
    "recommendedAtYears" INTEGER,
    "isBooster" BOOLEAN DEFAULT false,

    CONSTRAINT "Dose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VaccineScheduleVersion" (
    "id" SERIAL NOT NULL,
    "lastModifiedAt" TIMESTAMP(3) NOT NULL,
    "lastModifiedBy" INTEGER,

    CONSTRAINT "VaccineScheduleVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CatchUpRule" (
    "id" SERIAL NOT NULL,
    "vaccineType" "public"."VaccineType" NOT NULL,
    "maxAgeDays" INTEGER,
    "maxAgeWeeks" INTEGER,
    "maxAgeMonths" INTEGER,
    "maxAgeYears" INTEGER,
    "minIntervalWeeks" INTEGER,
    "totalDoses" INTEGER,

    CONSTRAINT "CatchUpRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dose_vaccineType_doseNumber_key" ON "public"."Dose"("vaccineType", "doseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CatchUpRule_vaccineType_key" ON "public"."CatchUpRule"("vaccineType");

-- AddForeignKey
ALTER TABLE "public"."VaccineScheduleVersion" ADD CONSTRAINT "VaccineScheduleVersion_lastModifiedBy_fkey" FOREIGN KEY ("lastModifiedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

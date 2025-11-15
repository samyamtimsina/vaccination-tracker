-- CreateTable
CREATE TABLE "public"."MonthlyVaccineInventory" (
    "id" SERIAL NOT NULL,
    "snapshotMonth" DATE NOT NULL,
    "vaccineTypeId" INTEGER NOT NULL,
    "received" INTEGER NOT NULL DEFAULT 0,
    "spent" INTEGER NOT NULL DEFAULT 0,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "spoiled" INTEGER NOT NULL DEFAULT 0,
    "returned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyVaccineInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MonthlyDoseCount" (
    "id" SERIAL NOT NULL,
    "snapshotMonth" DATE NOT NULL,
    "vaccineTypeId" INTEGER NOT NULL,
    "doseNumber" INTEGER NOT NULL,
    "countGiven" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyDoseCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MonthlySpecialFact" (
    "id" SERIAL NOT NULL,
    "snapshotMonth" DATE NOT NULL,
    "fullWithin23m" INTEGER NOT NULL DEFAULT 0,
    "started24To59m" INTEGER NOT NULL DEFAULT 0,
    "aefiNormal" INTEGER NOT NULL DEFAULT 0,
    "aefiSerious" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlySpecialFact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MonthlyVaccineInventory_snapshotMonth_idx" ON "public"."MonthlyVaccineInventory"("snapshotMonth");

-- CreateIndex
CREATE INDEX "MonthlyVaccineInventory_vaccineTypeId_idx" ON "public"."MonthlyVaccineInventory"("vaccineTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyVaccineInventory_snapshotMonth_vaccineTypeId_key" ON "public"."MonthlyVaccineInventory"("snapshotMonth", "vaccineTypeId");

-- CreateIndex
CREATE INDEX "MonthlyDoseCount_snapshotMonth_idx" ON "public"."MonthlyDoseCount"("snapshotMonth");

-- CreateIndex
CREATE INDEX "MonthlyDoseCount_vaccineTypeId_idx" ON "public"."MonthlyDoseCount"("vaccineTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyDoseCount_snapshotMonth_vaccineTypeId_doseNumber_key" ON "public"."MonthlyDoseCount"("snapshotMonth", "vaccineTypeId", "doseNumber");

-- CreateIndex
CREATE INDEX "MonthlySpecialFact_snapshotMonth_idx" ON "public"."MonthlySpecialFact"("snapshotMonth");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlySpecialFact_snapshotMonth_key" ON "public"."MonthlySpecialFact"("snapshotMonth");

-- AddForeignKey
ALTER TABLE "public"."MonthlyVaccineInventory" ADD CONSTRAINT "MonthlyVaccineInventory_vaccineTypeId_fkey" FOREIGN KEY ("vaccineTypeId") REFERENCES "public"."VaccineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MonthlyDoseCount" ADD CONSTRAINT "MonthlyDoseCount_vaccineTypeId_fkey" FOREIGN KEY ("vaccineTypeId") REFERENCES "public"."VaccineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

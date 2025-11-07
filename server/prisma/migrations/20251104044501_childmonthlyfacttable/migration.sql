-- CreateTable
CREATE TABLE "public"."ChildMonthlyDropoutFact" (
    "id" SERIAL NOT NULL,
    "snapshotMonth" DATE NOT NULL,
    "ward" INTEGER NOT NULL,
    "vaccineTypeId" INTEGER NOT NULL,
    "doseNumber" INTEGER NOT NULL DEFAULT 0,
    "gender" TEXT,
    "ageGroup" TEXT,
    "casteCode" INTEGER,
    "totalDue" INTEGER NOT NULL DEFAULT 0,
    "totalCompleted" INTEGER NOT NULL DEFAULT 0,
    "dropoutCount" INTEGER NOT NULL DEFAULT 0,
    "dropoutRate" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildMonthlyDropoutFact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChildMonthlyDropoutFact_snapshotMonth_idx" ON "public"."ChildMonthlyDropoutFact"("snapshotMonth");

-- CreateIndex
CREATE INDEX "ChildMonthlyDropoutFact_ward_idx" ON "public"."ChildMonthlyDropoutFact"("ward");

-- CreateIndex
CREATE INDEX "ChildMonthlyDropoutFact_vaccineTypeId_idx" ON "public"."ChildMonthlyDropoutFact"("vaccineTypeId");

-- CreateIndex
CREATE INDEX "ChildMonthlyDropoutFact_doseNumber_idx" ON "public"."ChildMonthlyDropoutFact"("doseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ChildMonthlyDropoutFact_snapshotMonth_ward_vaccineTypeId_do_key" ON "public"."ChildMonthlyDropoutFact"("snapshotMonth", "ward", "vaccineTypeId", "doseNumber", "gender", "ageGroup", "casteCode");

-- AddForeignKey
ALTER TABLE "public"."ChildMonthlyDropoutFact" ADD CONSTRAINT "ChildMonthlyDropoutFact_vaccineTypeId_fkey" FOREIGN KEY ("vaccineTypeId") REFERENCES "public"."VaccineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

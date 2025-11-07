-- CreateTable
CREATE TABLE "public"."ChildRollingDropoutFact" (
    "id" SERIAL NOT NULL,
    "snapshotMonth" DATE NOT NULL,
    "windowType" TEXT NOT NULL,
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

    CONSTRAINT "ChildRollingDropoutFact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChildRollingDropoutFact_snapshotMonth_idx" ON "public"."ChildRollingDropoutFact"("snapshotMonth");

-- CreateIndex
CREATE INDEX "ChildRollingDropoutFact_windowType_idx" ON "public"."ChildRollingDropoutFact"("windowType");

-- CreateIndex
CREATE INDEX "ChildRollingDropoutFact_ward_idx" ON "public"."ChildRollingDropoutFact"("ward");

-- CreateIndex
CREATE INDEX "ChildRollingDropoutFact_vaccineTypeId_idx" ON "public"."ChildRollingDropoutFact"("vaccineTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildRollingDropoutFact_snapshotMonth_windowType_ward_vacci_key" ON "public"."ChildRollingDropoutFact"("snapshotMonth", "windowType", "ward", "vaccineTypeId", "doseNumber", "gender", "ageGroup", "casteCode");

-- AddForeignKey
ALTER TABLE "public"."ChildRollingDropoutFact" ADD CONSTRAINT "ChildRollingDropoutFact_vaccineTypeId_fkey" FOREIGN KEY ("vaccineTypeId") REFERENCES "public"."VaccineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

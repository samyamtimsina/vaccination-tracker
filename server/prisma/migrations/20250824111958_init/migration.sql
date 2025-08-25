-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'WARD_OFFICER');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "public"."VaccineType" AS ENUM ('BCG', 'DPT_HEPB_HIB', 'ROTA', 'OPV', 'FIPV', 'PCV', 'MR', 'JE', 'TCV', 'HPV', 'OTHERS');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "wardId" INTEGER,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Child" (
    "id" TEXT NOT NULL,
    "sewaDartaNumber" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "wardNumber" INTEGER NOT NULL,
    "casteCode" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "tole" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "purnaKhop" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "createdById" INTEGER NOT NULL,
    "verifiedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFromOtherMunicipality" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mother" (
    "id" TEXT NOT NULL,
    "sewaDartaNumber" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "casteCode" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "tole" TEXT NOT NULL,
    "wardNumber" INTEGER NOT NULL,
    "pregnancyCount" INTEGER NOT NULL,
    "previousTDTakenCount" INTEGER NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "isFromOtherMunicipality" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Mother_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TDDose" (
    "id" TEXT NOT NULL,
    "doseNumber" INTEGER NOT NULL,
    "dateGiven" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "motherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "administeredById" INTEGER NOT NULL,

    CONSTRAINT "TDDose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VaccinationRecord" (
    "id" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "vaccineType" "public"."VaccineType" NOT NULL,
    "doseNumber" INTEGER NOT NULL,
    "dateGiven" TIMESTAMP(3) NOT NULL,
    "isComplete" BOOLEAN NOT NULL,
    "remarks" TEXT,
    "recommendedAtMonths" INTEGER NOT NULL,
    "customVaccineName" TEXT,
    "type" TEXT NOT NULL DEFAULT 'routine',
    "createdById" INTEGER NOT NULL,
    "administeredById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VaccinationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NotificationLog" (
    "id" SERIAL NOT NULL,
    "citizenId" TEXT NOT NULL,
    "vaccineType" "public"."VaccineType" NOT NULL,
    "doseNumber" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CorrectionRequest" (
    "id" SERIAL NOT NULL,
    "vaccinationId" TEXT NOT NULL,
    "requestedById" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedById" INTEGER,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "CorrectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Certificate" (
    "id" SERIAL NOT NULL,
    "childId" TEXT NOT NULL,
    "issuedById" INTEGER NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,
    "pdfPath" TEXT,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeightRecord" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "childId" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,
    "administeredById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeightRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Child_sewaDartaNumber_key" ON "public"."Child"("sewaDartaNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Mother_sewaDartaNumber_key" ON "public"."Mother"("sewaDartaNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_token_key" ON "public"."Certificate"("token");

-- AddForeignKey
ALTER TABLE "public"."Child" ADD CONSTRAINT "Child_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Child" ADD CONSTRAINT "Child_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Mother" ADD CONSTRAINT "Mother_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TDDose" ADD CONSTRAINT "TDDose_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "public"."Mother"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TDDose" ADD CONSTRAINT "TDDose_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TDDose" ADD CONSTRAINT "TDDose_administeredById_fkey" FOREIGN KEY ("administeredById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_administeredById_fkey" FOREIGN KEY ("administeredById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationLog" ADD CONSTRAINT "NotificationLog_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeightRecord" ADD CONSTRAINT "WeightRecord_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeightRecord" ADD CONSTRAINT "WeightRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeightRecord" ADD CONSTRAINT "WeightRecord_administeredById_fkey" FOREIGN KEY ("administeredById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" SERIAL NOT NULL,
    "citizenId" TEXT NOT NULL,
    "vaccineType" "VaccineType" NOT NULL,
    "doseNumber" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "Citizen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

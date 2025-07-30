-- CreateTable
CREATE TABLE "Mother" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "contact" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ethnicityCode" TEXT NOT NULL,
    "tdStatus" TEXT,
    "wardId" INTEGER NOT NULL,

    CONSTRAINT "Mother_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ethnicityCode" TEXT NOT NULL,
    "birthWeight" DOUBLE PRECISION NOT NULL,
    "placeOfBirth" TEXT NOT NULL,
    "wardId" INTEGER NOT NULL,
    "motherId" INTEGER NOT NULL,
    "ageInMonths" INTEGER NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

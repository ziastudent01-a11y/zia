-- CreateTable
CREATE TABLE "Campus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Campus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "fileNumber" TEXT NOT NULL,
    "studentCNIC" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT,
    "dob" TIMESTAMP(3),
    "phone" TEXT,
    "admissionDate" TIMESTAMP(3),
    "campusId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmploymentProfile" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "employmentHolder" TEXT NOT NULL,
    "workerName" TEXT,
    "workerCNIC" TEXT,
    "factoryCardNo" TEXT,
    "department" TEXT,
    "factoryLocation" TEXT,
    "eligibility" BOOLEAN,

    CONSTRAINT "EmploymentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicStatus" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseStatus" TEXT NOT NULL,
    "boardRegistrationStatus" TEXT,

    CONSTRAINT "AcademicStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingFiling" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "filingStatus" TEXT NOT NULL,
    "deficiencyStatus" TEXT,
    "pwwbUploadStatus" TEXT,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FundingFiling_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campus_code_key" ON "Campus"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Student_fileNumber_key" ON "Student"("fileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentCNIC_key" ON "Student"("studentCNIC");

-- CreateIndex
CREATE UNIQUE INDEX "EmploymentProfile_studentId_key" ON "EmploymentProfile"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicStatus_studentId_key" ON "AcademicStatus"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "FundingFiling_studentId_key" ON "FundingFiling"("studentId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentProfile" ADD CONSTRAINT "EmploymentProfile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicStatus" ADD CONSTRAINT "AcademicStatus_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingFiling" ADD CONSTRAINT "FundingFiling_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `admissionDate` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `studentCNIC` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `AcademicStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmploymentProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FundingFiling` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Campus` table without a default value. This is not possible if the table is not empty.
  - Made the column `latitude` on table `Campus` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Campus` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `applicationStatus` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseStatus` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guardianType` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isEligible` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GuardianType" AS ENUM ('SELF', 'PARENT', 'GUARDIAN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NOT_FILED', 'FILE_COMPLETE', 'FILE_INCOMPLETE', 'FILE_SUBMITTED', 'RETURNED');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('ENROLLED', 'COMPLETED', 'DROPPED');

-- DropForeignKey
ALTER TABLE "AcademicStatus" DROP CONSTRAINT "AcademicStatus_studentId_fkey";

-- DropForeignKey
ALTER TABLE "EmploymentProfile" DROP CONSTRAINT "EmploymentProfile_studentId_fkey";

-- DropForeignKey
ALTER TABLE "FundingFiling" DROP CONSTRAINT "FundingFiling_studentId_fkey";

-- DropIndex
DROP INDEX "Student_studentCNIC_key";

-- AlterTable
ALTER TABLE "Campus" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "admissionDate",
DROP COLUMN "dob",
DROP COLUMN "fullName",
DROP COLUMN "phone",
DROP COLUMN "studentCNIC",
ADD COLUMN     "applicationStatus" "ApplicationStatus" NOT NULL,
ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "courseStatus" "CourseStatus" NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "dateOfJoining" TIMESTAMP(3),
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "factoryCardNo" TEXT,
ADD COLUMN     "factoryDepartment" TEXT,
ADD COLUMN     "factoryLocation" TEXT,
ADD COLUMN     "factoryName" TEXT,
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "fileStatusOnline" TEXT,
ADD COLUMN     "guardianCNIC" TEXT,
ADD COLUMN     "guardianName" TEXT,
ADD COLUMN     "guardianType" "GuardianType" NOT NULL,
ADD COLUMN     "isEligible" BOOLEAN NOT NULL,
ADD COLUMN     "lastDegree" TEXT,
ADD COLUMN     "nationalId" TEXT NOT NULL,
ADD COLUMN     "phonePrimary" TEXT,
ADD COLUMN     "phoneSecondary" TEXT,
ADD COLUMN     "programName" TEXT NOT NULL,
ADD COLUMN     "pwwbUploadStatus" TEXT,
ADD COLUMN     "registrationStatus" TEXT,
ADD COLUMN     "serviceDuration" TEXT,
ADD COLUMN     "session" TEXT,
ADD COLUMN     "studentName" TEXT NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- DropTable
DROP TABLE "AcademicStatus";

-- DropTable
DROP TABLE "EmploymentProfile";

-- DropTable
DROP TABLE "FundingFiling";

-- CreateIndex
CREATE INDEX "Student_campusId_idx" ON "Student"("campusId");

-- CreateIndex
CREATE INDEX "Student_applicationStatus_idx" ON "Student"("applicationStatus");

-- CreateIndex
CREATE INDEX "Student_courseStatus_idx" ON "Student"("courseStatus");

/*
  Warnings:

  - Added the required column `city` to the `Campus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campus" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT NOT NULL;

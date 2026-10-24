/*
  Warnings:

  - Made the column `syllabus` on table `courses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "syllabus" SET NOT NULL;

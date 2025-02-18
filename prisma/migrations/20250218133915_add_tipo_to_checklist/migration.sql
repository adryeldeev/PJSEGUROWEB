/*
  Warnings:

  - Added the required column `tipo` to the `Checklist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `checklist` ADD COLUMN `tipo` VARCHAR(191) NOT NULL;

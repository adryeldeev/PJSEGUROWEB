/*
  Warnings:

  - You are about to drop the column `status` on the `processo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `faseprocesso` MODIFY `cor_fundo` VARCHAR(191) NULL,
    MODIFY `cor_fonte` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `processo` DROP COLUMN `status`;

/*
  Warnings:

  - Added the required column `prioridadeId` to the `Processo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `processo` ADD COLUMN `prioridadeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_prioridadeId_fkey` FOREIGN KEY (`prioridadeId`) REFERENCES `Prioridades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

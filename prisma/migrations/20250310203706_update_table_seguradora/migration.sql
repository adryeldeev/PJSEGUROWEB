/*
  Warnings:

  - A unique constraint covering the columns `[seguradoraId]` on the table `Processo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `processo` ADD COLUMN `seguradoraId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Processo_seguradoraId_key` ON `Processo`(`seguradoraId`);

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_seguradoraId_fkey` FOREIGN KEY (`seguradoraId`) REFERENCES `Seguradora`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

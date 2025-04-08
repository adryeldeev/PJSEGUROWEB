-- AlterTable
ALTER TABLE `processo` ADD COLUMN `seguradoraId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_seguradoraId_fkey` FOREIGN KEY (`seguradoraId`) REFERENCES `Seguradora`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

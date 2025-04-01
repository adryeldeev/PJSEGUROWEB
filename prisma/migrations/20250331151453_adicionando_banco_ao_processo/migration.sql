-- AlterTable
ALTER TABLE `processo` ADD COLUMN `bancoId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_bancoId_fkey` FOREIGN KEY (`bancoId`) REFERENCES `Banco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

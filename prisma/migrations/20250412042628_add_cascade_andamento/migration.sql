-- DropForeignKey
ALTER TABLE `Andamento` DROP FOREIGN KEY `Andamento_processoId_fkey`;

-- DropForeignKey
ALTER TABLE `Checklist` DROP FOREIGN KEY `Checklist_processoId_fkey`;

-- DropForeignKey
ALTER TABLE `Sinistro` DROP FOREIGN KEY `Sinistro_processoId_fkey`;

-- AddForeignKey
ALTER TABLE `Checklist` ADD CONSTRAINT `Checklist_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `Processo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Andamento` ADD CONSTRAINT `Andamento_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `Processo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sinistro` ADD CONSTRAINT `Sinistro_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `Processo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

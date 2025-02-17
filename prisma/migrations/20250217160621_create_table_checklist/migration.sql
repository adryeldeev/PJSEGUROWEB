/*
  Warnings:

  - You are about to drop the column `clienteId` on the `documento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `documento` DROP COLUMN `clienteId`;

-- CreateTable
CREATE TABLE `Checklist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,
    `arquivoUrl` VARCHAR(191) NOT NULL,
    `obrigatorio` BOOLEAN NOT NULL,
    `entregue` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `processoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Checklist` ADD CONSTRAINT `Checklist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Checklist` ADD CONSTRAINT `Checklist_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `Processo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

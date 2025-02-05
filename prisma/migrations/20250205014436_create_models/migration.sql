/*
  Warnings:

  - You are about to drop the column `numero` on the `processo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Processo_numero_key` ON `processo`;

-- AlterTable
ALTER TABLE `banco` MODIFY `nome` VARCHAR(191) NULL,
    MODIFY `agencia` VARCHAR(191) NULL,
    MODIFY `conta` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `parceiro` MODIFY `nome` VARCHAR(191) NULL,
    MODIFY `uf` VARCHAR(191) NULL,
    MODIFY `cidade` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `processo` DROP COLUMN `numero`;

-- AlterTable
ALTER TABLE `seguradora` MODIFY `nome` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tipodeveiculo` MODIFY `placa` VARCHAR(191) NULL,
    MODIFY `marca` VARCHAR(191) NULL,
    MODIFY `modelo` VARCHAR(191) NULL,
    MODIFY `nome` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Andamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `observacoes` VARCHAR(191) NULL,
    `faseId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `processoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sinistro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NULL,
    `dataSinistro` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataAbertura` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `processoId` INTEGER NOT NULL,

    UNIQUE INDEX `Sinistro_numero_key`(`numero`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Delegacia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `delegacia` VARCHAR(191) NULL,
    `uf` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `dataBo` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `numeroBo` VARCHAR(191) NULL,
    `sinistroId` INTEGER NULL,
    `vitimaId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Andamento` ADD CONSTRAINT `Andamento_faseId_fkey` FOREIGN KEY (`faseId`) REFERENCES `FaseProcesso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Andamento` ADD CONSTRAINT `Andamento_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Andamento` ADD CONSTRAINT `Andamento_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `Processo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sinistro` ADD CONSTRAINT `Sinistro_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sinistro` ADD CONSTRAINT `Sinistro_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `Processo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delegacia` ADD CONSTRAINT `Delegacia_sinistroId_fkey` FOREIGN KEY (`sinistroId`) REFERENCES `Sinistro`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delegacia` ADD CONSTRAINT `Delegacia_vitimaId_fkey` FOREIGN KEY (`vitimaId`) REFERENCES `Vitima`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delegacia` ADD CONSTRAINT `Delegacia_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

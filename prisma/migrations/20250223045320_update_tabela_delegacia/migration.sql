/*
  Warnings:

  - You are about to drop the column `processoId` on the `delegacia` table. All the data in the column will be lost.
  - You are about to drop the column `sinistroId` on the `delegacia` table. All the data in the column will be lost.
  - You are about to drop the column `processoId` on the `tipodeveiculo` table. All the data in the column will be lost.
  - You are about to drop the column `sinistroId` on the `tipodeveiculo` table. All the data in the column will be lost.
  - Added the required column `tipoDeVeiculoId` to the `Processo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoDeVeiculoId` to the `Sinistro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `delegacia` DROP FOREIGN KEY `Delegacia_processoId_fkey`;

-- DropForeignKey
ALTER TABLE `delegacia` DROP FOREIGN KEY `Delegacia_sinistroId_fkey`;

-- DropForeignKey
ALTER TABLE `tipodeveiculo` DROP FOREIGN KEY `TipoDeVeiculo_processoId_fkey`;

-- DropForeignKey
ALTER TABLE `tipodeveiculo` DROP FOREIGN KEY `TipoDeVeiculo_sinistroId_fkey`;

-- AlterTable
ALTER TABLE `delegacia` DROP COLUMN `processoId`,
    DROP COLUMN `sinistroId`;

-- AlterTable
ALTER TABLE `processo` ADD COLUMN `tipoDeVeiculoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `sinistro` ADD COLUMN `tipoDeVeiculoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tipodeveiculo` DROP COLUMN `processoId`,
    DROP COLUMN `sinistroId`;

-- AddForeignKey
ALTER TABLE `Sinistro` ADD CONSTRAINT `Sinistro_tipoDeVeiculoId_fkey` FOREIGN KEY (`tipoDeVeiculoId`) REFERENCES `TipoDeVeiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_tipoDeVeiculoId_fkey` FOREIGN KEY (`tipoDeVeiculoId`) REFERENCES `TipoDeVeiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

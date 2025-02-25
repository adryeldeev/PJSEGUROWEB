-- DropForeignKey
ALTER TABLE `sinistro` DROP FOREIGN KEY `Sinistro_tipoDeVeiculoId_fkey`;

-- AlterTable
ALTER TABLE `sinistro` ADD COLUMN `delegaciaId` INTEGER NULL,
    MODIFY `tipoDeVeiculoId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Sinistro` ADD CONSTRAINT `Sinistro_tipoDeVeiculoId_fkey` FOREIGN KEY (`tipoDeVeiculoId`) REFERENCES `TipoDeVeiculo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sinistro` ADD CONSTRAINT `Sinistro_delegaciaId_fkey` FOREIGN KEY (`delegaciaId`) REFERENCES `Delegacia`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

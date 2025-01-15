/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Vitima` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rg]` on the table `Vitima` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `documento` DROP FOREIGN KEY `Documento_clienteId_fkey`;

-- AlterTable
ALTER TABLE `documento` MODIFY `clienteId` INTEGER NULL;

-- AlterTable
ALTER TABLE `vitima` MODIFY `cpf` VARCHAR(191) NOT NULL,
    MODIFY `rg` VARCHAR(191) NOT NULL,
    MODIFY `complemento` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `telefone02` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Vitima_cpf_key` ON `Vitima`(`cpf`);

-- CreateIndex
CREATE UNIQUE INDEX `Vitima_rg_key` ON `Vitima`(`rg`);

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

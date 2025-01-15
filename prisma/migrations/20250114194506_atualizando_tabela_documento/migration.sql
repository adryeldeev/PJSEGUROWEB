/*
  Warnings:

  - You are about to drop the column `criadoEm` on the `documento` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `documento` table. All the data in the column will be lost.
  - Made the column `descricao` on table `documento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clienteId` on table `documento` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `documento` DROP FOREIGN KEY `Documento_clienteId_fkey`;

-- AlterTable
ALTER TABLE `documento` DROP COLUMN `criadoEm`,
    DROP COLUMN `metadata`,
    MODIFY `descricao` VARCHAR(191) NOT NULL,
    MODIFY `clienteId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

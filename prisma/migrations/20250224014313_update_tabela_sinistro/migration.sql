/*
  Warnings:

  - You are about to drop the column `tipoDeVeiculoId` on the `processo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `processo` DROP FOREIGN KEY `Processo_tipoDeVeiculoId_fkey`;

-- AlterTable
ALTER TABLE `processo` DROP COLUMN `tipoDeVeiculoId`;

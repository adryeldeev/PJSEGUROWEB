/*
  Warnings:

  - You are about to drop the column `nome` on the `tipodeveiculo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tipoDeVeiculoId]` on the table `Sinistro` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tipodeveiculo` DROP COLUMN `nome`,
    ADD COLUMN `ano` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Sinistro_tipoDeVeiculoId_key` ON `Sinistro`(`tipoDeVeiculoId`);

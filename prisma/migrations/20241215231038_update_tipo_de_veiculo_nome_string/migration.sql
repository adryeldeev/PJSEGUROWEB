/*
  Warnings:

  - You are about to drop the column `rcf` on the `tipodeveiculo` table. All the data in the column will be lost.
  - Added the required column `nome` to the `TipoDeVeiculo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tipodeveiculo` DROP COLUMN `rcf`,
    ADD COLUMN `nome` VARCHAR(191) NOT NULL;

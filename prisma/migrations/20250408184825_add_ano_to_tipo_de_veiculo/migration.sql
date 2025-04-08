/*
  Warnings:

  - You are about to drop the column `nome` on the `tipodeveiculo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tipodeveiculo` DROP COLUMN `nome`,
    ADD COLUMN `ano` INTEGER NULL;

/*
  Warnings:

  - A unique constraint covering the columns `[placa]` on the table `TipoDeVeiculo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TipoDeVeiculo_placa_key` ON `TipoDeVeiculo`(`placa`);

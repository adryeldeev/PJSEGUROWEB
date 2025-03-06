/*
  Warnings:

  - A unique constraint covering the columns `[faseProcessoId,processoId]` on the table `Andamento` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Andamento_faseProcessoId_processoId_key` ON `Andamento`(`faseProcessoId`, `processoId`);

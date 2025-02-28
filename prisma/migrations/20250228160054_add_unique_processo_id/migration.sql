/*
  Warnings:

  - A unique constraint covering the columns `[processoId]` on the table `Sinistro` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Sinistro_processoId_key` ON `Sinistro`(`processoId`);

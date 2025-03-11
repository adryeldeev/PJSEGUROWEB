/*
  Warnings:

  - A unique constraint covering the columns `[delegaciaId]` on the table `Sinistro` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Sinistro_delegaciaId_key` ON `Sinistro`(`delegaciaId`);

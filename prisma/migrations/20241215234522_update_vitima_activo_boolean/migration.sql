/*
  Warnings:

  - Added the required column `activo` to the `Vitima` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vitima` ADD COLUMN `activo` BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE `Documentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cpf` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(191) NOT NULL,
    `laudo_precia` VARCHAR(191) NOT NULL,
    `muda_documento` BOOLEAN NOT NULL,
    `activo` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

/*
  Warnings:

  - You are about to drop the `prioridade` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `prioridade` DROP FOREIGN KEY `Prioridade_userId_fkey`;

-- AlterTable
ALTER TABLE `cliente` MODIFY `cpf` VARCHAR(191) NOT NULL,
    MODIFY `rg` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `prioridade`;

-- CreateIndex
CREATE UNIQUE INDEX `Cliente_cpf_key` ON `Cliente`(`cpf`);

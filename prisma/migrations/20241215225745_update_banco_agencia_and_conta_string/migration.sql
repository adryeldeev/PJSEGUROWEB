/*
  Warnings:

  - A unique constraint covering the columns `[conta]` on the table `Banco` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `banco` MODIFY `agencia` VARCHAR(191) NOT NULL,
    MODIFY `conta` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Banco_conta_key` ON `Banco`(`conta`);

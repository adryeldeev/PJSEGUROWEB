/*
  Warnings:

  - You are about to drop the `parceiro` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `parceiro` DROP FOREIGN KEY `Parceiro_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `profileIamge` VARCHAR(255) NULL;

-- DropTable
DROP TABLE `parceiro`;

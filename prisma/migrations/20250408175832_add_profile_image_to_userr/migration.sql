/*
  Warnings:

  - You are about to drop the column `profileIamge` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `profileIamge`,
    ADD COLUMN `profileImage` VARCHAR(255) NULL;

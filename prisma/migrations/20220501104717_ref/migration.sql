/*
  Warnings:

  - Added the required column `ref` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_code` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `ref` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `recipient_code` VARCHAR(191) NOT NULL;

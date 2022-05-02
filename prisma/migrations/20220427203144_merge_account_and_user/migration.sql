/*
  Warnings:

  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[accountNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_userId_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `accountName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `accountNumber` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `balance` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `accounts`;

-- CreateIndex
CREATE UNIQUE INDEX `users_accountNumber_key` ON `users`(`accountNumber`);

/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `confirmed` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `accountNumber` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `users_accountNumber_key` ON `users`(`accountNumber`);

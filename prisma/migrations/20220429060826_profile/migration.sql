/*
  Warnings:

  - Added the required column `pin` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `pin` INTEGER NOT NULL,
    ADD COLUMN `profile` VARCHAR(191) NOT NULL;

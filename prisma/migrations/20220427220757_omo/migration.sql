-- DropIndex
DROP INDEX `users_accountNumber_key` ON `users`;

-- AlterTable
ALTER TABLE `users` ALTER COLUMN `accountNumber` DROP DEFAULT;

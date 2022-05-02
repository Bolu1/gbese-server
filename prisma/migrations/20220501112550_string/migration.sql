-- AlterTable
ALTER TABLE `transaction` MODIFY `debitorAccount` VARCHAR(191) NOT NULL,
    MODIFY `creditorAccount` VARCHAR(191) NOT NULL;

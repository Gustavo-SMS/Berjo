/*
  Warnings:

  - A unique constraint covering the columns `[docNumber]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `state` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docNumber` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `complement` VARCHAR(191) NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL,
    MODIFY `house_number` INTEGER NULL;

-- AlterTable
ALTER TABLE `customers` ADD COLUMN `docNumber` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `customers_docNumber_key` ON `customers`(`docNumber`);

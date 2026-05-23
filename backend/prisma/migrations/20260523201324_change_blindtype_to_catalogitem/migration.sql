/*
  Warnings:

  - You are about to drop the column `type_id` on the `blind` table. All the data in the column will be lost.
  - You are about to drop the `blind_type` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `catalogItem_id` to the `Blind` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `blind` DROP FOREIGN KEY `Blind_type_id_fkey`;

-- DropIndex
DROP INDEX `Blind_type_id_fkey` ON `blind`;

-- AlterTable
ALTER TABLE `blind` DROP COLUMN `type_id`,
    ADD COLUMN `catalogItem_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `blind_type`;

-- CreateTable
CREATE TABLE `CatalogItem` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `collection` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `max_width` DOUBLE NULL,
    `price` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Blind` ADD CONSTRAINT `Blind_catalogItem_id_fkey` FOREIGN KEY (`catalogItem_id`) REFERENCES `CatalogItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

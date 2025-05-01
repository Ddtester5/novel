/*
  Warnings:

  - You are about to drop the column `genre_id` on the `novells` table. All the data in the column will be lost.
  - You are about to drop the `genres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "novells" DROP CONSTRAINT "novells_genre_id_fkey";

-- AlterTable
ALTER TABLE "novells" DROP COLUMN "genre_id";

-- DropTable
DROP TABLE "genres";

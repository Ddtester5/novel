/*
  Warnings:

  - Added the required column `url_to_all_chapters` to the `novells` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "novells" ADD COLUMN     "url_to_all_chapters" TEXT NOT NULL;

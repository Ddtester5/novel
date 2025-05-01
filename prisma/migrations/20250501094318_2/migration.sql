/*
  Warnings:

  - Added the required column `last_chapter` to the `novells` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "novells" ADD COLUMN     "last_chapter" TEXT NOT NULL;

/*
  Warnings:

  - Changed the type of `chapter_number` on the `chapters` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "chapters" DROP COLUMN "chapter_number",
ADD COLUMN     "chapter_number" INTEGER NOT NULL;

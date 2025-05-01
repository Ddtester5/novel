/*
  Warnings:

  - You are about to drop the `novells_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "novells_tags" DROP CONSTRAINT "novells_tags_novell_id_fkey";

-- DropForeignKey
ALTER TABLE "novells_tags" DROP CONSTRAINT "novells_tags_tag_id_fkey";

-- DropTable
DROP TABLE "novells_tags";

-- CreateTable
CREATE TABLE "_NovellsToTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NovellsToTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_NovellsToTags_B_index" ON "_NovellsToTags"("B");

-- AddForeignKey
ALTER TABLE "_NovellsToTags" ADD CONSTRAINT "_NovellsToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "novells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NovellsToTags" ADD CONSTRAINT "_NovellsToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

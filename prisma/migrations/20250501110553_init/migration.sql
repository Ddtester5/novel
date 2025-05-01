-- CreateTable
CREATE TABLE "novells" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "original_title" TEXT NOT NULL,
    "original_description" TEXT NOT NULL,
    "original_author" TEXT NOT NULL,
    "last_chapter" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,
    "ru_title" TEXT NOT NULL,
    "ru_description" TEXT NOT NULL,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "genre_id" TEXT,

    CONSTRAINT "novells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "original_title" TEXT NOT NULL,
    "ru_title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "original_title" TEXT NOT NULL,
    "ru_title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "original_title" TEXT,
    "chapter_number" INTEGER NOT NULL,
    "original_content" TEXT NOT NULL,
    "novell_id" TEXT NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NovellsToTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NovellsToTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "novells_original_title_key" ON "novells"("original_title");

-- CreateIndex
CREATE UNIQUE INDEX "novells_slug_key" ON "novells"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "novells_ru_title_key" ON "novells"("ru_title");

-- CreateIndex
CREATE UNIQUE INDEX "genres_original_title_key" ON "genres"("original_title");

-- CreateIndex
CREATE UNIQUE INDEX "genres_ru_title_key" ON "genres"("ru_title");

-- CreateIndex
CREATE UNIQUE INDEX "genres_slug_key" ON "genres"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_original_title_key" ON "tags"("original_title");

-- CreateIndex
CREATE UNIQUE INDEX "tags_ru_title_key" ON "tags"("ru_title");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "_NovellsToTags_B_index" ON "_NovellsToTags"("B");

-- AddForeignKey
ALTER TABLE "novells" ADD CONSTRAINT "novells_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_novell_id_fkey" FOREIGN KEY ("novell_id") REFERENCES "novells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NovellsToTags" ADD CONSTRAINT "_NovellsToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "novells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NovellsToTags" ADD CONSTRAINT "_NovellsToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

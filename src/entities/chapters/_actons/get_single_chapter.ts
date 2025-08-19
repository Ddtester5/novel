"use server";

import { dataBase } from "@/shared/lib/db_connect";

export const getSingleChapter = async (slug: string, number: number) => {
  try {
    return await dataBase.chapters.findUnique({
      where: { novell_slug_chapter_number: { novell_slug: slug, chapter_number: number } },
    });
  } catch (error) {
    console.error("Error fetching chapter:", error);
  }
};

export type getSingleChapterType = Awaited<ReturnType<typeof getSingleChapter>>;

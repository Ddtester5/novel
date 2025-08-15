"use server";

import { dataBase } from "@/shared/lib/db_connect";

export const getSingleNovellBySlug = async (slug: string) => {
  try {
    return await dataBase.novells.findUnique({
      where: { slug: slug },
      include: {
        genre: true,
        tags: { select: { ru_title: true, slug: true, id: true } },
        chapters: { select: { chapter_number: true, id: true, title: true, created_at: true } },
      },
    });
  } catch (error) {
    console.error("Error fetching news by slug:", error);
  }
};

export type getSinglePostBySlugType = Awaited<ReturnType<typeof getSingleNovellBySlug>>;

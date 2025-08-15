"use server";

import { dataBase } from "@/shared/lib/db_connect";

export const getSinglePostBySlug = async (slug: string, type: "NEWS" | "REVIEWS") => {
  try {
    return await dataBase.posts.findUnique({
      where: { slug: slug, type: type },
      include: {
        tags: true,
      },
    });
  } catch (error) {
    console.error("Error fetching news by slug:", error);
  }
};

export type getSinglePostBySlugType = Awaited<ReturnType<typeof getSinglePostBySlug>>;

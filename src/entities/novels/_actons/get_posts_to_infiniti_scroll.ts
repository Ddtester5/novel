"use server";

import { dataBase } from "@/shared/lib/db_connect";
import { PostTypes } from "../../../../generated/prisma";

export async function getPostsToInfinitiScroll(
  type: PostTypes,
  pageParam: number,
  perPage: number,
  searchTerm?: string,
  tagSlug?: string,
  newsIds?: string[],
) {
  try {
    const news = await dataBase.posts.findMany({
      where: {
        type: type,
        id: newsIds ? { in: newsIds } : undefined,
        title: { contains: searchTerm, mode: "insensitive" },
        tags: tagSlug ? { some: { slug: tagSlug } } : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        type: true,
        meta_description: true,
        slug: true,
        title: true,
        preview_image: true,
        views: true,
        tags: { select: { slug: true, title: true } },
      },
      skip: (pageParam - 1) * perPage,
      take: perPage,
    });

    return news;
  } catch (error) {
    console.error("Ошибка при получении новостей:", error);
    return [];
  }
}
export type getPostsToInfinitiScrollType = Awaited<ReturnType<typeof getPostsToInfinitiScroll>>;

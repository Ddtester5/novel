"use server";

import { dataBase } from "@/shared/lib/db_connect";

export const getAllTagsToInfinitiScroll = async (
  pageParam: number,
  perPage: number,
  searchTerm?: string,
) => {
  try {
    const tags = await dataBase.tag.findMany({
      where: {
        title: { contains: searchTerm, mode: "insensitive" },
      },
      orderBy: {
        title: "asc",
      },
      include: {
        _count: { select: { posts: true } },
      },
      skip: (pageParam - 1) * perPage,
      take: perPage,
    });

    return tags;
  } catch (error) {
    console.error("Ошибка при получении tags:", error);
    return [];
  }
};
export type getAllTagsToInfinitiScrollType = Awaited<ReturnType<typeof getAllTagsToInfinitiScroll>>;

"use server";

import { dataBase } from "@/shared/lib/db_connect";

export async function getPopularTags(count: number) {
  try {
    const tag = dataBase.tag.findMany({
      take: count,
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
    });
    return tag;
  } catch (error) {
    console.log("Не удалось получить популярные тэги", error);
  }
}

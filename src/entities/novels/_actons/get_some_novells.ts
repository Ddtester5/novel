"use server";

import { dataBase } from "@/shared/lib/db_connect";

export async function getSomeNovells({ count }: { count: number }) {
  try {
    const novells = await dataBase.novells.findMany({
      take: count,
      orderBy: {
        created_at: "desc",
      },
      include: { _count: { select: { chapters: true } } },
    });

    return novells;
  } catch (error) {
    console.error("Error fetching some posts:", error);
  }
}

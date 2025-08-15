import { dataBase } from "@/shared/lib/db_connect";

export async function getTagBYSlug(slug: string) {
  try {
    const tag = dataBase.tag.findUnique({
      where: {
        slug: slug,
      },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
    return tag;
  } catch (error) {
    console.log("Не удалось получить тэг", error);
  }
}
export type getTagBYSlugType = Awaited<ReturnType<typeof getTagBYSlug>>;

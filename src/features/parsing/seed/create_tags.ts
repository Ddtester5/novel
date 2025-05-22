import { dataBase } from "@/shared/lib/db_connect";
import { transliterateToUrl } from "@/shared/lib/transliterate";

export async function createTags(tags: string[]) {
  try {
    for (let i = 0; i < tags.length; i++) {
      await dataBase.tags.upsert({
        where: {
          ru_title: tags[i],
        },
        update: {},
        create: {
          ru_title: tags[i],
          slug: transliterateToUrl(tags[i]),
        },
      });
    }
  } catch (error) {
    console.error("create tags error", error);
  }
}

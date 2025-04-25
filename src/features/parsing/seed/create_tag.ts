import { dataBase } from "@/shared/lib/db_connect";
import { transliterateToUrl } from "@/shared/lib/transliterate";

export async function createTag(
  original_title: string,
  ru_title: string,
) {
  try {
    const slug = transliterateToUrl(ru_title);
    const new_tag = await dataBase.tags.create({
      data: {
        slug: slug,
        ru_title: ru_title,
        original_title: original_title,
      },
    });
    return new_tag;
  } catch (error) {
    console.error("create tag error", error);
  }
}

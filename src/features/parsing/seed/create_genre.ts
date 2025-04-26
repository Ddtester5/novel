import { dataBase } from "@/shared/lib/db_connect";
import { transliterateToUrl } from "@/shared/lib/transliterate";

export async function createGenre(
  original_title: string,
  ru_title: string,
) {
  try {
    const slug = transliterateToUrl(ru_title);
    const new_genre = await dataBase.genres.create({
      data: {
        slug: slug,
        ru_title: ru_title,
        original_title: original_title,
      },
    });
    return new_genre;
  } catch (error) {
    console.error("create genre error", error);
  }
}

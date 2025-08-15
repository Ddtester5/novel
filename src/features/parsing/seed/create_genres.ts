import { dataBase } from "@/shared/lib/db_connect";
import { safeTranslate } from "@/shared/lib/openai/translate/safe_translate";
import { translateText } from "@/shared/lib/openai/translate/translate_text";
import { createGenre } from "./create_genre";
import { cleaneText } from "@/shared/lib/openai/translate/cleane_text";

export async function createGenres(genres: string[]) {
  try {
    const existing_genres = await dataBase.genres.findMany({
      where: {
        original_title: {
          in: genres,
        },
      },
      select: {
        original_title: true,
      },
    });
    const existing_titles = existing_genres.map((e) => {
      return e.original_title;
    });
    const new_genres = genres.filter((e) => {
      return !existing_titles.includes(e);
    });
    if (new_genres.length > 0) {
      const ru_titles = await safeTranslate(
        new_genres.join(","),
        translateText,
        "жанры онлайн новеллы в том же порядке",
        1,
      );
      const parsed_ru_titles = cleaneText(ru_titles)
        .toLowerCase()
        .replace(/\./g, "")
        .replace(/,\s*/g, ",")
        .trim()
        .split(",");
      for (let i = 0; i < new_genres.length; i++) {
        const new_genre = await createGenre(new_genres[i], parsed_ru_titles[i]);
        console.log("created genre", new_genre?.original_title, new_genre?.ru_title);
      }
    }
  } catch (error) {
    console.error("create genres error", error);
  }
}

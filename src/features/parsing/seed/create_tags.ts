import { dataBase } from "@/shared/lib/db_connect";
import { safeTranslate } from "@/shared/lib/openai/translate/safe_translate";
import { translateText } from "@/shared/lib/openai/translate/translate_text";
import { createTag } from "./create_tag";
import { cleaneText } from "@/shared/lib/openai/translate/cleane_text";
import { cleanHiddenCharacters } from "@/shared/lib/openai/translate/cleane_text_by_hidden_char";

export async function createTags(tags: string[]) {
  try {
    const all_tags = await dataBase.tags.findMany(); // Получаем все теги
    const existing_tags = await dataBase.tags.findMany({
      where: {
        original_title: {
          in: tags,
        },
      },
      select: {
        original_title: true,
      },
    });

    const existing_titles = existing_tags.map(
      (e) => e.original_title,
    );
    const new_tags = tags.filter(
      (e) => !existing_titles.includes(e),
    );

    if (new_tags.length > 0) {
      let parsed_ru_titles: string[] = [];
      let attempts = 0;
      let success = false;

      const existing_ru_titles = new Set(
        all_tags.map((t) => t.ru_title),
      );

      while (attempts < 50 && !success) {
        const ru_titles_raw = await safeTranslate(
          new_tags.join(","),
          translateText,
          "тэги онлайн новеллы в том же количестве и порядке, без повторов",
          1,
        );

        parsed_ru_titles = ru_titles_raw
          .toLowerCase()
          .replace(/\./g, "")
          .replace(/,\s*/g, ",")
          .trim()
          .split(",");

        const cleaned_ru_titles = parsed_ru_titles.map(
          (title) =>
            cleanHiddenCharacters(cleaneText(title)),
        );

        const unique_titles = new Set(cleaned_ru_titles);
        const has_duplicates_with_db =
          cleaned_ru_titles.some((title) =>
            existing_ru_titles.has(title),
          );

        if (
          cleaned_ru_titles.length === new_tags.length &&
          unique_titles.size === new_tags.length &&
          !has_duplicates_with_db
        ) {
          parsed_ru_titles = cleaned_ru_titles;
          success = true;
        } else {
          console.warn(
            `Перевод ${attempts} дал неправильный результат (parsed: ${cleaned_ru_titles.length}, unique: ${unique_titles.size}, has_duplicate_with_db: ${has_duplicates_with_db}). Перезапрашиваю...`,
          );
          attempts++;
        }
      }

      if (!success) {
        console.error(
          "Не удалось получить корректный перевод тегов после нескольких попыток.",
        );
        return;
      }

      for (let i = 0; i < new_tags.length; i++) {
        const new_tag = await createTag(
          new_tags[i],
          parsed_ru_titles[i],
        );
        console.log(
          "created tag",
          new_tag?.original_title,
          new_tag?.ru_title,
        );
      }
    }
  } catch (error) {
    console.error("create tags error", error);
  }
}

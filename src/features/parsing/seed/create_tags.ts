import { dataBase } from "@/shared/lib/db_connect";
import { safeTranslate } from "@/shared/lib/openai/translate/safe_translate";
import { translateText } from "@/shared/lib/openai/translate/translate_text";
import { createTag } from "./create_tag";
import { sleep } from "@/shared/lib/sleep";

export async function createTags(tags: string[]) {
  try {
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
    const existing_titles = existing_tags.map((e) => {
      return e.original_title;
    });
    const new_tags = tags.filter((e) => {
      return !existing_titles.includes(e);
    });
    if (new_tags.length > 0) {
      const ru_titles = await safeTranslate(
        new_tags.join(","),
        translateText,
        "тэги онлайн новеллы",
        1,
      );
      const parsed_ru_titles = ru_titles
        .toLowerCase()
        .replace(/\./g, "")
        .replace(/,\s*/g, ",")
        .trim()
        .split(",");
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
        await sleep(1000);
      }
    }
  } catch (error) {
    console.error("create tags error", error);
  }
}

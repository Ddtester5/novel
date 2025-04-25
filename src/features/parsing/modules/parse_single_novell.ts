import { safeTranslate } from "@/shared/lib/openai/translate/safe_translate";
import { translateText } from "@/shared/lib/openai/translate/translate_text";
import { Page } from "playwright";

export async function parseSingleNovell({
  page,
  pageToImages,
  novell_original_title,
  novell_url,
}: {
  page: Page;
  pageToImages: Page;
  novell_original_title: string;
  novell_url: string;
}) {
  await page.goto(novell_url);
  await page.waitForSelector(".bookbox", {
    state: "visible",
    timeout: 60000,
  });
  const novell = await page
    .locator("div.bookbox")
    .evaluateAll((e) => {
      return e.map((el) => {
        return {
          novell_image_url: `${el.querySelector("img")?.getAttribute("src")}`,
          novell_author: `${el
            .querySelectorAll("div.booknav2 > p")[0]
            .textContent?.replace(/^作者\s*[:：]\s*/i, "")
            .trim()}`,
          novell_genre: `${el
            .querySelectorAll("div.booknav2 > p")[1]
            .textContent?.replace(/^分类\s*[:：]\s*/i, "")
            .trim()}`,
        };
      });
    });
  const tags = await page
    .locator("ul.tagul > a")
    .evaluateAll((e) => {
      return e.map((el) => {
        return el.textContent?.trim().toLowerCase();
      });
    });
  const novell_title_ru = await safeTranslate(
    novell_original_title,
    translateText,
    "тайтл-название для новеллы",
  );
  //  const novell_author_ru = await safeTranslate(novell[0].novell_author,translateText,"имя автора новеллы")
  const novell_genre_ru = await safeTranslate(
    novell[0].novell_genre,
    translateText,
    "жанр новеллы",
  );
  const novell_tags_ru = await safeTranslate(
    tags.join(","),
    translateText,
    "тэги новеллы",
  );
  console.log({
    original_title: novell_original_title,
    original_genre: novell[0].novell_genre,
    original_tags: tags,
    ru_title: novell_title_ru.replace(/\./gi, ""),
    ru_genre: novell_genre_ru
      .toLowerCase()
      .replace(/\./gi, ""),
    original_author: novell[0].novell_author.trim(),
    ru_tags: novell_tags_ru
      .toLowerCase()
      .replace(/\./g, "")
      .replace(/,\s*/g, ",")
      .split(","),
    original_url: novell_url,
  });
}

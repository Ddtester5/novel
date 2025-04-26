import { downloadImageForS3 } from "@/shared/lib/download_image_for_S3";
import { safeTranslate } from "@/shared/lib/openai/translate/safe_translate";
import { translateChapter } from "@/shared/lib/openai/translate/translate_chapter";
import { translateText } from "@/shared/lib/openai/translate/translate_text";
import { transliterateToUrl } from "@/shared/lib/transliterate";
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
            .querySelectorAll("div.booknav2 > p > a")[0]
            .textContent?.trim()}`,
          novell_genre: `${el
            .querySelectorAll("div.booknav2 > p > a")[1]
            .textContent?.trim()}`,
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
  const novell_description = await page
    .locator("div.navtxt")
    .innerText();
  const last_chapter = await page
    .locator("div.qustime > ul > li >a > span")
    .nth(0)
    .textContent();
  const url_to_all_chapters = await page
    .locator("a.more-btn")
    .getAttribute("href");
  const img_url = (await page
    .locator("div.bookimg2 > img")
    .getAttribute("src")) as string;
  const novell_title_ru = await safeTranslate(
    novell_original_title,
    translateText,
    "тайтл-название для новеллы",
  );
  const novell_description_ru = await safeTranslate(
    novell_description.replace(/小说关键词[\s\S]*/, ""),
    translateChapter,
    "описание онлайн новеллы",
    0.1,
  );
  const slug = transliterateToUrl(novell_title_ru);

  const image_path = await downloadImageForS3(
    img_url,
    slug,
    "novell_image",
    {
      page: pageToImages,
      convert_to_png: false,
      remove_wattermark: true,
      proxy_tor: true,
      incriase: true,
      textDelete: true,
    },
  );
  console.log({
    original_title: novell_original_title,
    original_genre: novell[0].novell_genre,
    original_tags: tags,
    novell_description: novell_description.replace(
      /小说关键词[\s\S]*/,
      "",
    ),
    last_chapter,
    url_to_all_chapters,
    ru_title: novell_title_ru.replace(/\./gi, ""),
    ru_description: novell_description_ru,
    original_author: novell[0].novell_author.trim(),
    original_url: novell_url,
    slug,
    image_path,
  });
}

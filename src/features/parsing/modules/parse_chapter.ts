import { cleaneText } from "@/shared/lib/openai/translate/cleane_text";
import { cleanHiddenCharacters } from "@/shared/lib/openai/translate/cleane_text_by_hidden_char";
import { safeTranslate } from "@/shared/lib/openai/translate/safe_translate";
import { translateChapter } from "@/shared/lib/openai/translate/translate_chapter";
import { translateText } from "@/shared/lib/openai/translate/translate_text";
import { Page } from "playwright";

export async function parseChapter(
  page: Page,
  new_chapter: {
    number: string;
    title: string;
    url: string;
  },
  novell_id: string,
) {
  try {
    await page.goto(new_chapter.url);
    await page.waitForSelector("div.txtnav", {
      state: "visible",
      timeout: 60000,
    });
    const content =
      (await page.locator("div.txtnav ").textContent()) ||
      "";
    const text_info =
      (await page.locator("div.txtinfo").textContent()) ||
      "";
    const cleaned_content = content
      .replace(new RegExp(`${new_chapter.title}`, "gi"), "")
      .replace(new RegExp(`${text_info}`, "gi"), "");

    const translated_content = await safeTranslate(
      cleaned_content,
      translateChapter,
      "глава онлайн новеллы",
      0.1,
    );
    const translated_title = await safeTranslate(
      new_chapter.title.replace(/\([^)]*\)/g, ""),
      translateText,
      "тайтл главы онлайн новеллы",
      0.1,
    );
    console.log({
      translated_content: cleanHiddenCharacters(
        cleaneText(translated_content),
      ),
      title: cleanHiddenCharacters(
        cleaneText(translated_title),
      ),
      number: new_chapter.number,
    });
  } catch (error) {
    console.error("parse chapter error", error);
  }
}

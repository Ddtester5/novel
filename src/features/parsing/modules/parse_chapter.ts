import { cleaneText } from "@/shared/lib/openai/translate/cleane_text";
import { cleanHiddenCharacters } from "@/shared/lib/openai/translate/cleane_text_by_hidden_char";
import { Page } from "playwright";
import { createChapter } from "../seed/create_chapter";

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
      state: "attached",
      timeout: 60000,
    });
    await page.waitForTimeout(5000);
    const content =
      (await page.locator("div.txtnav ").textContent()) ||
      "";

    await createChapter({
      content: cleanHiddenCharacters(cleaneText(content)),
      title: new_chapter.title,
      number: new_chapter.number,
      novell_id: novell_id,
    });
  } catch (error) {
    console.error("parse chapters error", error);
  }
}

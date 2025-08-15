import { cleaneText } from "@/shared/lib/openai/translate/cleane_text";
import { cleanHiddenCharacters } from "@/shared/lib/openai/translate/cleane_text_by_hidden_char";
import { Page } from "playwright";
import { createChapter } from "../seed/create_chapter";
import { sleep } from "@/shared/lib/sleep";

export async function parseChapter(
  page: Page,
  new_chapter: {
    number: string;
    // title: string;
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
    await sleep(5000);
    const title = (await page.locator("div.txtnav > font ").nth(0).textContent())?.trim() || "";
    const content = (await page.locator("div.txtnav ").textContent()) || "";
    console.log(title);
    await createChapter({
      content: cleanHiddenCharacters(cleaneText(content)),
      title: title,
      number: new_chapter.number,
      novell_id: novell_id,
    });
  } catch (error) {
    console.error("parse chapters error", error);
  }
}

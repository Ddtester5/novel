import { dataBase } from "@/shared/lib/db_connect";
import { Page } from "playwright";
import { parseChapter } from "./parse_chapter";

export async function parseAllChapters(page: Page, url_to_all_chapters: string, novell_id: string) {
  try {
    await page.goto(url_to_all_chapters);

    await page.waitForSelector("div.catalog", {
      state: "visible",
      timeout: 60000,
    });
    const chapters = await page.locator("div.catalog > ul > li").evaluateAll((e) => {
      return e.map((el) => {
        return {
          number: `${el.getAttribute("data-num")}`,
          // title: `${el.textContent?.trim()}`,
          url: `${el.querySelector("a")?.getAttribute("href")}`,
        };
      });
    });

    const existing_chapters = await dataBase.chapters.findMany({
      where: {
        novell_id: novell_id,
      },
    });
    const existing_nums = existing_chapters.map((e) => e.chapter_number);
    const new_chapters = chapters.filter((e) => !existing_nums.includes(e.number));
    for (const new_chapter of new_chapters) {
      if (new_chapter.url === "#") {
        continue;
      }
      await page.waitForTimeout(5000);
      await parseChapter(page, new_chapter, novell_id);
    }
  } catch (error) {
    console.error("parse all chapters error", error);
  }
}

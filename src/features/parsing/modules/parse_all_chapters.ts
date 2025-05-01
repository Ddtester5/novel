import { dataBase } from "@/shared/lib/db_connect";
import { Page } from "playwright";

export async function parseAllChapters(
  page: Page,
  url_to_all_chapters: string,
  novell_id: string,
) {
  try {
    await page.goto(url_to_all_chapters);
    await page.waitForSelector("div.catalog", {
      state: "visible",
      timeout: 60000,
    });
    const chapters = await page
      .locator("div.catalog > ul > li")
      .evaluateAll((e) => {
        return e.map((el) => {
          return {
            number: `${el.getAttribute("data-num")}`,
            title: `${el.textContent?.trim()}`,
            url: `${el.querySelector("a")?.getAttribute("href")}`,
          };
        });
      });
    console.log(chapters);
    const existing_chupters =
      await dataBase.chapters.findMany({
        where: {
          novell_id: novell_id,
        },
      });
    console.log(existing_chupters);
  } catch (error) {
    console.error("parse all chapters error", error);
  }
}

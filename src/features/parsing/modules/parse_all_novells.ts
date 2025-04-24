import { Page } from "playwright";
import { parseSingleNovell } from "./parse_single_novell";

export async function parseAllNovels(page: Page, pageToImages: Page) {
  try {
    await page.goto("https://www.69shuba.com/all.html");
    await page.waitForSelector("ul.row", { state: "visible", timeout: 60000 });
    const novels = await page.locator("a").evaluateAll((e) => {
      return e.map((el) => {
        return {
          novell_original_title: `${el.textContent?.trim()}`,
          novell_url: `https://www.69shuba.com${el.getAttribute("href")}`,
        };
      });
    });
    console.log(novels);
    for (let i = 22; i < novels.length; i++) {
      await parseSingleNovell({ page, pageToImages, ...novels[i] });
    }
  } catch (error) {
    console.error("error parse all novels", error);
  }
}

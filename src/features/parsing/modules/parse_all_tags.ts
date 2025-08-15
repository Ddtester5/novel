import { Page } from "playwright";
import { createTags } from "../seed/create_tags";

export async function parseAllTags(page: Page) {
  try {
    await page.goto("https://www.69shuba.com/tags");
    await page.waitForSelector("div.mybox", {
      state: "visible",
      timeout: 60000,
    });
    const original_tags = await page.locator("div.mybox > div.tag > ul > a").evaluateAll((e) => {
      return e.map((el) => {
        return `${el.textContent?.trim()}`;
      });
    });

    if (original_tags.length > 0) {
      await createTags(original_tags);
    }
  } catch (error) {
    console.error("parse all tags error", error);
  }
}

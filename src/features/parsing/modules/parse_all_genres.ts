import { Page } from "playwright";
import { createGenres } from "../seed/create_genres";

export async function parseAllGenres(page: Page) {
  try {
    await page.goto(
      "https://www.69shuba.com/novels/class/0.htm",
    );
    await page.waitForSelector("ul.clearfix", {
      state: "visible",
      timeout: 60000,
    });
    const original_genres = await page
      .locator(" ul.clearfix > li > a")
      .evaluateAll((e) => {
        return e.map((el) => {
          return `${el.textContent?.trim()}`;
        });
      });
    if (original_genres.length > 0) {
      await createGenres(original_genres.slice(1));
    }
  } catch (error) {
    console.error("parse all genres error", error);
  }
}

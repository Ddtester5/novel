import { Page } from "playwright";
import { parseSingleNovell } from "./parse_single_novell";
import { createNovell } from "../seed/create_novell";
import { getLastChapter } from "./get_last_chapter";
import { parseAllChapters } from "./parse_all_chapters";

export async function parseAllNovels(
  page: Page,
  pageToImages: Page,
) {
  try {
    await page.goto("https://www.69shuba.com/all.html");
    await page.waitForSelector("ul.row", {
      state: "visible",
      timeout: 60000,
    });
    const novels = await page
      .locator("a")
      .evaluateAll((e) => {
        return e.map((el) => {
          return {
            novell_original_title: `${el.textContent?.trim()}`,
            novell_url: `https://www.69shuba.com${el.getAttribute("href")}`,
          };
        });
      });
    for (let i = 22; i < novels.length; i++) {
      const novell = await createNovell({
        page,
        pageToImages,
        ...novels[i],
      });
      // const last_chapter = await getLastChapter(page, novels[i].novell_url)

      await parseAllChapters(
        page,
        novell?.url_to_all_chapters as string,
        novell?.id as string,
      );
    }
  } catch (error) {
    console.error("error parse all novels", error);
  }
}

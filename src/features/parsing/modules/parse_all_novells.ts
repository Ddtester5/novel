import { Page } from "playwright";
import { createNovell } from "../seed/create_novell";
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
      .locator("ul.row  a")
      .evaluateAll((e) => {
        return e.map((el) => {
          return {
            novell_original_title: `${el.textContent?.trim()}`,
            novell_url: `https://www.69shuba.com${el.getAttribute("href")}`,
          };
        });
      });
    for (let i = 0; i < novels.length; i++) {
      await page.waitForTimeout(5000);
      const novell = await createNovell({
        page,
        pageToImages,
        ...novels[i],
      });

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

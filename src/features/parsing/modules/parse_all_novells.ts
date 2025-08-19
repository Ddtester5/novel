import { Page } from "playwright";
import { createNovell } from "../seed/create_novell";
import { parseAllChapters } from "./parse_all_chapters";
import { sleep } from "@/shared/lib/sleep";

export async function parseAllNovels(page: Page, pageToImages: Page) {
  try {
    await page.goto(
      "https://www-69shuba-com.translate.goog/all.html?_x_tr_sl=zh-CN&_x_tr_tl=zh&_x_tr_hl=ru&_x_tr_pto=wapp",
    );
    await sleep(3000);
    await page.waitForSelector("ul.row", {
      state: "visible",
      timeout: 60000,
    });
    const novels = await page.locator("ul.row  a").evaluateAll((e) => {
      return e.map((el) => {
        return {
          novell_original_title: `${el.textContent?.trim()}`,
          novell_url: `${el.getAttribute("href")?.replace(/zh(?=&)/g, "ru")}`,
        };
      });
    });
    for (let i = 0; i < novels.length; i++) {
      const novell = await createNovell({
        page,
        pageToImages,
        ...novels[i],
      });

      await parseAllChapters(page, novell?.url_to_all_chapters as string, novell?.slug as string);
    }
  } catch (error) {
    console.error("error parse all novels", error);
  }
}

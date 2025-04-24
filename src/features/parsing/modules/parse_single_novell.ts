import { Page } from "playwright";

export async function parseSingleNovell({
  page,
  pageToImages,
  novell_original_title,
  novell_url,
}: {
  page: Page;
  pageToImages: Page;
  novell_original_title: string;
  novell_url: string;
}) {
  console.log(novell_url);
  await page.goto(novell_url);
  await page.waitForSelector(".bookbox", { state: "visible", timeout: 60000 });
  const novell = await page.locator("div.bookbox").evaluateAll((e) => {
    return e.map((el) => {
      return {
        novell_image_url: `${el.querySelector("img")?.getAttribute("src")}`,
        novell_author: `${el.querySelectorAll("div.booknav2 > p")[0].textContent?.trim()}`,
        novell_genre: `${el.querySelectorAll("div.booknav2 > p")[1].textContent?.trim()}`,
      };
    });
  });
  const tags = await page.locator("ul.tagul").evaluateAll((e) => {
    return e.map((el) => {
      const tagsElements = el.querySelectorAll("a");
    });
  });
  console.log(novell);
}

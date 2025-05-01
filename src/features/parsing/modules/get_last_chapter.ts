import { Page } from "playwright";

export async function getLastChapter(
  page: Page,
  novell_url: string,
) {
  await page.goto(novell_url);
  await page.waitForSelector(".bookbox", {
    state: "visible",
    timeout: 60000,
  });

  const last_chapter = (await page
    .locator("div.qustime > ul > li >a > span")
    .nth(0)
    .textContent()) as string;

  return last_chapter;
}

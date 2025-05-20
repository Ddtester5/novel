import { Page } from "playwright";

export async function googleTranslate(page: Page) {
  await page.goto(
    "https://translate.google.com/?sl=zh-CN&tl=ru&op=translate",
  );
  await page.waitForTimeout(5000);
}

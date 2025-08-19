import { Page } from "playwright";
import { createChapter } from "../seed/create_chapter";
import { sleep } from "@/shared/lib/sleep";

export async function parseChapter(
  page: Page,
  new_chapter: {
    number: number;
    url: string;
  },
  novell_slug: string,
) {
  try {
    await page.goto(new_chapter.url);
    await page.waitForSelector("div.txtnav", {
      state: "attached",
      timeout: 60000,
    });
    await sleep(15000);
    const title = (await page.locator("div.txtnav >  h1 ").textContent())?.trim() || "";
    const content = (await page.locator("div.txtnav ").innerHTML())?.trim() || "";

    const cleaned_content = content
      .replace(/<div[^>]*>[\s\S]*?<\/div>/g, "")
      .replace(/<h1[^>]*>[\s\S]*?<\/h1>/g, "")
      .replace(/<a[^>]*>[\s\S]*?<\/a>/gi, "")
      .replace(/<img[^>]*>/gi, "")
      .replace(/font/g, "p")
      .replace(/dir="auto"/g, "")
      .replace(/style="vertical-align: inherit;"/g, "")
      .replace(/(Конец главы)/g, "")
      .replace(/(Конец этой главы)/g, "")
      .replace(/<br>/g, "")
      .replace(/(\s*&emsp;\s*)+/g, "")
      .replace(/\u2003+/g, "")
      .replace(/<p\s*>\s*[:?.,()]*\s*<\/p>/g, "")
      .replace(/<p\s*><p\s*>/g, "<p>")
      .replace(/<\/p><\/p>/g, "</p>")
      .replace(/<p>\s*\.\s*/g, "<p>")
      .replace(/<p>.*?<\/p>/i, "")
      .trim();

    const cleaned_title = title
      .replace(/^Глава\s+\d+[:.\-\s]*\s*/i, "")
      .replace(/\([^)]*\)/gi, "")
      .trim();
    await createChapter({
      content: cleaned_content[0] + cleaned_content.slice(1),
      title: cleaned_title,
      number: new_chapter.number,
      novell_slug: novell_slug,
    });
  } catch (error) {
    console.error("parse chapters error", error);
  }
}

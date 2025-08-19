import { Page } from "playwright";
import { createChapter } from "../seed/create_chapter";
import { sleep } from "@/shared/lib/sleep";

export async function parseChapter(
  page: Page,
  new_chapter: {
    number: number;
    // title: string;
    url: string;
  },
  novell_slug: string,
) {
  try {
    await page.goto(new_chapter.url);
    await page.waitForTimeout(5000);
    await page.waitForSelector("div.txtnav", {
      state: "attached",
      timeout: 60000,
    });
    await sleep(5000);
    const title = (await page.locator("div.txtnav > font ").nth(0).textContent())?.trim() || "";
    const content = (await page.locator("div.txtnav ").innerHTML())?.trim() || "";
    const regex = new RegExp(`${title}\\.?`, "g");

    const cleaned_content = content
      .replace(/<div[^>]*>[\s\S]*?<\/div>/g, "")
      .replace(/<h1[^>]*>[\s\S]*?<\/h1>/g, "")
      .replace(/<a[^>]*>[\s\S]*?<\/a>/gi, "")
      .replace(/<img[^>]*>/gi, "")
      .replace(regex, "")
      .replace(/font/g, "p")
      .replace(/dir="auto"/g, "")
      .replace(/style="vertical-align: inherit;"/g, "")
      .replace(/<br>/g, "")
      .replace(/&emsp;&emsp;/g, "")
      .replace(/\u2003+/g, "")
      .replace(/ &emsp;&emsp; /g, "")
      .replace(/ &emsp;&emsp; /g, "")
      .replace(/<p\s*>\s*<\/p>/g, "")
      .replace(/<p  ><p  >/g, "<p>")
      .replace(/<p ><p >/g, "<p>")
      .replace(/<p><p>/g, "<p>")
      .replace(/<\/p><\/p>/g, "</p>")
      .trim();

    await createChapter({
      content: cleaned_content[0] + cleaned_content.slice(1),
      title: title,
      number: new_chapter.number,
      novell_slug: novell_slug,
    });
  } catch (error) {
    console.error("parse chapters error", error);
  }
}

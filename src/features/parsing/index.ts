import {
  Browser,
  BrowserContext,
  chromium,
  Page,
} from "playwright";
import { addHTTPheaders } from "./functions/addHttpHeader";
import { parseAllNovels } from "./modules/parse_all_novells";

export async function startParse() {
  const timeoutPromise = new Promise((_, rej) => {
    setTimeout(
      () => rej(new Error("Время парсинга новелл вышло")),
      5 * 60 * 60 * 1000,
    );
  });
  try {
    Promise.race([exeParse(), timeoutPromise]);
  } catch (error) {
    console.error("Error in startParse", error);
  }
}

export async function exeParse() {
  console.log("start parsing");
  let browser: Browser | undefined;
  let page: Page | undefined;
  let pageToImages: Page | undefined;
  let context: BrowserContext | undefined;
  let contextToImages: BrowserContext | undefined;
  try {
    browser = await chromium.launch({ headless: true });
    const data = await addHTTPheaders(browser, true);
    page = data.page;
    pageToImages = data.pageToImages;
    context = data.context;
    contextToImages = data.contextToImages;

    await parseAllNovels(page, pageToImages);
  } catch (error) {
    console.error("Parsing Error", error);
  } finally {
    if (page) {
      page.close();
      console.log("page closed");
    }
    if (pageToImages) {
      pageToImages.close();
      console.log("pageToImages closed");
    }
    if (context) {
      context.close();
      console.log("context closed");
    }
    if (contextToImages) {
      contextToImages.close();
      console.log("contextToImages closed");
    }
    if (browser) {
      browser.close();
      console.log("browser closed");
    }
  }
}

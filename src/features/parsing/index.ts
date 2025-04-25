import { Browser, chromium } from "playwright";
import { addHTTPheaders } from "./functions/addHttpHeader";
import { parseAllNovels } from "./modules/parse_all_novells";
import { parseAllTags } from "./modules/parse_all_tags";

export async function startParse() {
  console.log("start parsing");
  let browser: Browser | undefined;
  try {
    browser = await chromium.launch({ headless: true });
    const [page, pageToImages] = await addHTTPheaders(
      browser,
      true,
    );
    // await parseAllNovels(page, pageToImages);
    await parseAllTags(page);
  } catch (error) {
    console.error("Parsing Error", error);
  } finally {
    if (browser) {
      browser.close();
      console.log("browser closed");
    }
  }
}

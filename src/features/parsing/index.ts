import { Browser, chromium } from "playwright";
import { addHTTPheaders } from "./functions/addHttpHeader";
import { parseAllNovels } from "./modules/parse_all_novells";
import { parseAllGenres } from "./modules/parse_all_genres";
import { googleTranslate } from "@/shared/lib/openai/translate/google_translate";

export async function startParse() {
  console.log("start parsing");
  let browser: Browser | undefined;
  try {
    browser = await chromium.launch({ headless: true });
    const [page, pageToImages] = await addHTTPheaders(
      browser,
      true,
    );
    await googleTranslate(pageToImages);
    await parseAllGenres(page);
    await parseAllNovels(page, pageToImages);
  } catch (error) {
    console.error("Parsing Error", error);
  } finally {
    if (browser) {
      browser.close();
      console.log("browser closed");
    }
  }
}

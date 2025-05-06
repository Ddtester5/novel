import { Browser, Page } from "playwright";

export const addHTTPheaders = async (
  browser: Browser,
  isTest: boolean = false,
): Promise<Page[]> => {
  try {
    const contextToImages = await browser.newContext({
      bypassCSP: true,
      javaScriptEnabled: true,
      viewport: {
        width: 1280 + Math.floor(Math.random() * 200),
        height: 720 + Math.floor(Math.random() * 200),
      },
      locale: "en-US",
      timezoneId: "America/New_York",
      permissions: ["geolocation"],
      geolocation: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      colorScheme: "dark",
      httpCredentials: undefined,
      proxy: {
        server: "socks5://127.0.0.1:9050", // Адрес Tor SOCKS-прокси
      },
      ...(isTest
        ? {
            recordVideo: {
              dir: `./img_for_test/v1-${new Date().toISOString()}`,
              size: { width: 1280, height: 720 },
            },
          }
        : {}),
    });

    await contextToImages.addInitScript(() => {
      Object.defineProperty(navigator, "plugins", {
        get: () => [1, 2, 3, 4, 5],
      });
      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
      });
    });
    const context = await browser.newContext({
      ...(isTest
        ? {
            recordVideo: {
              dir: `./img_for_test/v2-${new Date().toISOString()}`,
              size: { width: 1280, height: 720 },
            },
          }
        : {}),
    });
    const page = await context.newPage();
    const pageToImages = await contextToImages.newPage();

    return [page, pageToImages];
  } catch (error) {
    console.log(
      "Ошибка при добавлении HTTP-заголовков:",
      error,
    );
    throw error; // Проброс ошибки для логирования в вызывающем коде
  }
};

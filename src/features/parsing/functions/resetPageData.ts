import { Page } from "playwright";

export async function resetPageData(page: Page) {
  try {
    const context = page.context();

    // 1. Очистить куки
    await context.clearCookies();

    // 2. Очистить LocalStorage и SessionStorage
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (error) {
        console.log("Нет доступа к localStorage", error);
      }
      try {
        sessionStorage.clear();
      } catch (error) {
        console.log("Нет доступа к sessionStorage", error);
      }
    });

    // 3. Очистить IndexedDB и Cache Storage
    await page.evaluate(() => {
      try {
        indexedDB.databases().then((dbs) => {
          dbs.forEach((db) => indexedDB.deleteDatabase(db.name!));
        });
      } catch (error) {
        console.log("Нет доступа к indexedDB", error);
      }
      try {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      } catch (error) {
        console.log("Нет доступа к caches", error);
      }
    });
    console.log("✅ Все данные страницы очищены!");
  } catch (error) {
    console.log("Не удалось очистить данные страницы", error);
  }
}

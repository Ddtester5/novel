import path from "path";
import { Page } from "playwright";
import fs from "fs";
import os from "os";
import { simulateMouseMovement } from "../simulate_mouse_move";

/**
 * Удаляет фон с изображения через сайт https://www.photiu.ai/ с использованием Playwright,
 * при этом входное изображение передается в виде Buffer.
 * @param imageBuffer - Изображение в виде Buffer.
 * @returns Buffer с изображением без фона.
 */
export const removeBackgroundWithphotiu = async (
  imageBuffer: Buffer,
  page: Page,
): Promise<Buffer> => {
  try {
    // Создаем временный файл из Buffer
    const tempFilePath = path.join(os.tmpdir(), "input_image.png");
    fs.writeFileSync(tempFilePath, imageBuffer);

    // Открываем сайт
    // console.log("Открываем сайт...");
    await page.goto("https://www.photiu.ai/background-remover", {
      timeout: 60000,
      waitUntil: "domcontentloaded",
    });
    // console.log("Сайт открыт");
    await page.waitForTimeout(1000);
    await simulateMouseMovement(page);
    const cookiebutton = 'button[id="CybotCookiebotDialogBodyButtonDecline"]';
    await page.waitForSelector(cookiebutton, {
      timeout: 60000,
      state: "visible",
    });
    await simulateMouseMovement(page);
    await page.click(cookiebutton);
    // Загружаем изображение на сайт
    const inputFileSelector = 'input[type="file"]';
    await page.waitForSelector(inputFileSelector, {
      timeout: 60000,
      state: "attached",
    });
    await page.setInputFiles(inputFileSelector, tempFilePath);
    // console.log("Изображение загружено");
    await page.waitForTimeout(5000);
    // Ждем, пока изображение обработается
    // await page.waitForSelector("div[class='transform-gpu']", {
    //   timeout: 60000,
    //   state: "attached",
    // });
    // console.log("Изображение обработано");
    // await page.screenshot({ path: "./img_for_test/1.png" });
    // Ждем, пока появится кнопка для скачивания
    const downloadButtonSelector = "button[id='Download HD free']";
    await page.waitForSelector(downloadButtonSelector, {
      timeout: 60000,
    });
    await simulateMouseMovement(page);
    // Перехватываем событие скачивания
    const [download] = await Promise.all([
      page.waitForEvent("download"), // Ждем события скачивания
      page.click(downloadButtonSelector), // Кликаем по кнопке для скачивания
    ]);

    // Определяем временный путь для скачивания
    const tempDownloadPath = path.join(os.tmpdir(), "processed_image.png");

    // Сохраняем файл на диск
    await download.saveAs(tempDownloadPath);
    // await download.saveAs(`./img_for_test/test-${new Date()}.png`);

    // console.log("Изображение без фона сохранено");

    // Читаем файл как Buffer
    const processedImageBuffer = fs.readFileSync(tempDownloadPath);

    // console.log("Изображение без фона получено как Buffer");
    fs.unlinkSync(tempFilePath); // Удаляем временный файл с исходным изображением
    fs.unlinkSync(tempDownloadPath); // Удаляем временный файл с обработанным изображением
    // Возвращаем Buffer
    return processedImageBuffer;
  } catch (error) {
    console.error("Ошибка при удалении фона:", error);
    throw error;
  }
};

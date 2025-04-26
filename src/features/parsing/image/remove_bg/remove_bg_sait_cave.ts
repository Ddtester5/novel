import path from "path";
import { Page } from "playwright";
import fs from "fs";
import os from "os";

/**
 * Удаляет фон с изображения через сайт carve.photos с использованием Playwright,
 * при этом входное изображение передается в виде Buffer.
 * @param imageBuffer - Изображение в виде Buffer.
 * @returns Buffer с изображением без фона.
 */
export const removeBackgroundWithCarve = async (
  imageBuffer: Buffer,
  page: Page,
): Promise<Buffer> => {
  try {
    // Создаем временный файл из Buffer
    const tempFilePath = path.join(
      os.tmpdir(),
      "input_image.png",
    );
    fs.writeFileSync(tempFilePath, imageBuffer);

    // Открываем сайт
    // console.log("Открываем сайт...");
    await page.goto("https://carve.photos/", {
      timeout: 60000,
      waitUntil: "domcontentloaded",
    });
    // console.log("Сайт открыт");
    await page.waitForTimeout(1000);

    // Загружаем изображение на сайт
    const inputFileSelector = 'input[type="file"]';
    await page.setInputFiles(
      inputFileSelector,
      tempFilePath,
    );
    // console.log("Изображение загружено");

    // Ждем, пока изображение обработается
    await page.waitForSelector(
      "img[alt='изображение без фона']",
      {
        timeout: 60000,
      },
    );
    await page.waitForFunction(
      () => {
        const imgElement = document.querySelector(
          "img[alt='изображение без фона']",
        ) as HTMLImageElement;
        return imgElement?.src.startsWith("blob:");
      },
      { timeout: 60000 },
    );
    // console.log("Изображение обработано");

    // Ждем, пока появится кнопка для скачивания
    const downloadButtonSelector =
      "button.download-button.secondary";
    await page.waitForSelector(downloadButtonSelector, {
      timeout: 60000,
    });

    // Перехватываем событие скачивания
    const [download] = await Promise.all([
      page.waitForEvent("download"), // Ждем события скачивания
      page.click(downloadButtonSelector), // Кликаем по кнопке для скачивания
    ]);

    // Определяем временный путь для скачивания
    const tempDownloadPath = path.join(
      os.tmpdir(),
      "processed_image.png",
    );

    // Сохраняем файл на диск
    await download.saveAs(tempDownloadPath);

    // console.log("Изображение без фона сохранено");

    // Читаем файл как Buffer
    const processedImageBuffer = fs.readFileSync(
      tempDownloadPath,
    );

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

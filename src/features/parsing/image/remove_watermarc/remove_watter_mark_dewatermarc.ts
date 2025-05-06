import path from "path";
import { Page } from "playwright";
import fs from "fs";
import os from "os";
import { simulateMouseMovement } from "../simulate_mouse_move";

export const removeWattermarkDewatermarck = async (
  imageBuffer: Buffer,
  page: Page,
  textDelete: boolean,
): Promise<Buffer> => {
  try {
    const tempFilePath = path.join(
      os.tmpdir(),
      `input_image.png`,
    );
    const tempDownloadPath = path.join(
      os.tmpdir(),
      "processed_image.png",
    );

    fs.writeFileSync(tempFilePath, imageBuffer);

    // Создаем временный файл из Buffer

    // Открываем сайт
    // console.log("Открываем сайт...");
    await page.goto("https://dewatermark.ai/", {
      timeout: 60000,
      waitUntil: "domcontentloaded",
    });
    // console.log("Сайт открыт");

    // Нажимаем на кнопку согласия (если она есть)
    // const coockyOk = "button:has-text('Consent')";
    // await page.waitForSelector(coockyOk, { timeout: 60000 });
    // await page.locator(coockyOk).click();
    await simulateMouseMovement(page);

    // Загружаем изображение на сайт
    const inputFileSelector = 'input[type="file"]';
    await page.waitForSelector(inputFileSelector, {
      timeout: 60000,
      state: "attached",
    });
    // console.log("input найден");

    // Устанавливаем файл
    await page.setInputFiles(
      inputFileSelector,
      tempFilePath,
    );
    // const inputFileValue = await page.locator(inputFileSelector).inputValue();
    // console.log("Загружен файл:", inputFileValue);

    // Ждем, пока изображение обработается
    await page.waitForTimeout(5000); // Ожидание 5 секунд для обработки
    await page.waitForSelector(
      "img[alt='enhanced-image']",
      { timeout: 60000 },
    );
    // console.log("Изображение обработано");
    if (textDelete) {
      const textDeleteButtonSelector =
        "button[role='switch']";
      await page.waitForSelector(textDeleteButtonSelector, {
        timeout: 60000,
        state: "attached",
      });
      await page.click(textDeleteButtonSelector);
      await simulateMouseMovement(page);
      await page.waitForTimeout(5000);
    }
    await page.waitForSelector(
      "img[alt='enhanced-image']",
      { timeout: 60000 },
    );
    await simulateMouseMovement(page);
    // Ожидаем появления кнопки для скачивания
    const downloadButtonSelector =
      "button:has-text('Download')";
    await page.waitForSelector(downloadButtonSelector, {
      timeout: 60000,
    });

    // Перехватываем событие скачивания
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click(`${downloadButtonSelector} >> nth=0`),
    ]);

    // Сохраняем файл на диск
    await download.saveAs(tempDownloadPath);
    // await download.saveAs(`./img_for_test/test-${new Date()}.png`);
    // console.log("Изображение без вотермарки сохранено");
    await simulateMouseMovement(page);
    // Читаем файл как Buffer
    const processedImageBuffer = fs.readFileSync(
      tempDownloadPath,
    );
    fs.unlinkSync(tempFilePath); // Удаляем временный файл с исходным изображением
    fs.unlinkSync(tempDownloadPath); // Удаляем временный файл с обработанным изображением

    // Возвращаем Buffer
    return processedImageBuffer;
  } catch (error) {
    console.error("Ошибка при удалении вотермарки:", error);
    throw error;
  }
};

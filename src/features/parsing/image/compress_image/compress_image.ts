import { restartTor } from "@/shared/lib/tor";
import { compressImageILoveImage } from "./compress_image_iloveimg";
import { Page } from "playwright";
import { resetPageData } from "../../functions/resetPageData";

export const сompressImageWithRetry = async (
  imageBuffer: Buffer,
  page: Page,
  maxRetries: number = 5,
): Promise<Buffer> => {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      return await compressImageILoveImage(imageBuffer, page);
    } catch (error) {
      attempts++;
      console.error(`Ошибка при сжатии изображения (попытка ${attempts}):`, error);

      if (attempts < maxRetries) {
        console.log("Перезапуск Tor и повторная попытка...");
        await restartTor();
        await resetPageData(page);
      } else {
        console.log("Не удалось сжать изображение после максимального количества попыток");
      }
    }
  }

  return imageBuffer;
};

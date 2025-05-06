import { restartTor } from "@/shared/lib/tor";
import { removeWattermarkDewatermarck } from "./remove_watter_mark_dewatermarc";
import { Page } from "playwright";
import { resetPageData } from "../../functions/resetPageData";

export const removeWattermarkWithRetry = async (
  imageBuffer: Buffer,
  page: Page,
  textDelete: boolean,
  maxRetries: number = 10,
): Promise<Buffer> => {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      return await removeWattermarkDewatermarck(
        imageBuffer,
        page,
        textDelete,
      );
    } catch (error) {
      attempts++;
      console.error(
        `Ошибка при удалении вотермарки (попытка ${attempts}):`,
        error,
      );

      if (attempts < maxRetries) {
        console.log(
          "Перезапуск Tor и повторная попытка...",
        );
        await restartTor();
        await resetPageData(page);
      } else {
        console.log(
          "Не удалось удалить вотермарку после максимального количества попыток",
        );
      }
    }
  }

  return imageBuffer;
};

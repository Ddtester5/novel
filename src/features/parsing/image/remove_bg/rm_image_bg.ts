import { restartTor } from "@/shared/lib/tor";
import { removeBgImageILoveImage } from "./remove_bg_iloveimg";
import { removeBackgroundWithCarve } from "./remove_bg_sait_cave";
import { removeBackgroundWithphotiu } from "./remove_bg_sait_photiu";
import { Page } from "playwright";
import { resetPageData } from "../../functions/resetPageData";

// Тип для функций удаления фона
type BackgroundRemover = {
  name: string;
  func: (imageBuffer: Buffer, page: Page) => Promise<Buffer>;
};

export const removeImageBackgroundWithRetry = async (
  imageBuffer: Buffer,
  page: Page,
  maxRetriesPerService: number = 5,
): Promise<Buffer> => {
  // Список обработчиков в порядке приоритета
  const removers: BackgroundRemover[] = [
    { name: "Photiu", func: removeBackgroundWithphotiu },
    { name: "ILoveImage", func: removeBgImageILoveImage },
    { name: "Carve", func: removeBackgroundWithCarve },
  ];

  for (const remover of removers) {
    let attempts = 0;

    while (attempts < maxRetriesPerService) {
      try {
        const result = await remover.func(imageBuffer, page);
        return result;
      } catch (error) {
        attempts++;
        console.log(
          `[${remover.name}] Попытка ${attempts}/${maxRetriesPerService} неудачна:`,
          error,
        );

        if (attempts < maxRetriesPerService) {
          console.log("Перезапуск Tor и повторная попытка...");
          await restartTor();
          await resetPageData(page);
        }
      }
    }

    console.log(`[${remover.name}] Все попытки исчерпаны`);
  }

  console.log("Все сервисы не смогли обработать изображение");
  return imageBuffer;
};

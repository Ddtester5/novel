import axios from "axios";
import { removeWattermarkWithRetry } from "../../features/parsing/image/remove_watermarc/rm_image_watermarc";
import { incriaseImageWithRetry } from "../../features/parsing/image/incriase_image/incriase_image";
import { сompressImageWithRetry } from "../../features/parsing/image/compress_image/compress_image";
import { Page } from "playwright";
import { getImageName } from "./get_image_name";
import { fileStorage } from "./file-storage";
import { removeImageBackgroundWithRetry } from "@/features/parsing/image/remove_bg/rm_image_bg";
import { replaceWatermarkWithSharp } from "./add_watermarck";

export const downloadImageForS3 = async (
  url: string,
  textForFilename: string | undefined,
  imgDirNameInStorage: string,
  config: {
    page?: Page;
    convert_to_png: boolean;
    remove_wattermark: boolean;
    proxy_tor: boolean;
    incriase: boolean;
    textDelete: boolean;
  },
) => {
  try {
    if (!config.page) {
      console.log("Problem with playwright page");
      return null;
    }
    const imgName = getImageName(
      config.convert_to_png,
      textForFilename,
    );
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });
    const contentType =
      response.headers["content-type"] ||
      "application/octet-stream";
    let processedImageBuffer = response.data;
    try {
      if (config.incriase) {
        processedImageBuffer = await incriaseImageWithRetry(
          processedImageBuffer,
          config.page,
        );
      }
    } catch (error) {
      console.log("Failed to increase image:", url, error);
    }
    try {
      if (config.remove_wattermark) {
        processedImageBuffer =
          await removeWattermarkWithRetry(
            processedImageBuffer,
            config.page,
            config.textDelete,
          );
      }
    } catch (error) {
      console.log(
        "Failed to remove watermark:",
        url,
        error,
      );
    }
    try {
      if (config.convert_to_png) {
        processedImageBuffer =
          await removeImageBackgroundWithRetry(
            processedImageBuffer,
            config.page,
          );
      }
    } catch (error) {
      console.log(
        "Failed to remove background:",
        url,
        error,
      );
    }

    processedImageBuffer = await replaceWatermarkWithSharp(
      processedImageBuffer,
      "tech24view.ru",
    );
    try {
      processedImageBuffer = await сompressImageWithRetry(
        processedImageBuffer,
        config.page,
      );
    } catch (error) {
      console.log("Failed to compress image:", url, error);
    }

    // Создаем Blob из массива байтов
    const blob = new Blob([processedImageBuffer], {
      type: contentType,
    });

    // Создаем File из Blob (если имя файла известно)
    const file = new File([blob], imgName, {
      type: contentType,
    });

    const storedFile = await fileStorage.uploadImage(
      file,
      imgDirNameInStorage,
      imgName,
    );

    return storedFile.path;
  } catch (error) {
    console.warn("Failed to download image:", url, error);
    return null;
  }
};

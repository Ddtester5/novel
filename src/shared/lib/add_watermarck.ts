import sharp from "sharp";
export const replaceWatermarkWithSharp = async (imageBuffer: Buffer, replacementText: string) => {
  try {
    // Передаем Buffer в sharp
    const { width, height } = await sharp(imageBuffer).metadata();

    if (!width || !height) {
      throw new Error("Не удалось получить размеры изображения.");
    }

    // Задаем относительные пропорции для области водяного знака
    let xRatio = 0.59;
    let yRatio = 0.88;
    let widthRatio = 0.4;
    let heightRatio = 0.11;
    let fontSizeKoef = 0.05;
    let letterSpasing = 0.6;
    if (width > height) {
      xRatio = 0.69;
      yRatio = 0.83;
      widthRatio = 0.29;
      heightRatio = 0.15;
      fontSizeKoef = 0.06;
      letterSpasing = 0.7;
    }

    // Вычисляем абсолютные координаты и размеры области
    const x = Math.round(width * xRatio);
    const y = Math.round(height * yRatio);
    const regionWidth = Math.round(width * widthRatio);
    const regionHeight = Math.round(height * heightRatio);
    const fontSize = Math.round((regionWidth + regionHeight) * fontSizeKoef);

    // Извлекаем, размываем и вставляем область обратно
    const blurredRegion = await sharp(imageBuffer)
      .extract({
        left: x,
        top: y,
        width: regionWidth,
        height: regionHeight,
      })
      .blur(5)
      .toBuffer();

    const blurredImage = await sharp(imageBuffer)
      .composite([
        {
          input: blurredRegion,
          top: y,
          left: x,
        },
      ])
      .toBuffer();

    // Добавляем текст с градиентом и тенью
    const finalImage: Buffer = await sharp(blurredImage)
      .composite([
        {
          input: Buffer.from(`
            <svg width="${regionWidth}" height="${regionHeight}" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="textShadow" x="0" y="0" width="200%" height="200%">
                  <feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="rgba(41, 2, 31, 0.7)" />
                </filter>
                <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="40%" style="stop-color:rgb(160, 22, 137);stop-opacity:0.65" />
                  <stop offset="80%" style="stop-color:rgb(160, 22, 137);stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:rgb(160, 22, 137);stop-opacity:0" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="${regionWidth}" height="${regionHeight}" fill="url(#grad)" />
              <text 
                x="${regionWidth / 2}" 
                y="${regionHeight / 1.6}" 
                font-size="${fontSize}" 
                fill="rgba(255, 255, 255, 0.9)" 
                font-weight="700" 
                font-style="italic" 
                text-anchor="middle" 
                dominant-baseline="middle" 
                letter-spacing="${letterSpasing}px" 
                font-family="Arial"
                filter="url(#textShadow)"
              >
                ${replacementText.toUpperCase()}
              </text>
            </svg>
          `),
          top: y,
          left: x,
        },
      ])
      .sharpen()
      .modulate({
        brightness: 1.02, // Увеличение яркости
        saturation: 1.02, // Увеличение насыщенности
      })
      .normalize()
      .toBuffer();

    return finalImage;
  } catch (error) {
    console.log("Ошибка при обработке изображения:", error);
  }
};

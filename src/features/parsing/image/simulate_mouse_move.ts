import { Page } from "playwright";

// Функция для генерации случайного числа в диапазоне [min, max]
const getRandomCoordinate = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const simulateMouseMovement = async (page: Page) => {
  const mouse = page.mouse;

  // Генерируем случайные координаты для третьего движения
  const x3 = getRandomCoordinate(0, 800);
  const y3 = getRandomCoordinate(0, 600);
  await mouse.move(x3, y3, { steps: 2 });

  // Ожидание, чтобы увидеть результат
  await page.waitForTimeout(2000);
};

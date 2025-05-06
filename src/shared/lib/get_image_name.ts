import cuid from "cuid";

export const getImageName = (
  convert_to_png: boolean,
  text?: string | undefined,
): string => {
  const sanitizedTitle = text
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // Заменяем любые не буквы/цифры на "_"
    .replace(/^_+|_+$/g, "") // Убираем лишние "_" в начале и конце
    .slice(0, text.length < 20 ? text.length : 20);

  return `${sanitizedTitle}_${cuid()}.${convert_to_png ? "png" : "jpg"}`;
};

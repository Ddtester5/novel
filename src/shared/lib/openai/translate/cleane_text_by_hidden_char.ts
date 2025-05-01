export function cleanHiddenCharacters(
  text: string,
): string {
  return text
    .replace(
      /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g,
      "",
    ) // удаляем невидимые символы
    .replace(/[ \t]+/g, " ") // только табы и пробелы схлопываем
    .trim();
}

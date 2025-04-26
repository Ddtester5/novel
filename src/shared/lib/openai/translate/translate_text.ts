import { client, TEXT_AI_MODEL } from "../ai_client";

export const translateText = async (
  text: string,
  context?: string,
  temperature?: number,
): Promise<string> => {
  try {
    const chatCompletion =
      await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Отвечай на руском языке строго в  формате строки,  без добавления комментариев.",
          },
          {
            role: "user",
            content: `Переведи ${context} с китайского на русский язык.
            Перевод должен звучать естественно для русскоязычного читателя, как художественное произведение.
            Сохраняй атмосферу и стиль оригинала.
            Имена персонажей и названия мест оставляй транслитерированными (передавай звучание китайских имён русскими буквами, без перевода).
            Титулы (например, "Старший Брат", "Старейшина", "Мастер Секты") переводи на русский, если они понятны без пояснений.
            Сложные поэтические описания старайся передавать красиво, а не дословно.
            Не добавляй ничего от себя и не убирай важные детали.
            Если встречаются китайские идиомы (чэнъюй 成语), перефразируй их так, чтобы они звучали естественно по-русски.
            Вот текст:${text}`,
          },
        ],
        temperature: temperature ? temperature : 0,
        model: TEXT_AI_MODEL,
      });
    return chatCompletion.choices[0].message
      .content as string;
  } catch (e) {
    console.error("ai translate text error", e);
    return "";
  }
};

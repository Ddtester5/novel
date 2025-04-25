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
            content: `Переведи (${context}) с китайского на руский язык, сохрани смысл и изначальный посыл, чтоб рускому было все понятно:
          text: ${text}.
          Не добавляй свои комментарии,вопросы, пояснения, символы(\`'"/|\<>*)`,
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

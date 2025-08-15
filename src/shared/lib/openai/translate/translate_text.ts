import { client, TEXT_AI_MODEL } from "../ai_client";

export const translateText = async (
  text: string,
  context?: string,
  temperature?: number,
): Promise<string> => {
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Отвечай на русcком языке  строго в  формате строки ,  без добавления комментариев.",
        },
        {
          role: "user",
          content: `Переведи ${context} с китайского на русский так, чтобы он звучал естественно для русскоязычного читателя, словно это произведение художественной литературы. 

Вот текст для перевода:
${text}`,
        },
      ],
      temperature: temperature ? temperature : 0,
      model: TEXT_AI_MODEL,
    });
    return chatCompletion.choices[0].message.content as string;
  } catch (e) {
    console.error("ai translate text error", e);
    return "";
  }
};

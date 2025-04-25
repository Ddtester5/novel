import OpenAI from "openai";

export const client = new OpenAI({
  apiKey: "",
  baseURL: "http://localhost:1337/v1",
});
// export const client = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1/",
//   apiKey: "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",
//   defaultHeaders: {
//     "HTTP-Referer": "https://tech24view.ru", // Optional. Site URL for rankings on openrouter.ai.
//     "X-Title": "tech24view", // Optional. Site title for rankings on openrouter.ai.
//   },
// });
export const TEXT_AI_MODEL = "deepseek-v3";
export const IMAGE_AI_MODEL = "flux";

import { z } from "zod";
import { config } from "dotenv";

config();
const privateConfigSchema = z.object({
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_IMAGES_BUCKET: z.string(),
  S3_ENDPOINT: z.string(),
  S3_REGION: z.string(),

  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  YANDEX_CLIENT_ID: z.string().optional(),
  YANDEX_CLIENT_SECRET: z.string().optional(),

  MAILRU_CLIENT_ID: z.string().optional(),
  MAILRU_CLIENT_SECRET: z.string().optional(),

  ADMIN_EMAILS: z.string().optional(),

  GOOGLE_ANALITICS_4_ID: z.string().optional(),

  TELEGRAM_BOT_KEY: z.string().optional(),
  TELEGRAM_CHANNEL_ID: z.string().optional(),
  FACEBOOK_ACCESS_TOKEN: z.string().optional(),
  INSTAGRAM_BUSINESS_ACCOUNT_ID: z.string().optional(),
  FACEBOOK_PAGE_ID: z.string().optional(),

  TEST_ENV_BASE_URL: z.string().optional(),

  NODE_ENV: z.string().optional(),

  PAYLOAD_SECRET: z.string().optional(),
});

export const privateConfig = privateConfigSchema.parse(
  process.env,
);

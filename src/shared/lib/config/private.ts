import { z } from "zod";
import { config } from "dotenv";

config();
const privateConfigSchema = z.object({
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_IMAGES_BUCKET: z.string(),
  S3_ENDPOINT: z.string(),
  S3_REGION: z.string(),

  TELEGRAM_BOT_KEY: z.string().optional(),
  TELEGRAM_CHANNEL_ID: z.string().optional(),
  NODE_ENV: z.string().optional(),

  SAIT_URL: z.string().optional(),
  SAIT_NAME: z.string().optional(),
  TOR_PROXY_PORT: z.string().optional(),
  TOR_CONTAINER_NAME: z.string().optional(),
  BACKUP_DIR: z.string().optional(),
  POSTGRES_CONTAINER: z.string().optional(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_HOST: z.string().optional(),
  POSTGRES_PORT: z.string().optional(),
  POSTGRES_DB: z.string().optional(),
  DATABASE_URL: z.string().optional(),

  MINIO_PORT: z.string().optional(),
  MINIO_ADMIN_PORT: z.string().optional(),
  MINIO_CONTAINER: z.string().optional(),
  MINIO_ROOT_USER: z.string().optional(),
  MINIO_ROOT_PASSWORD: z.string().optional(),
});

export const privateConfig = privateConfigSchema.parse(
  process.env,
);

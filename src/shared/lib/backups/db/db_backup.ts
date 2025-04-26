import { execSync } from "child_process";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

const {
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_CONTAINER,
  BACKUP_DIR,
} = process.env;

if (
  !POSTGRES_USER ||
  !POSTGRES_DB ||
  !POSTGRES_CONTAINER ||
  !BACKUP_DIR
) {
  console.error("Не заданы переменные окружения!");
  process.exit(1);
}

// Убедимся, что директория бэкапов существует
fs.mkdirSync(BACKUP_DIR, { recursive: true });
fs.mkdirSync(`${BACKUP_DIR}/db_old`, { recursive: true });
fs.mkdirSync(`${BACKUP_DIR}/minio_old`, {
  recursive: true,
});

export const createBackup = async () => {
  const date = new Date().toISOString();
  const backupFile = path.join(
    BACKUP_DIR,
    `backup_${POSTGRES_DB}_${date}.dump.bz2`,
  );

  try {
    console.log(`Создание бэкапа ${backupFile}...`);
    execSync(
      `nice -n 19 ionice -c 3  docker exec ${POSTGRES_CONTAINER} pg_dump -U ${POSTGRES_USER} -F c ${POSTGRES_DB} | bzip2 > ${backupFile}`,
      { stdio: "inherit" },
    );
    console.log("✅ Бэкап успешно создан!");
  } catch (error) {
    console.error("❌ Ошибка создания бэкапа:", error);
  }
};

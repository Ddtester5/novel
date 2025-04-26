import { execSync } from "child_process";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

const {
  MINIO_CONTAINER,
  S3_IMAGES_BUCKET,
  BACKUP_DIR,
  MINIO_ROOT_USER,
  MINIO_ROOT_PASSWORD,
} = process.env;

if (
  !MINIO_CONTAINER ||
  !S3_IMAGES_BUCKET ||
  !BACKUP_DIR ||
  !MINIO_ROOT_USER ||
  !MINIO_ROOT_PASSWORD
) {
  console.error("❌ Не заданы переменные окружения!");
  process.exit(1);
}

// Функция для создания бэкапа MinIO
export const createMinioBackup = async () => {
  // Убедимся, что директория бэкапов существует
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  fs.mkdirSync(`${BACKUP_DIR}/db_old`, { recursive: true });
  fs.mkdirSync(`${BACKUP_DIR}/minio_old`, {
    recursive: true,
  });

  const date = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");
  const backupFolder = path.join(
    BACKUP_DIR,
    `minio_backup_tech_${date}`,
  );

  try {
    console.log(
      `📀 Копирование данных MinIO в ${backupFolder}...`,
    );

    // Создаём папку для копии
    fs.mkdirSync(backupFolder, { recursive: true });

    // Копируем файлы из MinIO на хост
    execSync(
      `nice -n 19 ionice -c 3  docker exec ${MINIO_CONTAINER} mc alias set myminio http://localhost:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD} &&
       nice -n 19 ionice -c 3  docker exec ${MINIO_CONTAINER} mc cp --recursive myminio/${S3_IMAGES_BUCKET} /tmp/minio_backup > /dev/null &&
       nice -n 19 ionice -c 3 docker cp ${MINIO_CONTAINER}:/tmp/minio_backup ${backupFolder} > /dev/null`,
      { stdio: "inherit" },
    );

    // Архивируем на хосте
    execSync(
      ` nice -n 19 ionice -c 3 tar -cjf ${backupFolder}.tar.bz2 -C ${BACKUP_DIR} minio_backup_tech_${date}`,
      {
        stdio: "inherit",
      },
    );

    // Удаляем временную папку
    fs.rmSync(backupFolder, {
      recursive: true,
      force: true,
    });

    console.log(`✅ Архив создан: ${backupFolder}.tar.bz2`);
  } catch (error) {
    console.error(
      "❌ Ошибка создания бэкапа MinIO:",
      error,
    );
  }
};

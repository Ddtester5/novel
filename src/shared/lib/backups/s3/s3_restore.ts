import { execSync } from "child_process";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

const { MINIO_CONTAINER, S3_IMAGES_BUCKET, BACKUP_DIR, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD } =
  process.env;

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

export const restoreLatestMinioBackup = (backupPath?: string) => {
  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((file) => file.startsWith("minio_backup_") && file.endsWith(".tar.bz2"))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error("❌ Нет доступных бэкапов!");
    process.exit(1);
  }

  const latestMinioBackup = path.join(BACKUP_DIR, backupPath ? backupPath : files[0]);

  try {
    console.log(`🔄 Восстановление из ${latestMinioBackup}...`);

    // Создаем директорию для восстановления
    const restoreDir = path.join(BACKUP_DIR, "restore");
    fs.mkdirSync(restoreDir, { recursive: true });

    // Разархивируем бэкап в созданную директорию
    execSync(`tar -xjf ${latestMinioBackup} -C ${restoreDir}`, {
      stdio: "inherit",
    });
    const restorePath = path.join(
      restoreDir,
      path.basename(backupPath ? backupPath : files[0], ".tar.bz2"),
    );
    // Копируем данные с сервера в контейнер MinIO
    execSync(
      `docker exec ${MINIO_CONTAINER} mkdir -p /tmp/${S3_IMAGES_BUCKET} &&
      docker cp ${restorePath}/minio_backup/${S3_IMAGES_BUCKET}/ ${MINIO_CONTAINER}:/tmp/${S3_IMAGES_BUCKET} > /dev/null`,
      { stdio: "inherit" },
    );

    // Копируем данные из контейнера MinIO в MinIO бакет
    execSync(
      `docker exec ${MINIO_CONTAINER} mc alias set myminio http://localhost:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD} && 
   docker exec ${MINIO_CONTAINER} mc cp --recursive /tmp/${S3_IMAGES_BUCKET}/${S3_IMAGES_BUCKET}/ myminio/${S3_IMAGES_BUCKET}/ > /dev/null`,
      { stdio: "inherit" },
    );
    fs.rmSync(restoreDir, { recursive: true, force: true });
    execSync(`docker exec ${MINIO_CONTAINER} rm -rf /tmp/`, {
      stdio: "inherit",
    });
    console.log("✅ Восстановление MinIO завершено!");
  } catch (error) {
    console.error("❌ Ошибка восстановления MinIO:", error);
  }
};

restoreLatestMinioBackup();

import { execSync } from "child_process";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

const { POSTGRES_USER, POSTGRES_DB, POSTGRES_CONTAINER, BACKUP_DIR } = process.env;

if (!POSTGRES_USER || !POSTGRES_DB || !POSTGRES_CONTAINER || !BACKUP_DIR) {
  console.error("Не заданы переменные окружения!");
  process.exit(1);
}

export const restoreLatestBackup = (backupPath?: string) => {
  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((file) => file.startsWith("backup_") && file.endsWith(".dump.bz2"))
    .sort()
    .reverse();
  if (files.length === 0) {
    console.error("❌ Нет доступных бэкапов!");
    process.exit(1);
  }

  const latestBackup = path.join(BACKUP_DIR, files[0]);

  try {
    console.log(`🔄 Восстановление из ${latestBackup}...`);
    execSync(
      `bzcat ${backupPath ? backupPath : latestBackup} | docker exec -i ${POSTGRES_CONTAINER} pg_restore -U ${POSTGRES_USER} -d ${POSTGRES_DB} --clean --if-exists`,
      { stdio: "inherit" },
    );
    console.log("✅ Восстановление завершено!");
  } catch (error) {
    console.error("❌ Ошибка восстановления:", error);
  }
};
restoreLatestBackup();

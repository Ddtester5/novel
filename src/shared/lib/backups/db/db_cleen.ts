import fs from "fs";
import path from "path";
import { config } from "dotenv";

config();

const { BACKUP_DIR } = process.env;

if (!BACKUP_DIR) {
  console.error("Не задан BACKUP_DIR!");
  process.exit(1);
}

export const cleanupOldDBBackups = async () => {
  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((file) => file.startsWith("backup_") && file.endsWith(".dump.bz2"))
    .map((file) => ({
      name: file,
      path: path.join(BACKUP_DIR, file),
      date: file.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "",
    }))
    .filter((file) => file.date);
  const today = new Date();
  const oldFiles = files.filter((file) => {
    const fileDate = new Date(file.date);
    const diffDays = (today.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24);
    if (fileDate.getDate() === 15) {
      fs.copyFileSync(file.path, path.join(BACKUP_DIR, "db_old", file.name));
      fs.rmSync(file.path);
    }
    return diffDays > 5;
  });
  for (const file of oldFiles) {
    console.log(`🗑 Удаляем: ${file.name}`);
    fs.rmSync(file.path);
  }

  console.log("✅ Очистка завершена!");
};

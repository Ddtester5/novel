import { createBackup } from "./db/db_backup";
import { cleanupOldDBBackups } from "./db/db_cleen";
import { createMinioBackup } from "./s3/s3_backup";
import { cleanupOldMinioBackups } from "./s3/s3_cleen";

(async () => {
  await createBackup();
  await createMinioBackup();
  await cleanupOldDBBackups();
  await cleanupOldMinioBackups();
})();

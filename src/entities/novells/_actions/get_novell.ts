import { dataBase } from "@/shared/lib/db_connect";

export async function getAllNovels() {
  try {
    return await dataBase.novells.findMany({});
  } catch (error) {
    console.error("get all tags error", error);
    return [];
  }
}

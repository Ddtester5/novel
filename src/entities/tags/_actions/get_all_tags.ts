import { dataBase } from "@/shared/lib/db_connect";
import { Tags } from "../../../../generated/prisma";

export async function getAllTags(): Promise<Tags[]> {
  try {
    return await dataBase.tags.findMany();
  } catch (error) {
    console.error("get all tags error", error);
    return [];
  }
}

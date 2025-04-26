import { dataBase } from "@/shared/lib/db_connect";
import { Genres } from "../../../../generated/prisma";

export async function getAllGenres(): Promise<Genres[]> {
  try {
    return await dataBase.genres.findMany();
  } catch (error) {
    console.error("get all genres error", error);
    return [];
  }
}

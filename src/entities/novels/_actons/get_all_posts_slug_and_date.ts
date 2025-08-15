import { dataBase } from "@/shared/lib/db_connect";

export const getAllPostsSlugAndDate = async (type: "NEWS" | "REVIEWS") => {
  try {
    const news = await dataBase.posts.findMany({
      where: { type: type },
      select: {
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return news;
  } catch (error) {
    console.log(error);
    return [];
  }
};

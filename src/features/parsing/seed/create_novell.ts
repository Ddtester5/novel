import { dataBase } from "@/shared/lib/db_connect";
import { Page } from "playwright";
import { parseSingleNovell } from "../modules/parse_single_novell";

export async function createNovell({
  page,
  pageToImages,
  novell_original_title,
  novell_url,
}: {
  page: Page;
  pageToImages: Page;
  novell_original_title: string;
  novell_url: string;
}) {
  try {
    const novell = await dataBase.novells.findUnique({
      where: { original_title: novell_original_title },
    });
    if (!novell) {
      const new_novell_info = await parseSingleNovell({
        page: page,
        pageToImages: pageToImages,
        novell_original_title: novell_original_title,
        novell_url: novell_url,
      });
      const new_novell = await dataBase.novells.create({
        data: {
          image_path: new_novell_info.image_path,
          original_author: new_novell_info.original_author,
          original_description:
            new_novell_info.novell_description,
          original_title: new_novell_info.original_title,
          last_chapter: new_novell_info.last_chapter,
          ru_description: new_novell_info.ru_description,
          ru_title: new_novell_info.ru_title,
          slug: new_novell_info.slug,
          tags: {
            connect: new_novell_info.original_tags.map(
              (tag_title) => ({
                original_title: tag_title,
              }),
            ),
          },
        },
      });
      console.log("novell created : ", new_novell.ru_title);
      return new_novell;
    } else {
      return novell;
    }
  } catch (error) {
    console.error("create novell error", error);
  }
}

import { dataBase } from "@/shared/lib/db_connect";
import { Page } from "playwright";
import { parseSingleNovell } from "../modules/parse_single_novell";
import { transliterateToUrl } from "@/shared/lib/transliterate";

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
        novell_url: novell_url,
      });
      await dataBase.genres.upsert({
        where: {
          ru_title: new_novell_info.genre,
        },
        update: {},
        create: {
          ru_title: new_novell_info.genre,
          slug: transliterateToUrl(new_novell_info.genre.toLowerCase()),
        },
      });
      const new_novell = await dataBase.novells.create({
        data: {
          url_to_all_chapters: new_novell_info.url_to_all_chapters,
          image_path: new_novell_info.image_path,
          original_title: novell_original_title,
          ru_description: new_novell_info.novell_description,
          ru_title: new_novell_info.title,
          slug: new_novell_info.slug,
          genre: {
            connect: {
              ru_title: new_novell_info.genre,
            },
          },
          tags: {
            connect: new_novell_info.tags.map((tag_title) => ({
              ru_title: tag_title,
            })),
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

import { dataBase } from "@/shared/lib/db_connect";

export async function createChapter({
  content,
  title,
  number,
  novell_slug,
}: {
  content: string;
  title: string;
  number: number;
  novell_slug: string;
}) {
  console.log({
    content,
    title,
    number,
    novell_slug,
  });
  try {
    await dataBase.chapters.create({
      data: {
        novell_slug: novell_slug,
        chapter_number: number,
        content: content,
        title: title,
      },
    });
    await dataBase.novells.update({
      where: { slug: novell_slug },
      data: {
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error("parse chapter error", error);
  }
}

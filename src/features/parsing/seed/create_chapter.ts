import { dataBase } from "@/shared/lib/db_connect";

export async function createChapter({
  content,
  title,
  number,
  novell_id,
}: {
  content: string;
  title: string;
  number: number;
  novell_id: string;
}) {
  console.log({
    content,
    title,
    number,
    novell_id,
  });
  try {
    await dataBase.chapters.create({
      data: {
        novell_id: novell_id,
        chapter_number: number,
        content: content,
        title: title,
      },
    });
    await dataBase.novells.update({
      where: { id: novell_id },
      data: {
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error("parse chapter error", error);
  }
}

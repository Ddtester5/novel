import { getAllTags } from "@/entities/actions/get_all_tags";
import { Tags } from "../../../../generated/prisma";

export default async function TagsPage() {
  const tags: Tags[] = await getAllTags();

  return (
    <div className="w-full h-fyll flex flex-wrap gap-6 p-6 border shadow-lg">
      {tags.map((tag) => {
        return (
          <div
            className="p-4 border shadow-2xl "
            key={tag.slug}
          >
            {tag.ru_title}
          </div>
        );
      })}
    </div>
  );
}

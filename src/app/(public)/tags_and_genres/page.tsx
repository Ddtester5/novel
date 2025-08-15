import { getAllTags } from "@/entities/tags/_actions/get_all_tags";
import { Genres, Tags } from "../../../../generated/prisma";
import { getAllGenres } from "@/entities/genres/_actions/get_all_genres";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";

export default async function TagsPage() {
  const tags: Tags[] = await getAllTags();
  const genres: Genres[] = await getAllGenres();
  return (
    <div className="container flex flex-col gap-6">
      <div>genres</div>
      <div className="w-full h-full flex flex-wrap gap-6 p-6 border shadow-lg">
        {genres.map((genre) => {
          return (
            <Link key={genre.slug} href={`/genres/${genre.slug}`}>
              <Badge>{genre.ru_title}</Badge>
            </Link>
          );
        })}
      </div>
      <div>tags</div>
      <div className="w-full h-full flex flex-wrap gap-6 p-6 border shadow-lg">
        {tags.map((tag) => {
          return (
            <Link key={tag.slug} href={`/tags/${tag.slug}`}>
              <Badge>{tag.ru_title}</Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

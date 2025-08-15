import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Link from "next/link";

export function TagBage({ slug, title }: { slug: string; title: string }) {
  return (
    <Badge
      key={slug}
      className="h-6 bg-contrast_color transition-colors duration-300 hover:scale-95 hover:bg-slate-950 text-slate-50 text-xs font-medium px-2 py-1 z-40 "
    >
      <Link className="items-center" href={`/tags/${slug}`}>
        {title}
      </Link>
    </Badge>
  );
}

export function TagBageSkeleton() {
  return <Skeleton className="h-6 w-14 sm:w-16 rounded-md" />;
}

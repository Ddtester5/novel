"use client";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

export function MiniNovellCard({
  title,
  previewImage,
  slug,
  chapters_count,
}: {
  title: string;
  previewImage: string | null;
  slug: string;
  chapters_count: number;
}) {
  return (
    <Link href={`/novell/${slug}`}>
      <Card className="w-[100px] md:w-[140px] flex-shrink-0 p-0 gap-2 border-2 rounded">
        <CardContent className="p-0 image-safe relative">
          <div className="aspect-[2/2.7] relative ">
            <Image
              src={previewImage || "/placeholder.png"}
              alt="картинка карточки"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded "
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-20 md:h-36 bg-gradient-to-t from-red-500/100 to-background/0  rounded "></div>
          <p className="absolute bottom-0.5 left-0.5 right-0.5 text-xs text-white/90 font-semibold line-clamp-3 m-1 text-center ">
            {title}
          </p>
          <Badge className="absolute top-0.5 left-0.5  text-xs text-white/90 font-semibold  m-1 text-center bg-red-500/80 ">
            {chapters_count}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
export function MiniNovellCardSceleton() {
  return (
    <Card className="w-[100px] md:w-[140px] flex-shrink-0 justify-center items-center p-0 rounded">
      <CardContent className=" p-0 w-full aspect-[2/2.7]  flex flex-col items-center justify-center">
        <Skeleton className="w-full h-[100%] mb-3 rounded" />

        <Skeleton className="w-[90%] h-3 mb-3" />
      </CardContent>
    </Card>
  );
}

import { getSingleNovellBySlug } from "@/entities/novels/_actons/get_single_novell_by_slug";
import { getChaptersDeclension } from "@/entities/novels/_fn/get_chapters_declension";
import { NovellChapterList } from "@/entities/novels/_ui/novell_chapters_list";
import { Title } from "@/shared/components/custom/app-title";
import { TimeAgo } from "@/shared/components/custom/get-time";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { privateConfig } from "@/shared/lib/config/private";
import { BookOpen, Calendar } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const pageParams = await params;
  const novell = await getSingleNovellBySlug(pageParams.slug);
  if (!novell) notFound();

  const description = novell.ru_description;
  const imageUrl = novell.image_path || "/logo_opengraf.jpg";
  const url = `${privateConfig.SAIT_URL}/novells/${pageParams.slug}`;

  return {
    title: novell.ru_title,
    description,
    keywords: [
      ...novell.tags.map((tag) => tag.ru_title).filter(Boolean),
      "новеллы",
      "новелла",
      "вебновелла",
      "вэбновел",
      "ранобэ",
      "роман",
    ],
    openGraph: {
      title: novell.ru_title,
      description,
      images: [{ url: imageUrl }],
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: novell.ru_title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export const revalidate = 60; // ISR на 1 минуту

export default async function NovellPage({
  params,
}: {
  params: Promise<{ slug: string }>;
  searchParams: { sort?: "asc" | "desc" };
}) {
  const page_params = await params;

  const novell = await getSingleNovellBySlug(page_params.slug);

  if (!novell) return notFound();

  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Novel Header */}
      <div className="flex flex-col xs1:flex-row gap-6">
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="relative w-48 h-64 mx-auto xs1:mx-0  image-safe">
            <Image
              src={novell.image_path || "/placeholder.png"}
              alt={novell.ru_title}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <Title className="text-start" size="xl" text={novell.ru_title} />

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{novell.chapters.length}</span>
              <span className="text-muted-foreground">
                {getChaptersDeclension(novell.chapters.length)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                <span className="font-medium">Обновлено: </span>
                <TimeAgo date={novell.created_at} />
              </span>
            </div>
          </div>

          {/* Status and Genres */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{novell.genre?.ru_title}</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {novell.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.ru_title}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {novell.chapters.length > 0 && (
              <Link href={`/novel/${novell.id}/chapter/1`}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Читать
                </Button>
              </Link>
            )}
            <Button variant="outline">В закладки</Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <Tabs defaultValue="chapters">
        <TabsList className="justify-between">
          <TabsTrigger value="chapters">Список глав</TabsTrigger>
          <TabsTrigger value="description">Описание</TabsTrigger>
        </TabsList>
        <TabsContent className="text-justify indent-3 whitespace-pre-wrap" value="description">
          {novell.ru_description}
        </TabsContent>
        <TabsContent value="chapters">
          <NovellChapterList novell={novell} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

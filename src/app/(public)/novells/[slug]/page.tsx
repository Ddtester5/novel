import { getSingleNovellBySlug } from "@/entities/novels/_actons/get_single_novell_by_slug";
import { TagBage } from "@/entities/tags/_ui/tag_bage";
import { TimeAgo } from "@/shared/components/custom/get-time";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { privateConfig } from "@/shared/lib/config/private";
import { Metadata } from "next";
import Image from "next/image";
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

export default async function NovellPage({ params }: { params: Promise<{ slug: string }> }) {
  const pageParams = await params;
  const novell = await getSingleNovellBySlug(pageParams.slug);
  if (!novell) {
    return (
      <div className="text-center py-10 text-foreground">
        Не удалось получить информацию о новелле
      </div>
    );
  }

  return (
    <main className="flex flex-col flex-1 gap-2 md:gap-4">
      <Card className="w-full mx-auto p-2 gap-2">
        <CardHeader className="p-2">
          <h1 className="lg:text-xl text-base lg:font-bold font-semibold">{novell.ru_title}</h1>
          <div className="md:text-base text-sm flex flex-col  justify-between items-start sm:items-center text-foreground/80">
            <div className="text-xs w-full mt-1.5 flex flex-row items-center justify-between ">
              <TimeAgo date={novell.created_at} />
              {/* <BookmarksButton id={post.id} type="NEWS" /> */}
            </div>
            <div className="items-start w-full flex flex-wrap gap-2">
              {novell?.tags.map((tag) => (
                <TagBage key={tag.slug} slug={tag.slug} title={tag.ru_title} />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          {novell.image_path && (
            <Image
              width={160}
              height={280}
              src={novell.image_path}
              alt={`Картинка новеллы ${novell.ru_title}`}
            />
          )}
          {novell.chapters &&
            novell.chapters.map((e) => {
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between gap-2 bg-amber-500 fill-gray-200 p-2"
                >
                  <span className="p-2">{e.chapter_number}</span>
                  <span className="p-2">{e.title}</span>
                  <TimeAgo className="p-2" date={e.created_at} />
                </div>
              );
            })}
        </CardContent>
      </Card>
      {/* <div className="flex flex-row gap-4  justify-between items-center ">
        <Title size="lg" text="Похожие новости" />
      </div>
      <SomePosts slug={pageParams.slug} count={20} type="NEWS" tags={post.tags} /> */}
    </main>
  );
}

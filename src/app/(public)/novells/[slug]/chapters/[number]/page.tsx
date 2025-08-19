import { getSingleChapter } from "@/entities/chapters/_actons/get_single_chapter";
import { Title } from "@/shared/components/custom/app-title";
import { TimeAgo } from "@/shared/components/custom/get-time";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ChapterPageProps {
  params: Promise<{
    slug: string;
    number: string;
  }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const page_params = await params;

  const chapter_number = Number.parseInt(page_params.number);
  const novell_slug = page_params.slug;
  if (isNaN(chapter_number) || !novell_slug) {
    notFound();
  }

  const chapter = await getSingleChapter(novell_slug, chapter_number);

  if (!chapter) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className=" px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/novells/${novell_slug}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />К оглавлению
                </Button>
              </Link>
              {/* <div className="hidden md:flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-heading font-semibold text-foreground">{novel.title}</span>
              </div> */}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Chapter Header */}
        <div className=" mb-2 p-2">
          <div className="flex  flex-row  gap-2 text-sm text-muted-foreground">
            <span>Глава {chapter_number}</span>
            <Separator orientation="vertical" />
            <span>
              Опубликовано <TimeAgo date={chapter.created_at} />
            </span>
          </div>
          <Title text={chapter.title} size="xl" />
        </div>

        {/* Chapter Content */}
        <Card className="bg-card border-border py-2">
          <CardContent className="p-2 ">
            <div
              className="prose text-card-foreground "
              dangerouslySetInnerHTML={{ __html: chapter.content }}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import { SomeNovells } from "@/entities/novels/_ui/some_novells";
import { generateSEOMetadata } from "@/features/seo/generate_metadata";
import { Title } from "@/shared/components/custom/app-title";
import { Button } from "@/shared/components/ui/button";
import { privateConfig } from "@/shared/lib/config/private";
import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = generateSEOMetadata({
  title: "Главная",
  description: "Переводы новелл, ранобэ и романов. Рейтинги, поиск.",
  keywords: ["новеллы, новелла, вебновелла, вэбновел, ранобэ, роман"],
  ogImage: "/logo_opengraf.jpg",
  canonical: `${privateConfig.SAIT_URL}`,
});
export default async function Home() {
  return (
    <main className="flex flex-col  gap-2 md:gap-4">
      <div className="flex flex-row gap-4  justify-between items-center ">
        <Title size="lg" text="Новинки" className="text-left" />
        <Link href={"/novells"}>
          <Button className="cursor-pointer" variant="outline">
            Новинки
          </Button>
        </Link>
      </div>
      <SomeNovells count={20} />
    </main>
  );
}

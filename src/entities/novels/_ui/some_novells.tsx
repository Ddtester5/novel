"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { getSomeNovells } from "../_actons/get_some_novells";
import { MiniNovellCard, MiniNovellCardSceleton } from "./mini_novell_card";

export function SomeNovells({ count }: { count: number }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["someNovells", count],
    queryFn: () => getSomeNovells({ count: count }),
  });

  if (isError) return <p>Ошибка загрузки новелл.</p>;
  if (data && data.length === 0) return <p>Нет новелл.</p>;
  return (
    <section className="flex justify-center p-2">
      <div className="flex max-w-[80%] md:max-w-[400px] md1:max-w-[450px] md2:max-w-[500px] lg:max-w-[600px] xl:max-w-[750px] gap-2 lg:gap-4">
        <Carousel
          className="w-full"
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
        >
          <CarouselContent>
            {isLoading
              ? Array.from({ length: count }).map((_, index) => (
                  <CarouselItem
                    className="basis-1/12  min-w-[110px] md:min-w-[160px] hover:scale-95 transition-all duration-300"
                    key={index}
                  >
                    <MiniNovellCardSceleton />
                  </CarouselItem>
                ))
              : data?.map((novell) => (
                  <CarouselItem
                    className="basis-1/12  min-w-[110px] md:min-w-[160px] hover:scale-95 transition-all duration-300"
                    key={novell.id}
                  >
                    <MiniNovellCard
                      title={novell.ru_title}
                      previewImage={novell.image_path}
                      slug={novell.slug}
                      chapters_count={novell._count.chapters}
                    />
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}

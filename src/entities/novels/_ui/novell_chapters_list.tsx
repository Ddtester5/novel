"use client";

import { getSinglePostBySlugType } from "../_actons/get_single_novell_by_slug";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { useMemo, useState } from "react";

export function NovellChapterList({ novell }: { novell: NonNullable<getSinglePostBySlugType> }) {
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const perPage = 9;
  const totalPages = Math.ceil(novell.chapters.length / perPage);

  // сортировка + пагинация
  const chapters = useMemo(() => {
    const sorted = [...novell.chapters].sort((a, b) =>
      sort === "asc" ? a.chapter_number - b.chapter_number : b.chapter_number - a.chapter_number,
    );
    const start = (page - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [novell.chapters, sort, page]);
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Главы ({novell.chapters.length})</h2>
        <Select value={sort} onValueChange={(val: "asc" | "desc") => setSort(val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">По возрастанию</SelectItem>
            <SelectItem value="desc">По убыванию</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Список глав */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((ch) => (
          <Card key={ch.id} className="hover:shadow-md transition">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div>
                <h3 className="font-medium">
                  Глава {ch.chapter_number}: {ch.title}
                </h3>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <a href={`/novells/${novell.slug}/chapters/${ch.chapter_number}`}>Читать</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

"use client";

import { getSinglePostBySlugType } from "../_actons/get_single_novell_by_slug";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useMemo, useState } from "react";
import { Title } from "@/shared/components/custom/app-title";
import { Table, TableBody, TableCell, TableRow } from "@/shared/components/ui/table";
import { TimeAgo } from "@/shared/components/custom/get-time";
import Link from "next/link";
import { SmartPagination } from "@/shared/components/custom/smart-pagination";

export function NovellChapterList({ novell }: { novell: NonNullable<getSinglePostBySlugType> }) {
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const perPage = 20;
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <Title size="lg" text={`Главы (${novell.chapters.length})`} className="text-start" />
        <Select value={sort} onValueChange={(val: "asc" | "desc") => setSort(val)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">По возрастанию</SelectItem>
            <SelectItem value="desc">По убыванию</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Список глав */}
      <div className="flex flex-col  gap-4">
        <Table className="w-full">
          <TableBody>
            {chapters.map((ch) => (
              <TableRow key={ch.id}>
                <TableCell className="font-medium">{ch.chapter_number}</TableCell>
                <TableCell className="max-w-[150px] xs:max-w-[200px] md:max-w-[400px] truncate">
                  <Link href={`/novells/${novell.slug}/chapters/${ch.chapter_number}`}>
                    {ch.title}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <TimeAgo date={ch.created_at} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Пагинация */}
      <SmartPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

"use client";

import { cn } from "@/shared/lib/utils";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export const TimeAgo = ({
  date,
  className,
  locale = "ru-RU", // можно менять локаль
}: {
  date: Date | string;
  className?: string;
  locale?: string;
}) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (!currentTime) {
    return <Skeleton className="w-20 h-3 inline-block" />;
  }

  const d = new Date(date);
  const diffMs = currentTime.getTime() - d.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (days >= 1) {
    // Если прошло более 24ч — выводим дату
    return (
      <span className={cn(className, "text-sm")}>
        {d.toLocaleDateString(locale, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </span>
    );
  }

  if (hours >= 1) {
    return <span>{rtf.format(-hours, "hour")}</span>;
  }

  if (minutes >= 1) {
    return <span>{rtf.format(-minutes, "minute")}</span>;
  }

  return <span>Только что</span>;
};

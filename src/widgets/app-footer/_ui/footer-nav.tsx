"use client";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { NavItems } from "../_settings/footer-nav-items";

export function FooterNav({ items }: { items: NavItems[] }) {
  const pathmane = usePathname();
  return (
    <nav className="flex flex-wrap items-center justify-center text-xs  md:text-sm font-medium md:gap-2">
      {items.map((item, index) => (
        <Link
          key={index}
          target="_blank"
          rel="nofollow noopener"
          href={item.path}
          className={cn(
            "transition-colors hover:text-foreground/80 text-foreground/60 p-1 min-w-20 flex items-center justify-center",
            {
              " text-foreground rounded-lg ": pathmane === item.path,
            },
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

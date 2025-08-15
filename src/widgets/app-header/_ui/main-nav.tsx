"use client";
import Link from "next/link";
import { NavItems } from "../_settings/main-nav-items";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";

export function MainNav({ items }: { items: NavItems[] }) {
  const pathmane = usePathname();
  return (
    <nav
      className="flex items-start md:items-center gap-2 text-sm font-medium flex-col md:flex-row "
      aria-labelledby="menu-title"
      aria-describedby="menu-description"
    >
      <p id="menu-title" className="sr-only">
        Меню
      </p>
      <p id="menu-description" className="sr-only">
        Главное меню, выберите пункт меню
      </p>
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.path}
          className={cn(
            "transition-colors hover:bg-accent/60 hover:rounded-lg hover:text-foreground text-foreground/60 p-2 min-w-20 flex items-center justify-center",
            {
              "bg-accent/60 text-foreground rounded-lg ": pathmane === item.path,
            },
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-background via-background/50 to-background dark:from-foreground/10 dark:via-foreground/5 dark:to-foreground/10">
      <div className="text-center p-6 max-w-md">
        <h1
          className="mb-4 text-6xl sm:text-8xl font-extrabold text-foreground animate-pulse"
          aria-label="Ошибка 404"
        >
          404
        </h1>
        <p className="mb-6 text-lg sm:text-xl text-foreground/80 animate-bounce">
          Ой! Страница, которую вы ищете, не существует.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 font-bold text-background dark:text-foreground bg-foreground dark:bg-background rounded-full hover:bg-foreground/80 dark:hover:bg-background/80 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground dark:focus:ring-background"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

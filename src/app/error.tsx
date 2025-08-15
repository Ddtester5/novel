"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-background via-background/50 to-background dark:from-foreground/10 dark:via-foreground/5 dark:to-foreground/10">
      <div className="text-center p-6 max-w-md">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500 animate-bounce" />
        <h1
          className="mt-4 mb-2 text-3xl sm:text-4xl font-bold text-foreground"
          aria-label="Произошла ошибка"
        >
          Упс! Что-то пошло не так.
        </h1>
        <p className="mb-6 text-lg text-foreground/80">
          Мы столкнулись с неожиданной проблемой. Наша команда уже работает над её устранением.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center px-4 py-2 font-bold text-background dark:text-foreground bg-foreground dark:bg-background rounded-full hover:bg-foreground/80 dark:hover:bg-background/80 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground dark:focus:ring-background"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Попробовать снова
        </button>
      </div>
    </div>
  );
}

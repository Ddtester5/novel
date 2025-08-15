"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="на верх"
      name="на верх"
      className={cn(
        "fixed bottom-5 right-5 z-[100]  text-contrast_color transition-all  duration-300  rounded-full shadow-lg  hover:scale-110",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <ArrowUp size={40} />
    </button>
  );
}

import { cn } from "@/shared/lib/utils";
import React from "react";
type TitleSize = "md" | "lg" | "xl";
interface Props {
  size?: TitleSize;
  className?: string;
  text: string;
}
export const Title: React.FC<Props> = ({ text, size = "lg", className }) => {
  const mapTagBySize = {
    md: "h3",
    lg: "h2",
    xl: "h1",
  } as const;
  const mapClassNameBySize = {
    md: "text-sm font-semibold lg:text-lg w-full gap-4 text-center xs1:text-start",
    lg: "text-base font-bold lg:text-xl w-full gap-4 text-center xs1:text-start",
    xl: "text-base font-bold lg:text-xl w-full gap-4 text-center xs1:text-start",
  } as const;
  return React.createElement(
    mapTagBySize[size],
    { className: cn(mapClassNameBySize[size], className) },
    text,
  );
};

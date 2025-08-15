import { cn } from "@/shared/lib/utils";
import React from "react";
interface Props {
  className?: string;
}
export const Container: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
  return (
    <div className={cn(" px-2 lg:px-4 mx-auto container max-w-[1240px]", className)}>
      {children}
    </div>
  );
};

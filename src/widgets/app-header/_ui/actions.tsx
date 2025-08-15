import React from "react";

export function Actions({
  adminIcon,
  bookmarks,
  theme,
}: {
  adminIcon?: React.ReactNode;
  bookmarks?: React.ReactNode;
  theme?: React.ReactNode;
}) {
  return (
    <div className=" flex items-center justify-between px-1 gap-1">
      <div>{adminIcon}</div>
      <div>{bookmarks}</div>
      <div>{theme}</div>
    </div>
  );
}

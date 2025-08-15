"use client";
import { useEffect, useState } from "react";

export const CurrentYear = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return <span>{`© ${year}`}</span>;
};

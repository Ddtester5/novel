import Image from "next/image";
import Link from "next/link";
import React from "react";

export function Logo({ className, isText = false }: { className?: string; isText?: boolean }) {
  return (
    <Link className="flex items-center space-x-2" href="/">
      <Image className={className} width={50} height={50} alt="Logo" src={"/logo.png"} priority />
      {isText ? <span className="font-bold inline-block">Tech</span> : ""}
    </Link>
  );
}

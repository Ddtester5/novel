import { Metadata } from "next";

interface MetadataProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  ogImage,
  canonical,
}: MetadataProps): Metadata {
  return {
    title,
    description,
    keywords: keywords?.join(", "),
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: canonical,
    },
  };
}

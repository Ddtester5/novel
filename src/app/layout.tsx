import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { privateConfig } from "@/shared/lib/config/private";
import { AppProvider } from "./_providers/app-provider";
import { ScrollToTopButton } from "@/shared/components/custom/scroll_to_top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${privateConfig.SAIT_NAME}`,
    template: `%s | ${privateConfig.SAIT_NAME}`,
  },
  description: "Переводы новелл, ранобэ и романов. Рейтинги, поиск.",
  keywords: "новеллы, новелла, вебновелла, вэбновел, ранобэ, роман",
  metadataBase: new URL(`${privateConfig.SAIT_URL}`),
  openGraph: {
    title: `${privateConfig.SAIT_NAME} - Актуальные переводы новелл`,
    description: "Переводы новелл, ранобэ и романов. Рейтинги, поиск.",
    url: `${privateConfig.SAIT_URL}`,
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "/img/logo_opengraf.jpg",
        width: 1200,
        height: 630,
        alt: `${privateConfig.SAIT_NAME} - Логотип`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <AppProvider>{children}</AppProvider>
        <ScrollToTopButton />
      </body>
    </html>
  );
}

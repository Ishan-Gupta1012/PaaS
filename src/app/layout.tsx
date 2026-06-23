import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfol.io | Modern Developer Portfolios",
  description: "Why are developer portfolios still stuck in 2020?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased scroll-smooth`}
    >
      <body className="min-h-screen bg-white text-black font-sans flex flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}

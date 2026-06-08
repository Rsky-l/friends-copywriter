import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "朋友圈文案生成器",
  description: "AI驱动的朋友圈文案生成工具，分类文案库+智能改写+配图文案一站式解决",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-24 pt-4">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}

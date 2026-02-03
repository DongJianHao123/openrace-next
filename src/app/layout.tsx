import { LanguageProvider } from "@/store/contexts/LanguageContext";
import { ToastProvider } from "@/store/contexts/ToastContext";
import Layout from "@/views/Layout";
import { ConfigProvider } from "antd";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Loading } from "@/components/Loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenRace - 英雄不论出处，谁有本事谁揭榜",
  description: "英雄不论出处，谁有本事谁揭榜。为开源社区汇聚全球创新力量，以开放协作加速科技自立自强。让创新成果在赛马中涌现，让优秀人才在实战中脱颖而出。",
  keywords: [
    "OpenRace",
    "OpenCamp",
    "竞逐科技",
    "开源",
    "社区",
    "创新",
    "合力",
    "AI",
    "编程",
    "技术",
    "操作系统",
    "OS",
    "编译器",
    "数据库",
    "云计算",
    "大数据",
    "区块链",
    "网络安全",
    "英雄不论出处",
    "谁有本事谁揭榜",
  ],
  icons: {
    icon: "https://oss.opencamp.cn/file/20260121/20260121_380106.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 增加icon */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ConfigProvider>
            <LanguageProvider>
              <ToastProvider>
                <Layout>
                  <Suspense fallback={<Loading text="正在加载..." />}>
                    {children}
                  </Suspense>
                </Layout>
              </ToastProvider>
            </LanguageProvider>
          </ConfigProvider>
      </body>
    </html>
  );
}

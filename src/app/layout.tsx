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
  title: "OpenRace - 竞逐科技前沿，凝聚创新合力",
  description: "竞逐科技前沿，凝聚创新合力",
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
        {/* <AntdRegistry> */}
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
        {/* </AntdRegistry> */}
      </body>
    </html>
  );
}

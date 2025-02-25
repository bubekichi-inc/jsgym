import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notSansJp = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JS学習サイト(プロトタイプ)",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notSansJp.className} bg-[#f5f8fa] antialiased text-textMain`}
      >
        {children}
      </body>
    </html>
  );
}

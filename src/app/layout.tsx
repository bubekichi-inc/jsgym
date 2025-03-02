import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

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
        className={`${notSansJp.className} bg-bgMain text-textMain antialiased`}
      >
        {children}
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={true}
          closeOnClick
          pauseOnHover
          theme="colored"
          toastStyle={{ background: "#0E77B8" }}
        />
      </body>
    </html>
  );
}

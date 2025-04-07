import { GoogleAnalytics } from "@next/third-parties/google";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { Header } from "./_components/Header";
import { buildMetaData } from "./_utils/metadata";

const notSansJp = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata = buildMetaData({
  title: "JS Gym (β版)",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.GA_ID;
  const clarityProjectId = process.env.CLARITY_PROJECT_ID;

  return (
    <html lang="ja">
      <body
        className={`${notSansJp.className} bg-bgMain text-textMain antialiased`}
      >
        <Header />
        <Suspense>
          <div className="pt-[48px]">{children}</div>
        </Suspense>
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
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {clarityProjectId && (
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityProjectId}");
        `}
        </Script>
      )}
    </html>
  );
}

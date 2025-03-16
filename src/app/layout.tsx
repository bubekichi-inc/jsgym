import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeLy-YzsFnzUVdX-g5U3v4dLtN2QilTAZlvWjjzxW5rsYf_hg/viewform?usp=header"
          target="_blank"
          className="fixed bottom-10 right-10 hidden items-center rounded-lg bg-blue-500 px-4 py-3 text-sm font-bold text-white lg:flex"
        >
          フィードバック
          <FontAwesomeIcon icon={faExternalLink} className="ml-2 size-4" />
        </a>
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

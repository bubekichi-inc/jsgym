"use client";

import { useState } from "react";
import { SinginModal } from "@/app/_components/SinginModal";

export function CtaSection() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <>
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                JavaScriptの実践力を今すぐ鍛えよう
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                毎日の練習で、着実にスキルアップ。実務で通用するJavaScriptエンジニアへ。
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <button
                className="inline-flex h-10 items-center justify-center rounded-md bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={() => setShowLoginDialog(true)}
              >
                無料ではじめる
              </button>
            </div>
          </div>
        </div>
      </section>
      <SinginModal
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </>
  );
}

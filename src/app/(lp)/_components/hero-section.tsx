"use client";

import { useState } from "react";
import { SinginModal } from "@/app/_components/SinginModal";

export function HeroSection() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <section className="mx-auto max-w-screen-xl py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="items-center justify-center gap-10 space-y-6 lg:flex">
          <div className="flex flex-col justify-center space-y-4 md:space-y-6 lg:w-1/2">
            <div className="space-y-4">
              <h1 className="space-y-2 whitespace-nowrap text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl/none">
                <div className="">JavaScript開発の</div>
                <div className="">自走力を鍛える</div>
                <div className="">トレーニングジム</div>
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-lg">
                JavaScriptに特化した、プログラミング学習サイトです。
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <button
                className="inline-flex items-center justify-center rounded-md bg-yellow-400 p-4 py-2 text-base font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 md:px-6 md:py-3 md:text-2xl"
                onClick={() => setShowLoginDialog(true)}
              >
                無料ではじめる
              </button>
            </div>
          </div>
          <div className="z-[-1] flex items-center justify-center">
            <div className="overflow-hidden rounded-lg border bg-gray-50 shadow-card">
              <video
                className="size-full object-cover"
                src="/images/demo.mov"
                controls={false}
                autoPlay
                muted
                loop
                playsInline
              >
                お使いのブラウザは動画再生をサポートしていません。
              </video>
            </div>
          </div>
        </div>
      </div>

      <SinginModal
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </section>
  );
}

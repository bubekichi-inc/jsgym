"use client";

import Link from "next/link";
import { CTAButton } from "@/app/_components/CTAButton";

export function HeroSection() {
  return (
    <section className="px-6 py-8 md:py-16">
      <div className="mx-auto flex max-w-fit flex-col items-start justify-center md:flex-row md:items-center md:gap-x-16 md:rounded-2xl md:bg-white md:px-[72px] md:py-[100px] md:shadow-blue">
        <div className="contents md:flex md:w-96 md:flex-col md:justify-center">
          <h1 className="text-4xl/normal font-bold md:text-5xl/[1.3]">
            <div>JavaScriptの</div>
            <div>自走力を鍛える</div>
            <div>トレーニングジム</div>
          </h1>
          <p className="mt-3 text-lg/[1.5] text-gray-500 md:text-xl/[1.5]">
            JavaScriptに特化した、プログラミング学習サイトです。
          </p>
          <div className="order-4 mt-[30px] flex w-full flex-col gap-4 md:order-none md:mt-6 md:gap-6">
            <CTAButton />
            <Link
              href="/about"
              className="inline-flex h-[68px] w-full items-center justify-center rounded-lg bg-buttonMain px-4 text-xl font-bold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 md:rounded-xl md:px-5 md:text-[1.625rem]"
            >
              JS Gymについてくわしく
            </Link>
          </div>
        </div>
        <div className="mt-8 flex w-full flex-1 items-center justify-center md:mt-0 md:max-w-[560px]">
          <div className="overflow-hidden rounded-lg border bg-gray-50">
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
    </section>
  );
}

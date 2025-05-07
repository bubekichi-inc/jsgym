"use client";

import Image from "next/image";
import { CTAButton } from "@/app/_components/CTAButton";

export function HeroSection() {
  return (
    <section className="px-6 py-8 md:py-16">
      <div className="mx-auto flex flex-col items-start justify-center gap-8 md:max-w-fit md:flex-row md:items-center md:gap-x-[133px] md:rounded-2xl md:bg-white md:px-[72px] md:py-[111px] md:shadow-blue">
        <div className="contents w-full md:flex md:w-[395px] md:flex-col md:justify-center">
          <h1 className="text-4xl/normal font-bold md:text-5xl/[1.3]">
            <div>JavaScript学習の</div>
            <div>お悩みを解決</div>
          </h1>
          <div className="order-4 w-full md:order-none md:mt-16">
            <CTAButton />
          </div>
        </div>
        <div className="mx-auto w-[64dvw] md:max-w-[480px] md:flex-1">
          <Image
            src="/images/about_hero.png"
            alt="アバウトページのヒーロー画像"
            width={480}
            height={420}
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}

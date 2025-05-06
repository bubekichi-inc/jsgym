import { CTAButton } from "@/app/_components/CTAButton";

export function CTASection() {
  return (
    <section className="mt-16 grid justify-items-center bg-baseBlack px-6 py-12 md:mt-[120px] md:py-16">
      <h3 className="text-xl/[1.5] font-bold text-white md:text-[2rem]/[1.5]">
        まずは問題にトライしてみよう。
      </h3>
      <p className="mt-5 text-sm/[1.5] text-white md:mt-3 md:text-lg/[1.5]">
        毎日の練習で、着実にスキルアップ。実務で通用するJavaScriptエンジニアへ。
      </p>
      <div className="mt-8 w-full max-w-96">
        <CTAButton />
      </div>
    </section>
  );
}

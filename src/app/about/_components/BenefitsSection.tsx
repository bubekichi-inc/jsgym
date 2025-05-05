import { SectionTitle } from "@/app/_components/SectionTitle";

interface Benefit {
  dt: string;
  dd: string;
}

const benefits: Benefit[] = [
  {
    dt: "基礎は学んだけど、なかなか自走して書けるようにならない...",
    dd: "競技プログラミング方式で、ひたすら問題を解いて自走力を鍛えられる",
  },
  {
    dt: "AIを頼りすぎて、理解が曖昧でコードに責任を持てない...",
    dd: "AIを頼れない環境で、自分の頭で組み立てて判断できるようになる",
  },
  {
    dt: "動きはするけど、実務の現場で通用する書き方ができているのか不安...",
    dd: "現場視点のコードレビューを受け、自信を身につけられる",
  },
];

export function BenefitsSection() {
  return (
    <section className="mt-8 px-6 md:mt-20">
      <SectionTitle>JS Gymなら、こんな自分になれる。</SectionTitle>
      <div className="mx-auto mt-8 grid w-full max-w-[1152px] gap-5 text-base md:mt-12 md:gap-8 md:text-center">
        {benefits.map((benefit, index) => (
          <dl
            key={index}
            className="overflow-hidden rounded-lg shadow-blue md:rounded-xl"
          >
            <dt className="relative bg-baseBlack px-6 py-4 text-textGray after:absolute after:left-1/2 after:top-full after:block after:h-2.5 after:w-5 after:-translate-x-1/2 after:bg-buttonMain after:[clip-path:polygon(50%_10px,0%_0%,20px_0%)] md:text-xl/[1.5] md:after:h-4 md:after:w-8 md:after:[clip-path:polygon(50%_16px,0%_0%,32px_0%)]">
              {benefit.dt}
            </dt>
            <dd className="bg-white px-6 py-3.5 font-medium text-textOrange md:pb-4 md:pt-6 md:text-2xl/[1.5]">
              {benefit.dd}
            </dd>
          </dl>
        ))}
      </div>
    </section>
  );
}

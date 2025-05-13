import Image from "next/image";
import { SectionTitle } from "@/app/_components/SectionTitle";

interface Feature {
  iconSrc: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    iconSrc: "/images/about/features/icon1.svg",
    title: "すぐに始められる学習環境",
    description:
      "コードエディタ等での開発環境の構築は不要です。JS Gym上でコードを書いて動作を確認できるサンドボックス環境を用意しています。",
  },
  {
    iconSrc: "/images/about/features/icon2.svg",
    title: "実務で活かせる問題構成",
    description:
      "Webアプリ開発の場で頻出の文法を中心に問題を構成しています。実務ではほぼ使わないような構文は除外し、実務に特化したJS開発の訓練を積めます。",
  },
  {
    iconSrc: "/images/about/features/icon3.svg",
    title: "AIコードレビュー",
    description:
      "AIを活用し、実務で押さえてほしい項目を網羅したレビューを行います。実務で通用する書き方ができるまで、繰り返しレビューを受けることができます。",
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="mt-16 px-6 md:mt-[120px]">
      <SectionTitle>JS Gymの特徴</SectionTitle>
      <ul className="mx-auto mt-8 grid max-w-[1152px] grid-cols-1 gap-5 md:mt-16 md:grid-cols-3 md:gap-9">
        {features.map((feature, index) => (
          <li
            key={index}
            className="grid justify-items-center rounded-xl bg-white p-6 shadow-blue md:p-8"
          >
            <Image
              src={feature.iconSrc}
              alt={feature.title}
              width={64}
              height={64}
              className="size-16"
            />
            <h3 className="mt-4 text-lg/[1.5] font-bold md:mt-6 md:text-xl/[1.5]">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm/[1.5] md:mt-4 md:text-base">
              {feature.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

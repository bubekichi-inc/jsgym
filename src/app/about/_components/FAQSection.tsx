import { SectionTitle } from "@/app/_components/SectionTitle";
import { FAQAccordion, Question } from "@/app/about/_components/FAQAccordion";

const questions: Question[] = [
  {
    question: "無料で使えますか？",
    answer:
      "全機能、無料でご利用いただけます。将来的に変更する可能性がありますが、その際には事前にご案内いたします。",
  },
  {
    question: "JavaScript学習経験がなくても活用できますか？",
    answer:
      "ご利用いただけますが、完全初心者向けではないため、他の学習サイトなどで基本的な文法などを一通りインプットした後に実施いただくと、より効果を得やすいです。",
  },
];

export function FAQSection() {
  return (
    <section className="mb-[66px] mt-16 px-6 md:mb-[147px] md:mt-[120px]">
      <SectionTitle>よくある質問</SectionTitle>
      <ul className="mx-auto mt-8 grid max-w-[1152px] gap-8 md:mt-16">
        {questions.map((question, index) => (
          <FAQAccordion key={index} {...question} />
        ))}
      </ul>
    </section>
  );
}

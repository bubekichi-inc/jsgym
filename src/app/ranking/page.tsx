import { Metadata } from "next";
import RankingTabs from "./_components/RankingTabs";

export const metadata: Metadata = {
  title: "ユーザーランキング | JSGym",
  description:
    "JSGymのユーザーランキングページです。日次・週次・全期間でのランキングを確認できます。",
};

export default function RankingPage() {
  return (
    <div className="mx-auto w-full max-w-[600px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">ランキング</h1>
      <RankingTabs />
    </div>
  );
}

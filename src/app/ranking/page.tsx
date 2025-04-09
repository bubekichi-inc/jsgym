import { Metadata } from "next";
import RankingTabs from "./_components/RankingTabs";
import TotalUsersCount from "./_components/TotalUsersCount";

export const metadata: Metadata = {
  title: "ユーザーランキング | JSGym",
  description:
    "JSGymのユーザーランキングページです。日次・週次・全期間でのランキングを確認できます。",
};

export default function RankingPage() {
  return (
    <div className="mx-auto w-full max-w-[600px] px-4 py-8">
      <div className="mb-6 flex items-center">
        <h1 className="text-2xl font-bold">ランキング</h1>
        <TotalUsersCount />
      </div>
      <RankingTabs />
    </div>
  );
}

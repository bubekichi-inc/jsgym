"use client";

import {
  faMedal,
  faTrophy,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import type { PeriodType } from "@/app/api/ranking/route";
import { useRanking } from "@/app/ranking/_hooks/useRanking";

type RankingListProps = {
  period: PeriodType;
};

export default function RankingList({ period }: RankingListProps) {
  const { rankings, currentUserRank, isLoading, error } = useRanking(period);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="size-6 text-blue-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-8 text-red-500">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="mb-2 text-3xl"
        />
        <p>ランキングデータの取得に失敗しました</p>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>この期間のランキングデータはありません</p>
      </div>
    );
  }

  return (
    <div>
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">
              順位
            </th>
            <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">
              ユーザー
            </th>
            <th className="px-3 py-2 text-right text-sm font-medium text-gray-500">
              スコア
            </th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((user) => (
            <tr
              key={user.id}
              className={`border-b hover:bg-gray-50 ${
                currentUserRank === user.rank ? "bg-blue-50" : ""
              }`}
            >
              <td className="p-3 text-sm">
                {renderRankIcon(user.rank)}
                <span className="ml-2">{user.rank}</span>
              </td>
              <td className="flex items-center p-3 text-sm">
                {user.iconUrl ? (
                  <Image
                    src={user.iconUrl}
                    alt={user.name || "ユーザー"}
                    width={32}
                    height={32}
                    className="mr-3 rounded-full"
                  />
                ) : (
                  <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    👤
                  </div>
                )}
                <span>{user.name || "名称未設定"}</span>
              </td>
              <td className="p-3 text-right text-sm font-medium">
                {user.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {currentUserRank && currentUserRank > 25 && (
        <div className="mt-6 border-t border-gray-200 p-3">
          <div className="mb-2 text-sm text-gray-500">あなたの順位</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 text-gray-800">{currentUserRank}位</span>
            </div>
            <div className="text-right font-medium">
              {rankings.find((u) => u.rank === currentUserRank)?.score || "-"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />;
    case 2:
      return <FontAwesomeIcon icon={faMedal} className="text-gray-400" />;
    case 3:
      return <FontAwesomeIcon icon={faMedal} className="text-amber-600" />;
    default:
      return null;
  }
}

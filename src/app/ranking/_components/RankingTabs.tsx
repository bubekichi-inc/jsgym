"use client";

import { useState } from "react";
import RankingList from "./RankingList";
import { PeriodType } from "@/app/api/ranking/route";

export default function RankingTabs() {
  const [activeTab, setActiveTab] = useState<PeriodType>("daily");

  const tabs: { label: string; value: PeriodType }[] = [
    { label: "本日", value: "daily" },
    { label: "週間", value: "weekly" },
    { label: "全期間", value: "all" },
  ];

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === tab.value
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <RankingList period={activeTab} />
      </div>
    </div>
  );
}

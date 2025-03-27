"use client";

type WeeklyStatsData = {
  date: string;
  questionsCompleted: number;
  answersSubmitted: number;
  formattedDate: string;
}[];

export const WeeklyStats = ({ data }: { data: WeeklyStatsData }) => {
  // 最大値を計算
  const maxValue = Math.max(
    ...data.map((s) => s.questionsCompleted + s.answersSubmitted),
    5
  );

  // 縦軸の数値を生成（最大値から均等にステップを取る）
  const yAxisValues = Array(6)
    .fill(0)
    .map((_, i) => Math.round(maxValue * ((5 - i) / 5)));

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">週間学習統計</h2>
      <div className="relative h-64">
        {/* Y軸 */}
        <div className="absolute inset-y-0 left-0 flex w-10 flex-col justify-between text-xs text-gray-500">
          {yAxisValues.map((value, i) => (
            <div key={i} className="flex items-center justify-end pr-2">
              {value}
            </div>
          ))}
        </div>

        {/* グラフエリア */}
        <div className="ml-10 flex h-full">
          {data.map((stat, index) => (
            <div
              key={index}
              className="flex flex-1 flex-col items-center justify-end"
            >
              {/* 解答提出数 */}
              <div
                className="group relative w-6 bg-blue-400"
                style={{
                  height: `${(stat.answersSubmitted / maxValue) * 100}%`,
                }}
              >
                <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                  解答提出: {stat.answersSubmitted}
                </div>
              </div>

              {/* 完了した問題数 */}
              <div
                className="group relative w-6 bg-green-500"
                style={{
                  height: `${(stat.questionsCompleted / maxValue) * 100}%`,
                }}
              >
                <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                  完了: {stat.questionsCompleted}
                </div>
              </div>

              {/* X軸ラベル */}
              <div className="mt-2 text-xs">{stat.formattedDate}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 凡例 */}
      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="mr-2 size-4 bg-blue-400"></div>
          <span className="text-sm">解答提出数</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 size-4 bg-green-500"></div>
          <span className="text-sm">完了した問題数</span>
        </div>
      </div>
    </div>
  );
};

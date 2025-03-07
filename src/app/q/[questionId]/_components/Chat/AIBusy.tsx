import Image from "next/image";
import React, { useMemo } from "react";
import { SenderIcon } from "./SenderIcon";

interface Props {
  mode: "CODE_REVIEW" | "CHAT";
}

export const AIBusy: React.FC<Props> = ({ mode }) => {
  const text = useMemo(() => {
    if (mode === "CODE_REVIEW") return "レビュー中...";
    return "返信中...";
  }, [mode]);

  const height = useMemo(() => {
    if (mode === "CODE_REVIEW") return "h-[240px]";
    return "h-[120px]";
  }, [mode]);

  return (
    <div className="flex gap-3">
      <SenderIcon sender="SYSTEM" reviewer={null} />
      <div
        className={`w-full animate-pulse rounded bg-gradient-to-r from-blue-300 to-purple-300 p-4 text-sm font-bold text-blue-500 ${height}`}
      >
        <div className="flex items-center gap-1">
          <Image
            src="/images/AI.svg"
            height={80}
            width={80}
            alt="review"
            className="size-[18px]"
          />
          <p className="text-xs font-bold text-blue-500">{text}</p>
        </div>
      </div>
    </div>
  );
};

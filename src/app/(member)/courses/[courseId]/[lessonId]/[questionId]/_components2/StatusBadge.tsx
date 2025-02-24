import { AnswerStatus } from "@prisma/client";

type Props = {
  status: AnswerStatus | null;
};

const colorMap: Record<AnswerStatus, string> = {
  PASSED: "bg-blue-400",
  REVISION_REQUIRED: "bg-red-400",
  DRAFT: "bg-gray-400",
};

const textMap: Record<AnswerStatus, string> = {
  PASSED: "合格 🎉",
  REVISION_REQUIRED: "再提出 🙏",
  DRAFT: "下書き ✏️",
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const statusColor = status ? colorMap[status] : "text-black";

  return (
    <div
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-white ${statusColor}`}
    >
      {status ? textMap[status] : "未提出"}
    </div>
  );
};

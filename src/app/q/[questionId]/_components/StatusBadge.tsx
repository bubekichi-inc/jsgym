import { UserQuestionStatus } from "@prisma/client";
import { userQuestionColorMap, userQuestionTextMap } from "@/app/_constants";

type Props = {
  status: UserQuestionStatus | null;
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const statusColor = status ? userQuestionColorMap[status] : "bg-gray-400";

  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-white ${statusColor}`}
    >
      {status ? userQuestionTextMap[status] : "未提出"}
    </span>
  );
};

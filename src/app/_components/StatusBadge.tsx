import { Status } from "@/app/_types/Status";

type Props = {
  status: Status;
};

const statusMap: Record<Status, string> = {
  合格済み: "text-blue-500",
  再提出: "text-red-500",
  未提出: "text-black",
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const statusColor = statusMap[status] || "text-black";

  return <div className={`font-bold ${statusColor}`}>{status}</div>;
};

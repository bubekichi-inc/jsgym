import { StatusType } from "@prisma/client";
type Status = "未提出" | "合格済み" | "再提出";

export const status = (status: StatusType | null): Status => {
  switch (status) {
    case "DRAFT":
      return "未提出";
    case "PASSED":
      return "合格済み";
    case "REVISION_REQUIRED":
      return "再提出";
    default:
      return "未提出";
  }
};

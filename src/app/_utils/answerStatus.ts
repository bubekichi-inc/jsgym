import { StatusType } from "@prisma/client";
import { Status } from "../_types/Status";

export const answerStatus = (status: StatusType | null): Status => {
  switch (status) {
    case StatusType.DRAFT:
      return "未提出";
    case StatusType.PASSED:
      return "合格済み";
    case StatusType.REVISION_REQUIRED:
      return "再提出";
    default:
      return "未提出";
  }
};

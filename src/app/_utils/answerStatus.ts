import { AnswerStatus } from "@prisma/client";
import { Status } from "../_types/Status";

export const answerStatus = (status: AnswerStatus | null): Status => {
  switch (status) {
    case AnswerStatus.DRAFT:
      return "未提出";
    case AnswerStatus.PASSED:
      return "合格済み";
    case AnswerStatus.REVISION_REQUIRED:
      return "再提出";
    default:
      return "未提出";
  }
};

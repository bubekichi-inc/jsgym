import { CodeReviewCommentLevel } from "@prisma/client";
import React from "react";

interface Props {
  level: CodeReviewCommentLevel | null;
}

export const CommentLevelBadge: React.FC<Props> = ({ level }) => {
  if (level === null) return null;

  const icon = (() => {
    switch (level) {
      case CodeReviewCommentLevel.ERROR:
        return "🙅";
      case CodeReviewCommentLevel.WARN:
        return "🤏";
      case CodeReviewCommentLevel.GOOD:
        return "🙆";
    }
  })();

  return <span>{icon}</span>;
};

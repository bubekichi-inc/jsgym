import { UserQuestionStatus } from "@prisma/client";

export const lessonTextMap = {
  1: "基礎",
  2: "応用",
  3: "実務模擬",
};

export const lessonLevelMap = {
  BASIC: 1,
  ADVANCED: 2,
  REAL_WORLD: 3,
};

export const lessonStyleMap = {
  1: "bg-blue-600",
  2: "bg-yellow-600",
  3: "bg-red-600",
};

export const courseTextMap = {
  1: "JavaScript",
  // 2: "TypeScript",
  // 3: "React",
};

export const questionTagTextMap = {
  VALUE: "値",
  ARRAY: "配列",
  OBJECT: "オブジェクト",
  FUNCTION: "関数",
  CLASS: "クラス",
};

export const userQuestionColorMap: Record<UserQuestionStatus, string> = {
  PASSED: "bg-blue-400",
  REVISION_REQUIRED: "bg-red-400",
  DRAFT: "bg-gray-400",
};

export const userQuestionTextMap: Record<UserQuestionStatus, string> = {
  PASSED: "合格 🎉",
  REVISION_REQUIRED: "再提出 🙏",
  DRAFT: "下書き ✏️",
};

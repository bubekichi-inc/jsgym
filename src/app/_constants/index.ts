import { UserQuestionStatus } from "@prisma/client";

export const levelTextMap = {
  BASIC: "基礎",
  ADVANCED: "応用",
  REAL_WORLD: "実務模擬",
};

export const levelStyleMap = {
  BASIC: "bg-blue-600",
  ADVANCED: "bg-yellow-600",
  REAL_WORLD: "bg-red-600",
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
  STATE: "ステート",
  PROPS: "プロパティ",
  HOOK: "フック",
  ERROR_HANDLING: "エラーハンドリング",
  ASYNC: "非同期",
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

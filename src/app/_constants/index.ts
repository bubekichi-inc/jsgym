import { UserQuestionStatus } from "@prisma/client";

export const questionTypeTextMap = {
  REACT_JS: "React",
  REACT_TS: "React(TS)",
  JAVA_SCRIPT: "JavaScript",
  TYPE_SCRIPT: "TypeScript",
};

export const levelTextMap = {
  BASIC: "基礎",
  ADVANCED: "応用",
  REAL_WORLD: "実務模擬",
};

export const levelStyleMap = {
  BASIC: "bg-sky-400",
  ADVANCED: "bg-amber-400",
  REAL_WORLD: "bg-orange-600",
};

export const typeStyleMap = {
  REACT_JS: "bg-sky-400",
  REACT_TS: "bg-blue-600",
  JAVA_SCRIPT: "bg-amber-400",
  TYPE_SCRIPT: "bg-blue-600",
};

export const typeTextMap = {
  REACT_JS: "React",
  REACT_TS: "React",
  JAVA_SCRIPT: "JavaScript",
  TYPE_SCRIPT: "TypeScript",
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

export const userQuestionStatusColorMap: Record<UserQuestionStatus, string> = {
  PASSED: "bg-yellow-400",
  REVISION_REQUIRED: "bg-gray-500 text-blueGray",
  DRAFT: "bg-lightGray",
};

export const userQuestionStatusTextMap: Record<UserQuestionStatus, string> = {
  PASSED: "合格",
  REVISION_REQUIRED: "再提出",
  DRAFT: "下書き",
};

import { QuestionLevel, QuestionType } from "@prisma/client";

// 点数計算関数
export const calculateScore = (
  level: QuestionLevel,
  type: QuestionType
): number => {
  let baseScore = 0;

  // レベルによるスコア
  switch (level) {
    case QuestionLevel.BASIC:
      baseScore = 1;
      break;
    case QuestionLevel.ADVANCED:
      baseScore = 2;
      break;
    case QuestionLevel.REAL_WORLD:
      baseScore = 3;
      break;
  }

  // タイプによる倍率
  let multiplier = 1;
  if (type === QuestionType.REACT_JS) {
    multiplier = 2;
  }

  return baseScore * multiplier;
};

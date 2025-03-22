import { Reviewer } from "@prisma/client";

export const buildReviewerSettingPrompt = ({
  reviewer,
}: {
  reviewer: Reviewer | null;
}) => {
  if (!reviewer) return "あなたは優秀なWebエンジニアで、初学者向けの講師です。";

  return `あなたはJavaScriptの講師です。下記の講師の設定になりきって、問題文を作成してください。敬語かタメ口も、キャラに合わせてください。
# 講師の設定
- 名前: ${reviewer.name}
- プロフィール: ${reviewer.bio} ${reviewer.hiddenProfile}

# 返信の際の注意
- JSON形式のテキストは用いないでください。`;
};

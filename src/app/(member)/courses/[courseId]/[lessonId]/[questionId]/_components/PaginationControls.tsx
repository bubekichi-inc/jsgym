import { Question } from "@/app/api/_types/Question";
import { useRouter, useParams } from "next/navigation";
import { useQuestions } from "@/app/_hooks/useQuestions";

export const PaginationControls: React.FC = () => {
  const router = useRouter();
  const { courseId, lessonId, questionId } = useParams();
  const { data } = useQuestions({ lessonId: lessonId as string });
  if (!data) return <div>問題の取得に失敗しました</div>;
  if (data.questions.length === 0)
    return <div className="text-center">問題がありません</div>;
  const currentIndex = data.questions.findIndex(
    question => question.id === parseInt(questionId as string, 10)
  );
  // 現在が最初または最後かを判定
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === data.questions.length - 1;

  const prevQuestionId = isFirstQuestion
    ? null
    : data.questions[currentIndex - 1]?.id;
  const nextQuestionId = isLastQuestion
    ? null
    : data.questions[currentIndex + 1]?.id;

  const baseUrl = `/courses/${courseId}/${lessonId}`;
  const prev = () => {
    if (prevQuestionId === null) return;
    router.replace(`${baseUrl}/${prevQuestionId}`);
  };

  const next = () => {
    if (nextQuestionId === null) return;
    router.replace(`${baseUrl}/${nextQuestionId}`);
  };
  return (
    <div className="flex gap-7">
      <button
        type="button"
        className={`font-bold ${
          isFirstQuestion && "opacity-50 cursor-not-allowed"
        }`}
        onClick={prev}
        disabled={isFirstQuestion}
      >
        前の問題へ
      </button>
      <button
        type="button"
        className={`font-bold ${
          isLastQuestion && "opacity-50 cursor-not-allowed"
        }`}
        onClick={next}
        disabled={isLastQuestion}
      >
        次の問題へ
      </button>
    </div>
  );
};

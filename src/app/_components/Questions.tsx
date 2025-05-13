import { QuestionCard } from "./QuestionCard";
import { Question } from "@/app/api/questions/route";

interface Props {
  questions: Question[];
  isLoading: boolean;
}

export const Questions: React.FC<Props> = ({ questions, isLoading }) => {
  return (
    <>
      <div className="mx-auto grid max-w-[1152px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>

      {questions.length === 0 && !isLoading && (
        <div className="mt-8 text-center text-gray-500">
          問題が見つかりませんでした。検索条件を変更してみてください。
        </div>
      )}
    </>
  );
};

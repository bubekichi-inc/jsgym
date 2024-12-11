import Link from "next/link";
import { useParams } from "next/navigation";
import { QuestionsResponse } from "@/app/api/lessons/[lessonId]/_types/QuestionsResponse";

interface Props {
  questions: QuestionsResponse;
}
export const QuestionList: React.FC<Props> = ({ questions }) => {
  const { courseId, lessonId } = useParams();
  return (
    <div className="flex flex-col gap-10 p-10">
      {questions.questions.map((question, index) => (
        <Link
          href={`/courses/${courseId}/lessons/${lessonId}/questions/${question.id}`}
          key={question.id}
          className=" shadow-md"
        >
          <div className="pl-2">{`問題${index + 1}`}</div>
          <div className="p-5">{question.content}</div>
        </Link>
      ))}
    </div>
  );
};

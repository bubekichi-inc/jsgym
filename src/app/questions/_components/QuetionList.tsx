import Link from "next/link";
import { QuestionsResponse } from "@/app/_types/QuestionsResponse";

interface Props {
  questions: QuestionsResponse;
}
export const QuetionList: React.FC<Props> = ({ questions }) => {
  return (
    <div className="flex flex-col gap-10 p-10">
      {questions.map((question, index) => (
        <Link
          href={`/questions/js/${question.id}`}
          key={question.id}
          className=" shadow-md"
        >
          <div className="pl-2">{`問題${index + 1}`}</div>
          <div className="p-5">{question.question}</div>
        </Link>
      ))}
    </div>
  );
};

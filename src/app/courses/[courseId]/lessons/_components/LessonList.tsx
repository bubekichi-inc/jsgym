import Link from "next/link";
import { LessonsResponse } from "@/app/api/courses/[courseId]/lessons/_types/LessonsResponse";

interface Props {
  lessons: LessonsResponse;
}
export const LessonList: React.FC<Props> = ({ lessons }) => {
  console.log(lessons);
  return (
    <div className="flex flex-col gap-10 p-10">
      {lessons.questions.map((question, index) => (
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

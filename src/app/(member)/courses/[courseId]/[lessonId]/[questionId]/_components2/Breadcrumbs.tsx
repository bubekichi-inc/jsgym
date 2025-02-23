"use client";

import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { courseName } from "@/app/_utils/courseName";

export const BreadCrumbs: React.FC = () => {
  const { courseId, questionId, lessonId } = useParams();
  const { data, error, isLoading } = useQuestion({
    questionId: questionId as string,
  });

  if (isLoading) return <div>読込み中...</div>;
  if (error) return <div>問題情報取得中にエラー発生</div>;
  if (!data) return <div>データがありません</div>;

  return (
    <ol className="flex items-center gap-3">
      <li className="flex items-center gap-3">
        <Link href={`/courses`} className="hover:underline">
          コース一覧
        </Link>
        <FontAwesomeIcon icon={faChevronRight} className="size-3" />
      </li>
      <li className="flex items-center gap-3">
        <Link href={`/courses/${courseId}`} className="hover:underline">
          {courseName(data.course.name)}
        </Link>
        <FontAwesomeIcon icon={faChevronRight} className="size-3" />
      </li>
      <li className="flex items-center gap-3">
        <Link
          href={`/courses/${courseId}/${lessonId}`}
          className="hover:underline"
        >
          {courseName(data.course.name)}
        </Link>
      </li>
    </ol>
  );
};

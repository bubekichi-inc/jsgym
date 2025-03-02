"use client";

import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@/app/_components/Skeleton";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { courseName } from "@/app/_utils/courseName";

export const BreadCrumbs: React.FC = () => {
  const { questionId } = useParams();
  const { data } = useQuestion({
    questionId: questionId as string,
  });

  if (!data) return <Skeleton height={24} />;

  return (
    <ol className="flex items-center gap-3 text-sm">
      <li className="flex items-center gap-3">
        <Link href={`/c`} className="hover:underline">
          コース一覧
        </Link>
        <FontAwesomeIcon icon={faChevronRight} className="size-3" />
      </li>
      <li className="flex items-center gap-3">
        <Link
          href={`/c/${data.question.lesson.course.id}`}
          className="hover:underline"
        >
          {courseName(data.question.lesson.course.name)}
        </Link>
        <FontAwesomeIcon icon={faChevronRight} className="size-3" />
      </li>
      <li className="flex items-center gap-3">
        <Link
          href={`/l/${data.question.lesson.id}`}
          className="hover:underline"
        >
          {data.question.lesson.name}
        </Link>
      </li>
    </ol>
  );
};

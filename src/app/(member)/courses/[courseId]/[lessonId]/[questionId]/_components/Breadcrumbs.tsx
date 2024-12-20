"use client";
import Link from "next/link";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { language } from "@/app/_utils/language";
import { useParams } from "next/navigation";

export const BreadCrumbs: React.FC = () => {
  const { questionId } = useParams();
  const { data, error, isLoading } = useQuestion({
    questionId: questionId as string,
  });

  if (isLoading) return <div>読込み中...</div>;
  if (error) return <div>問題情報取得中にエラー発生</div>;
  if (!data) return <div>データがありません</div>;

  return (
    <nav>
      <ol className="flex items-center gap-2">
        {/* <li className="flex items-center gap-2">
          <Link href={`/courses`} className="underline">
            コース一覧
          </Link>
          <span>&gt;</span>
        </li> */}
        <li className="flex items-center gap-2">
          <Link href={`/courses/6/2`} className="underline">
            {/* {language(data.course.name)} */}
            問題一覧
          </Link>
          <span>&gt;</span>
        </li>
        <li className="flex items-center gap-2">{data.question.title}</li>
      </ol>
    </nav>
  );
};

"use client";
import Link from "next/link";
import { useCourses } from "../_hooks/useCourses";
import { language } from "../_utils/language";
export default function Courses() {
  const { data, error } = useCourses();

  if (!data) return <div className="text-center">読込み中...</div>;
  if (error)
    return (
      <div className="text-center">コースの取得中にエラーが発生しました</div>
    );
  if (data.courses.length === 0)
    return <div className="text-center">コースがありません</div>;

  return (
    <div className="">
      <h2 className="p-10 text-5xl">Course一覧</h2>
      <div className="flex flex-col gap-10 p-10">
        {data.courses.map(course => (
          <Link
            href={`/courses/${course.id}`}
            key={course.id}
            className=" shadow-md"
          >
            <div className="p-5">{language(course.name)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

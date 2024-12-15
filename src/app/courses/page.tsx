"use client";
import Link from "next/link";
import { useCourses } from "../_hooks/useCourses";
import { language } from "../_utils/language";
export default function Courses() {
  const { courses, coursesError, coursesIsLoading } = useCourses();

  if (coursesIsLoading) return <div className="text-center">読込み中</div>;
  if (coursesError)
    return (
      <div className="text-center">JS問題の取得中にエラーが発生しました</div>
    );
  if (!courses) return <div className="text-center">JSの問題がありません</div>;

  return (
    <div className="">
      <h2 className="p-10 text-5xl">Course一覧</h2>
      <div className="flex flex-col gap-10 p-10">
        {courses.map(course => (
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

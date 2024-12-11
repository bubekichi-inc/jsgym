"use client";
import Link from "next/link";
import { useFetch } from "../_hooks/useFetch";
import { language } from "../_utils/language";
import { CoursesResponse } from "../api/courses/_types/CoursesResponse";

export default function Courses() {
  const { data, error, isLoading } = useFetch<CoursesResponse>(`/api/courses`);

  if (isLoading) return <div>読込み中</div>;
  if (error) return <div>JS問題の取得中にエラーが発生しました</div>;
  if (!data) return <div>JSの問題がありません</div>;

  return (
    <>
      <h2 className="p-10 text-5xl">Course一覧</h2>
      <div className="flex flex-col gap-10 p-10">
        {data &&
          data.courses.map(course => (
            <Link
              href={`/courses/${course.id}`}
              key={course.id}
              className=" shadow-md"
            >
              <div className="p-5">{language(course.name)}</div>
            </Link>
          ))}
      </div>
    </>
  );
}

"use client";

import { faBook, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CourseHeader from "./CourseHeader";
import LessonList from "./LessonList";
import { useCourse } from "@/app/_hooks/useCourse";

export default function CourseDetailPage({ courseId }: { courseId: string }) {
  const { course, lessons, isLoading, error } = useCourse(courseId);

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="mr-4 text-4xl text-blue-500"
        />
        <p className="text-xl">コース情報を読み込み中...</p>
      </div>
    );
  }

  // エラー表示
  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <p className="font-bold">エラーが発生しました</p>
          <p>
            コース情報の取得に失敗しました。時間をおいて再度お試しください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* コースヘッダー */}
      <CourseHeader
        title={course.title}
        description={course.description}
        thumbnailUrl={course.thumbnailUrl}
      />

      {/* レッスン一覧 */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 flex items-center text-2xl font-bold">
          <FontAwesomeIcon icon={faBook} className="mr-3 text-blue-500" />
          レッスン一覧
        </h2>
        <LessonList lessons={lessons} />
      </div>
    </div>
  );
}

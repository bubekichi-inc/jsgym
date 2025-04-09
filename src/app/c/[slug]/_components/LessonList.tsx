"use client";

import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserQuestionStatus } from "@prisma/client";
import Link from "next/link";
import {
  levelTextMap,
  levelStyleMap,
  typeTextMap,
  typeStyleMap,
  userQuestionTextMap,
  userQuestionColorMap,
} from "@/app/_constants";

type LessonWithQuestions = {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    title: string;
    content: string;
    level: string;
    type: string;
    userQuestionStatus: UserQuestionStatus | null;
  }[];
};

// UserQuestionStatusのライターエラー修正用に型を定義
type StatusType = "DRAFT" | "PASSED" | "REVISION_REQUIRED" | null;

export default function LessonList({
  lessons,
}: {
  lessons: LessonWithQuestions[];
  slug: string;
}) {
  if (lessons.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-gray-500">
          このコースにはまだレッスンがありません。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {lessons.map((lesson, lessonIndex) => (
        <div
          key={lesson.id}
          className="rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-200 bg-gray-50 p-4">
            <h3 className="text-xl font-semibold">
              <span className="mr-2 inline-flex size-7 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                {lessonIndex + 1}
              </span>
              レッスン{lessonIndex + 1}: {lesson.title}
            </h3>
            <p className="mt-1 text-gray-600">{lesson.description}</p>
          </div>

          <ul className="divide-y divide-gray-100">
            {lesson.questions.map((question, questionIndex) => {
              const status = question.userQuestionStatus as StatusType;
              const typeStyle =
                typeStyleMap[question.type as keyof typeof typeStyleMap] ||
                "bg-gray-100";
              const levelStyle =
                levelStyleMap[question.level as keyof typeof levelStyleMap] ||
                "bg-gray-100";

              return (
                <li key={question.id}>
                  <Link
                    href={`/q/${question.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700">
                          {questionIndex + 1}
                        </span>
                        <h4 className="font-medium">
                          問題{lessonIndex + 1}.{questionIndex + 1}:{" "}
                          {question.title}
                        </h4>
                        {status && (
                          <span
                            className={`ml-3 rounded-md px-2 py-1 text-xs font-medium text-white ${userQuestionColorMap[status]}`}
                          >
                            {userQuestionTextMap[status]}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center space-x-2">
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium text-white ${typeStyle}`}
                        >
                          {typeTextMap[
                            question.type as keyof typeof typeTextMap
                          ] || question.type}
                        </span>
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium text-white ${levelStyle}`}
                        >
                          {levelTextMap[
                            question.level as keyof typeof levelTextMap
                          ] || question.level}
                        </span>
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="size-4 text-gray-400"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

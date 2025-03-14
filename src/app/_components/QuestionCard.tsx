"use client";

import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import {
  lessonLevelMap,
  lessonTextMap,
  questionTagTextMap,
  userQuestionColorMap,
  userQuestionTextMap,
} from "@/app/_constants";
import { Question } from "@/app/api/questions/route";

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <div className="relative flex h-full flex-col rounded-lg border bg-white p-6 py-8 shadow-sm">
      <div className="space-y-2 pb-4">
        <div className="flex items-center justify-between">
          <div className="mb-1 text-sm">
            <span className="text-gray-600">
              {dayjs(question.createdAt).format("YYYY/MM/DD_HH:mm")}
            </span>
            <span>
              {dayjs(question.createdAt).isSame(dayjs(), "day") && (
                <span className="ml-2 inline-flex items-center rounded-full text-base font-bold text-red-600">
                  NEW
                </span>
              )}
            </span>
          </div>
          <div className="flex gap-2">
            {question.questionBookmarks?.length > 0 && (
              <div className="flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faBookmark}
                  className="text-yellow-500"
                />
              </div>
            )}
            <span
              className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                question.lesson.id === lessonLevelMap["BASIC"]
                  ? "border-transparent bg-blue-500 text-white"
                  : question.lesson.id === lessonLevelMap["ADVANCED"]
                  ? "border-transparent bg-yellow-500 text-white"
                  : "border-transparent bg-red-500 text-white"
              }`}
            >
              {lessonTextMap[question.lesson.id as keyof typeof lessonTextMap]}
            </span>
          </div>
        </div>
        <h3 className="text-xl font-bold">{question.title}</h3>
        <p className="line-clamp-2 text-gray-500">{question.content}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="grow">
          <div className="flex flex-wrap gap-2">
            {question.questions.map((q) => (
              <span
                key={q.tag.name}
                className="inline-flex items-center rounded-md border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-800 transition-colors"
              >
                {
                  questionTagTextMap[
                    q.tag.name as keyof typeof questionTagTextMap
                  ]
                }
              </span>
            ))}
          </div>
        </div>
        {question.reviewer && (
          <div className="group relative">
            <div
              className={`flex size-10 items-center justify-center overflow-hidden rounded-full`}
            >
              <Image
                src={question.reviewer.profileImageUrl}
                alt="reviewer"
                width={80}
                height={80}
                className="size-full object-cover"
              />
            </div>
            <div className="invisible absolute -right-4 bottom-full z-10 mb-2 w-[320px] rounded-lg bg-gray-900 p-2 text-sm text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300">レビュワー</span>
                <p className="font-bold">{question.reviewer.name}</p>
              </div>
              <p className="mt-1 whitespace-pre-line text-xs text-gray-300">
                {question.reviewer.bio}
              </p>
              <p className="mt-1 text-xs text-blue-300">
                クリックしてこのレビュワーの問題をフィルター
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="pt-4">
        <Link
          href={`/q/${question.id}`}
          className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          問題に挑戦する
        </Link>
      </div>
      {question.userQuestions?.[0] && (
        <div
          className={`absolute left-0 top-0 rounded-br-lg rounded-tl-lg px-2 py-1 text-sm text-white ${
            userQuestionColorMap[question.userQuestions?.[0].status]
          }`}
        >
          {userQuestionTextMap[question.userQuestions?.[0].status]}
        </div>
      )}
    </div>
  );
};

"use client";

import {
  faCheckCircle,
  faTimesCircle,
  faPencilAlt,
  faCode,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  UserQuestionStatus,
  CodeReviewResult,
  CourseType,
} from "@prisma/client";
import React, { useState } from "react";
import { Modal } from "@/app/_components/Modal";
import { useFetch } from "@/app/_hooks/useFetch";
import { DashboardData, Course, Lesson } from "@/app/api/_types/DashboardTypes";

export default function Dashboard() {
  const { data, error, isLoading } = useFetch<DashboardData>("/api/dashboard");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<UserQuestionStatus | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-100 p-6 text-red-700">
          <h2 className="mb-2 text-xl font-bold">エラーが発生しました</h2>
          <p>
            データの読み込み中にエラーが発生しました。後でもう一度お試しください。
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { userQuestions, courseProgress, recentCodeReviews } = data;

  // 問題の状態ごとの数を計算
  const statusCounts = {
    [UserQuestionStatus.PASSED]: userQuestions.filter(
      (q) => q.status === UserQuestionStatus.PASSED
    ).length,
    [UserQuestionStatus.REVISION_REQUIRED]: userQuestions.filter(
      (q) => q.status === UserQuestionStatus.REVISION_REQUIRED
    ).length,
    [UserQuestionStatus.DRAFT]: userQuestions.filter(
      (q) => q.status === UserQuestionStatus.DRAFT
    ).length,
  };

  const openModal = (status: UserQuestionStatus) => {
    setSelectedStatus(status);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStatus(null);
  };

  const getStatusTitle = (status: UserQuestionStatus) => {
    switch (status) {
      case UserQuestionStatus.PASSED:
        return "合格した問題";
      case UserQuestionStatus.REVISION_REQUIRED:
        return "修正が必要な問題";
      case UserQuestionStatus.DRAFT:
        return "下書き中の問題";
      default:
        return "";
    }
  };

  const filteredQuestions = userQuestions.filter(
    (q) => q.status === selectedStatus
  );

  // コース別の進捗率を計算
  const courseStats = courseProgress.map((course: Course) => {
    const totalQuestions = course.lessons.reduce(
      (sum: number, lesson: Lesson) => sum + lesson.questions.length,
      0
    );
    const completedQuestions = course.lessons.reduce(
      (sum: number, lesson: Lesson) => {
        return (
          sum +
          lesson.questions.reduce((lessonSum: number, question) => {
            return (
              lessonSum +
              (question.userQuestions.some(
                (uq) => uq.status === UserQuestionStatus.PASSED
              )
                ? 1
                : 0)
            );
          }, 0)
        );
      },
      0
    );

    const progressPercentage =
      totalQuestions > 0
        ? Math.round((completedQuestions / totalQuestions) * 100)
        : 0;

    const lessonStats = course.lessons.map((lesson: Lesson) => {
      const lessonTotalQuestions = lesson.questions.length;
      const lessonCompletedQuestions = lesson.questions.reduce(
        (sum: number, question) =>
          sum +
          (question.userQuestions.some(
            (uq) => uq.status === UserQuestionStatus.PASSED
          )
            ? 1
            : 0),
        0
      );

      const lessonProgressPercentage =
        lessonTotalQuestions > 0
          ? Math.round((lessonCompletedQuestions / lessonTotalQuestions) * 100)
          : 0;

      return {
        lessonId: lesson.id,
        lessonName: lesson.name,
        lessonTotalQuestions,
        lessonCompletedQuestions,
        lessonProgressPercentage,
      };
    });

    return {
      courseId: course.id,
      courseName: getCourseDisplayName(course.name),
      totalQuestions,
      completedQuestions,
      progressPercentage,
      lessonStats,
    };
  });

  function getCourseDisplayName(courseType: CourseType): string {
    switch (courseType) {
      case CourseType.JAVA_SCRIPT:
        return "JavaScript";
      case CourseType.TYPE_SCRIPT:
        return "TypeScript";
      default:
        return String(courseType);
    }
  }

  function getReviewResultIcon(result: CodeReviewResult) {
    switch (result) {
      case CodeReviewResult.APPROVED:
        return (
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
        );
      case CodeReviewResult.REJECTED:
        return (
          <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
        );
      default:
        return null;
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">学習ダッシュボード</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div
          className="cursor-pointer rounded-lg bg-white p-6 shadow-md"
          onClick={() => openModal(UserQuestionStatus.PASSED)}
        >
          <div className="mb-2 flex items-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="mr-2 text-green-500"
            />
            <h2 className="text-lg font-semibold">合格した問題</h2>
          </div>
          <p className="text-3xl font-bold">
            {statusCounts[UserQuestionStatus.PASSED]}
          </p>
        </div>

        <div
          className="cursor-pointer rounded-lg bg-white p-6 shadow-md"
          onClick={() => openModal(UserQuestionStatus.REVISION_REQUIRED)}
        >
          <div className="mb-2 flex items-center">
            <FontAwesomeIcon
              icon={faTimesCircle}
              className="mr-2 text-red-500"
            />
            <h2 className="text-lg font-semibold">修正が必要な問題</h2>
          </div>
          <p className="text-3xl font-bold">
            {statusCounts[UserQuestionStatus.REVISION_REQUIRED]}
          </p>
        </div>

        <div
          className="cursor-pointer rounded-lg bg-white p-6 shadow-md"
          onClick={() => openModal(UserQuestionStatus.DRAFT)}
        >
          <div className="mb-2 flex items-center">
            <FontAwesomeIcon
              icon={faPencilAlt}
              className="mr-2 text-yellow-500"
            />
            <h2 className="text-lg font-semibold">下書き中の問題</h2>
          </div>
          <p className="text-3xl font-bold">
            {statusCounts[UserQuestionStatus.DRAFT]}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="mr-2 text-blue-500" />
          <h2 className="text-2xl font-bold">進捗状況</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {courseStats.map((course) => (
            <div
              key={course.courseId}
              className="rounded-lg bg-white p-6 shadow-md"
            >
              <h3 className="mb-2 text-xl font-semibold">
                {course.courseName}
              </h3>
              <div className="mb-2 flex justify-between">
                <span>進捗率: {course.progressPercentage}%</span>
                <span>
                  {course.completedQuestions} / {course.totalQuestions} 問題
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${course.progressPercentage}%` }}
                ></div>
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-semibold">レベル別進捗状況</h4>
                {course.lessonStats.map((lesson) => (
                  <div key={lesson.lessonId} className="mt-2">
                    <h5 className="text-base font-medium">
                      {lesson.lessonName}
                    </h5>
                    <div className="mb-2 flex justify-between">
                      <span>進捗率: {lesson.lessonProgressPercentage}%</span>
                      <span>
                        {lesson.lessonCompletedQuestions} /{" "}
                        {lesson.lessonTotalQuestions} 問題
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${lesson.lessonProgressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center">
          <FontAwesomeIcon icon={faCode} className="mr-2 text-purple-500" />
          <h2 className="text-2xl font-bold">最近のコードレビュー</h2>
        </div>
        {recentCodeReviews.length > 0 ? (
          <div className="overflow-x-auto rounded-lg bg-white shadow-md">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    問題
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    結果
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    日付
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentCodeReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <a
                        href={`/q/${review.userQuestion.question.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {review.userQuestion.question.title}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        {getReviewResultIcon(review.result)}
                        <span className="ml-2">
                          {review.result === CodeReviewResult.APPROVED
                            ? "合格"
                            : "修正が必要"}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {formatDate(review.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <p className="text-gray-500">まだコードレビューがありません</p>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal}>
        <h2 className="mb-4 text-xl font-bold">
          {getStatusTitle(selectedStatus!)}
        </h2>
        <ul className="grid grid-cols-1 gap-4">
          {filteredQuestions.map((question) => (
            <li
              key={question.id}
              className="rounded-lg bg-gray-100 p-4 shadow-md transition duration-200 hover:bg-gray-200"
            >
              <a
                href={`/q/${question.question.id}`}
                className="text-blue-500 hover:underline"
              >
                {question.question.title}
              </a>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

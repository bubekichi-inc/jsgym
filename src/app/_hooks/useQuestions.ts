"use client";

import { QuestionType, UserQuestionStatus } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { useFetch } from "./useFetch";
import { QuestionLevel } from "@/app/_serevices/JsQuestionGenerateService";
import { api } from "@/app/_utils/api";
import { Question } from "@/app/api/questions/route";
import { Reviewer } from "@/app/api/reviewers/route";

// ステータスの型定義を拡張
type ExtendedStatus = UserQuestionStatus | "NOT_SUBMITTED" | "ALL";

interface UseQuestionsProps {
  limit?: number;
  initialReviewerId?: number;
}

interface UseQuestionsReturn {
  questions: Question[];
  reviewers: Reviewer[];
  selectedLevel: QuestionLevel | "ALL";
  searchTitle: string;
  selectedReviewerId: number;
  selectedStatus: ExtendedStatus;
  isLoading: boolean;
  setSelectedLevel: (level: QuestionLevel | "ALL") => void;
  setSearchTitle: (title: string) => void;
  setSelectedReviewerId: (reviewerId: number) => void;
  setSelectedStatus: (status: ExtendedStatus) => void;
  handleSearchInputChange: (value: string) => void;
  handleLevelChange: (level: QuestionLevel | "ALL") => void;
  handleReviewerSelect: (reviewerId: number) => void;
  handleStatusChange: (status: ExtendedStatus) => void;
  selectedType: QuestionType | "ALL";
  handleTypeChange: (type: QuestionType | "ALL") => void;
  handlePageChange: (page: number) => void;
  updateUrl: (
    title: string,
    type: QuestionType | "ALL",
    level: QuestionLevel | "ALL",
    reviewerId: number,
    status: ExtendedStatus,
    page: number
  ) => void;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const useQuestions = ({
  limit = 12,
  initialReviewerId = 0,
}: UseQuestionsProps): UseQuestionsReturn => {
  // URLクエリパラメータから初期状態を取得
  const searchParams = useSearchParams();
  const initialTitle = searchParams.get("title") || "";
  const initialLevel =
    (searchParams.get("level") as QuestionLevel | "ALL") || "ALL";
  const initialType =
    (searchParams.get("type") as QuestionType | "ALL") || "ALL";
  const initialStatus = (searchParams.get("status") as ExtendedStatus) || "ALL";
  const initialPage = Number(searchParams.get("page") || "1");

  const [selectedLevel, setSelectedLevel] = useState<QuestionLevel | "ALL">(
    initialLevel
  );
  const [selectedType, setSelectedType] = useState<QuestionType | "ALL">(
    initialType
  );
  const [searchTitle, setSearchTitle] = useState(initialTitle);
  const [selectedReviewerId, setSelectedReviewerId] =
    useState<number>(initialReviewerId);
  const [selectedStatus, setSelectedStatus] =
    useState<ExtendedStatus>(initialStatus);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // レビュワー一覧を取得
  const { data: reviewersData } = useSWR<{ reviewers: Reviewer[] }>(
    "/api/reviewers",
    api.get
  );
  const reviewers = reviewersData?.reviewers || [];

  // 検索パラメータ
  const queryParams = {
    limit: String(limit),
    offset: String((currentPage - 1) * limit),
    title: searchTitle,
    type: selectedType !== "ALL" ? selectedType : "",
    level: selectedLevel !== "ALL" ? selectedLevel : "",
    reviewerId: selectedReviewerId ? String(selectedReviewerId) : "",
    status: selectedStatus !== "ALL" ? selectedStatus : "",
  };

  // 問題一覧を取得
  const { data: questionsData, isLoading } = useFetch<{
    questions: Question[];
    pagination: {
      total: number;
      offset: number;
      limit: number;
      hasMore: boolean;
    };
  }>(`/api/questions/?${new URLSearchParams(queryParams).toString()}`, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  const totalPages = useMemo(() => {
    if (!questionsData) return 1;
    return Math.ceil(questionsData.pagination.total / limit);
  }, [questionsData, limit]);

  // URLを更新する関数
  const updateUrl = useCallback(
    (
      title: string,
      type: QuestionType | "ALL",
      level: QuestionLevel | "ALL",
      reviewerId: number,
      status: ExtendedStatus,
      page: number
    ) => {
      const params = new URLSearchParams();

      if (title) {
        params.append("title", title);
      }

      if (type !== "ALL") {
        params.append("type", type);
      }

      if (level !== "ALL") {
        params.append("level", level);
      }

      if (reviewerId > 0) {
        params.append("reviewerId", reviewerId.toString());
      }

      if (status !== "ALL") {
        params.append("status", status);
      }

      if (page > 1) {
        params.append("page", page.toString());
      }

      const queryString = params.toString();
      const url = queryString ? `?${queryString}` : window.location.pathname;

      // pushStateを使用してURLを更新（ページリロードなし）
      window.history.pushState({}, "", url);
    },
    []
  );

  // 検索入力のハンドラ
  const handleSearchInputChange = useCallback(
    (value: string) => {
      setSearchTitle(value);
      setCurrentPage(1); // 検索時はページをリセット
      updateUrl(
        value,
        selectedType,
        selectedLevel,
        selectedReviewerId,
        selectedStatus,
        1
      );
    },
    [selectedLevel, selectedReviewerId, selectedStatus, selectedType, updateUrl]
  );

  // レベルタブ切り替え
  const handleLevelChange = useCallback(
    (level: QuestionLevel | "ALL") => {
      // 同じタブを選択した場合は何もしない
      if (level === selectedLevel) return;

      setSelectedLevel(level);
      setCurrentPage(1); // タブ切替時はページをリセット

      updateUrl(
        searchTitle,
        selectedType,
        level,
        selectedReviewerId,
        selectedStatus,
        1
      );
    },
    [
      selectedLevel,
      updateUrl,
      searchTitle,
      selectedType,
      selectedReviewerId,
      selectedStatus,
    ]
  );

  // タイプタブ切り替え
  const handleTypeChange = useCallback(
    (type: QuestionType | "ALL") => {
      setSelectedType(type);
      setCurrentPage(1); // タイプ変更時はページをリセット
      updateUrl(
        searchTitle,
        type,
        selectedLevel,
        selectedReviewerId,
        selectedStatus,
        1
      );
    },
    [searchTitle, selectedLevel, selectedReviewerId, selectedStatus, updateUrl]
  );

  // レビュワー選択
  const handleReviewerSelect = useCallback(
    (reviewerId: number) => {
      // 同じレビュワーを選択した場合は選択解除
      const newReviewerId = reviewerId === selectedReviewerId ? 0 : reviewerId;

      // 変更がない場合は何もしない
      if (newReviewerId === selectedReviewerId) return;

      setSelectedReviewerId(newReviewerId);
      setCurrentPage(1); // レビュワー変更時はページをリセット
      updateUrl(
        searchTitle,
        selectedType,
        selectedLevel,
        newReviewerId,
        selectedStatus,
        1
      );
    },
    [
      selectedReviewerId,
      updateUrl,
      searchTitle,
      selectedType,
      selectedLevel,
      selectedStatus,
    ]
  );

  // ステータス選択
  const handleStatusChange = useCallback(
    (status: ExtendedStatus) => {
      // 同じステータスを選択した場合は何もしない
      if (status === selectedStatus) return;

      setSelectedStatus(status);
      setCurrentPage(1); // ステータス変更時はページをリセット
      updateUrl(
        searchTitle,
        selectedType,
        selectedLevel,
        selectedReviewerId,
        status,
        1
      );
    },
    [
      selectedStatus,
      updateUrl,
      searchTitle,
      selectedType,
      selectedLevel,
      selectedReviewerId,
    ]
  );

  // ページ変更
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateUrl(
        searchTitle,
        selectedType,
        selectedLevel,
        selectedReviewerId,
        selectedStatus,
        page
      );
    },
    [
      searchTitle,
      selectedType,
      selectedLevel,
      selectedReviewerId,
      selectedStatus,
      updateUrl,
    ]
  );

  return {
    questions: questionsData?.questions || [],
    reviewers,
    selectedLevel,
    searchTitle,
    selectedReviewerId,
    selectedStatus,
    isLoading,
    setSelectedLevel,
    setSearchTitle,
    setSelectedReviewerId,
    setSelectedStatus,
    handleSearchInputChange,
    handleLevelChange,
    handleReviewerSelect,
    handleStatusChange,
    updateUrl,
    selectedType,
    handleTypeChange,
    totalPages,
    currentPage,
    setCurrentPage,
    handlePageChange,
  };
};

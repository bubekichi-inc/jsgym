import { UserQuestionStatus } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useFetch } from "./useFetch";
import { QuestionLevel } from "@/app/_serevices/AIQuestionGenerateService";
import { api } from "@/app/_utils/api";
import { Question } from "@/app/api/questions/route";
import { Reviewer } from "@/app/api/reviewers/route";

// ステータスの型定義を拡張
type ExtendedStatus = UserQuestionStatus | "NOT_SUBMITTED" | "ALL";

interface UseQuestionsProps {
  limit: number;
  initialTitle?: string;
  initialTab?: QuestionLevel | "ALL";
  initialReviewerId?: number;
  initialStatus?: ExtendedStatus;
}

interface UseQuestionsReturn {
  questions: Question[];
  reviewers: Reviewer[];
  selectedLevel: QuestionLevel | "ALL";
  searchTitle: string;
  selectedReviewerId: number;
  selectedStatus: ExtendedStatus;
  hasMore: boolean;
  isLoading: boolean;
  setSelectedLevel: (tab: QuestionLevel | "ALL") => void;
  setSearchTitle: (title: string) => void;
  setSelectedReviewerId: (reviewerId: number) => void;
  setSelectedStatus: (status: ExtendedStatus) => void;
  handleSearchInputChange: (value: string) => void;
  handleTabChange: (tab: QuestionLevel | "ALL") => void;
  handleReviewerSelect: (reviewerId: number) => void;
  handleStatusChange: (status: ExtendedStatus) => void;
  handleLoadMore: () => void;
  updateUrl: (
    title: string,
    tab: QuestionLevel | "ALL",
    reviewerId: number,
    status: ExtendedStatus
  ) => void;
}

export const useQuestions = ({
  limit,
  initialTitle = "",
  initialTab = "ALL",
  initialReviewerId = 0,
  initialStatus = "ALL",
}: UseQuestionsProps): UseQuestionsReturn => {
  const [selectedLevel, setSelectedLevel] = useState<QuestionLevel | "ALL">(
    initialTab
  );
  const [searchTitle, setSearchTitle] = useState(initialTitle);
  const [selectedReviewerId, setSelectedReviewerId] =
    useState<number>(initialReviewerId);
  const [selectedStatus, setSelectedStatus] =
    useState<ExtendedStatus>(initialStatus);
  const [offset, setOffset] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // レビュワー一覧を取得
  const { data: reviewersData } = useSWR<{ reviewers: Reviewer[] }>(
    "/api/reviewers",
    api.get
  );
  const reviewers = reviewersData?.reviewers || [];

  // 検索パラメータ
  const queryParams = {
    limit: String(limit),
    offset: String(offset),
    title: searchTitle,
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

  // データが取得できたらstateを更新
  useEffect(() => {
    if (questionsData) {
      // 初回ロードかページネーションかを判断
      if (offset === 0) {
        setQuestions(questionsData.questions);
      } else {
        setQuestions((prev) => [...prev, ...questionsData.questions]);
      }
      setHasMore(questionsData.pagination.hasMore);
    }
  }, [questionsData, offset]);

  // URLを更新する関数
  const updateUrl = useCallback(
    (
      title: string,
      tab: QuestionLevel | "ALL",
      reviewerId: number,
      status: ExtendedStatus
    ) => {
      const params = new URLSearchParams();

      if (title) {
        params.append("title", title);
      }

      if (tab !== "ALL") {
        params.append("tab", tab);
      }

      if (reviewerId > 0) {
        params.append("reviewerId", reviewerId.toString());
      }

      if (status !== "ALL") {
        params.append("status", status);
      }

      const queryString = params.toString();
      const url = queryString ? `?${queryString}` : window.location.pathname;

      // pushStateを使用してURLを更新（ページリロードなし）
      window.history.pushState({}, "", url);
      console.log("URL updated:", url);
    },
    []
  );

  // 検索入力のハンドラ
  const handleSearchInputChange = useCallback(
    (value: string) => {
      setSearchTitle(value);
      setOffset(0); // 検索時はoffsetリセット
      updateUrl(value, selectedLevel, selectedReviewerId, selectedStatus);
    },
    [selectedLevel, selectedReviewerId, selectedStatus, updateUrl]
  );

  // タブ切り替え
  const handleTabChange = useCallback(
    (level: QuestionLevel | "ALL") => {
      // 同じタブを選択した場合は何もしない
      if (level === selectedLevel) return;

      console.log("Tab changed:", level);
      setSelectedLevel(level);
      setOffset(0); // タブ切替時はoffsetリセット

      // レビュワー選択はリセットしない（組み合わせて検索できるように）
      updateUrl(searchTitle, level, selectedReviewerId, selectedStatus);
    },
    [selectedLevel, searchTitle, selectedReviewerId, selectedStatus, updateUrl]
  );

  // レビュワー選択
  const handleReviewerSelect = useCallback(
    (reviewerId: number) => {
      console.log("Reviewer selected:", reviewerId);

      // 同じレビュワーを選択した場合は選択解除
      const newReviewerId = reviewerId === selectedReviewerId ? 0 : reviewerId;
      console.log("New reviewer ID:", newReviewerId);

      // 変更がない場合は何もしない
      if (newReviewerId === selectedReviewerId) return;

      setSelectedReviewerId(newReviewerId);
      setOffset(0); // レビュワー変更時はoffsetリセット
      updateUrl(searchTitle, selectedLevel, newReviewerId, selectedStatus);
    },
    [selectedLevel, searchTitle, selectedReviewerId, selectedStatus, updateUrl]
  );

  // ステータス選択
  const handleStatusChange = useCallback(
    (status: ExtendedStatus) => {
      // 同じステータスを選択した場合は何もしない
      if (status === selectedStatus) return;

      console.log("Status changed:", status);
      setSelectedStatus(status);
      setOffset(0); // ステータス変更時はoffsetリセット
      updateUrl(searchTitle, selectedLevel, selectedReviewerId, status);
    },
    [selectedLevel, searchTitle, selectedReviewerId, selectedStatus, updateUrl]
  );

  // 追加ロード
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setOffset((prev) => prev + limit);
    }
  }, [hasMore, isLoading, limit]);

  return {
    questions,
    reviewers,
    selectedLevel,
    searchTitle,
    selectedReviewerId,
    selectedStatus,
    hasMore,
    isLoading,
    setSelectedLevel,
    setSearchTitle,
    setSelectedReviewerId,
    setSelectedStatus,
    handleSearchInputChange,
    handleTabChange,
    handleReviewerSelect,
    handleStatusChange,
    handleLoadMore,
    updateUrl,
  };
};

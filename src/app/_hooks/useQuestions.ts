import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useFetch } from "./useFetch";
import { lessonLevelMap } from "@/app/_constants";
import { QuestionLevel } from "@/app/_serevices/AIQuestionGenerateService";
import { api } from "@/app/_utils/api";
import { Question } from "@/app/api/questions/route";
import { Reviewer } from "@/app/api/reviewers/route";
import { UserQuestionStatus } from "@prisma/client";

interface UseQuestionsProps {
  limit: number;
  initialTitle?: string;
  initialTab?: QuestionLevel | "ALL";
  initialReviewerId?: number;
  initialStatus?: UserQuestionStatus | "ALL";
}

interface UseQuestionsReturn {
  questions: Question[];
  reviewers: Reviewer[];
  activeTab: QuestionLevel | "ALL";
  searchTitle: string;
  selectedReviewerId: number;
  selectedStatus: UserQuestionStatus | "ALL";
  hasMore: boolean;
  isLoading: boolean;
  setActiveTab: (tab: QuestionLevel | "ALL") => void;
  setSearchTitle: (title: string) => void;
  setSelectedReviewerId: (reviewerId: number) => void;
  setSelectedStatus: (status: UserQuestionStatus | "ALL") => void;
  handleSearchInputChange: (value: string) => void;
  handleTabChange: (tab: QuestionLevel | "ALL") => void;
  handleReviewerSelect: (reviewerId: number) => void;
  handleStatusChange: (status: UserQuestionStatus | "ALL") => void;
  handleLoadMore: () => void;
  updateUrl: (
    title: string,
    tab: QuestionLevel | "ALL",
    reviewerId: number,
    status: UserQuestionStatus | "ALL"
  ) => void;
}

export const useQuestions = ({
  limit,
  initialTitle = "",
  initialTab = "ALL",
  initialReviewerId = 0,
  initialStatus = "ALL",
}: UseQuestionsProps): UseQuestionsReturn => {
  const [activeTab, setActiveTab] = useState<QuestionLevel | "ALL">(initialTab);
  const [searchTitle, setSearchTitle] = useState(initialTitle);
  const [selectedReviewerId, setSelectedReviewerId] =
    useState<number>(initialReviewerId);
  const [selectedStatus, setSelectedStatus] = useState<
    UserQuestionStatus | "ALL"
  >(initialStatus);
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
    lessonId: activeTab !== "ALL" ? String(lessonLevelMap[activeTab]) : "",
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
      status: UserQuestionStatus | "ALL"
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
      updateUrl(value, activeTab, selectedReviewerId, selectedStatus);
    },
    [activeTab, selectedReviewerId, selectedStatus, updateUrl]
  );

  // タブ切り替え
  const handleTabChange = useCallback(
    (tab: QuestionLevel | "ALL") => {
      // 同じタブを選択した場合は何もしない
      if (tab === activeTab) return;

      console.log("Tab changed:", tab);
      setActiveTab(tab);
      setOffset(0); // タブ切替時はoffsetリセット

      // レビュワー選択はリセットしない（組み合わせて検索できるように）
      updateUrl(searchTitle, tab, selectedReviewerId, selectedStatus);
    },
    [activeTab, searchTitle, selectedReviewerId, selectedStatus, updateUrl]
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
      updateUrl(searchTitle, activeTab, newReviewerId, selectedStatus);
    },
    [activeTab, searchTitle, selectedReviewerId, selectedStatus, updateUrl]
  );

  // ステータス選択
  const handleStatusChange = useCallback(
    (status: UserQuestionStatus | "ALL") => {
      // 同じステータスを選択した場合は何もしない
      if (status === selectedStatus) return;

      console.log("Status changed:", status);
      setSelectedStatus(status);
      setOffset(0); // ステータス変更時はoffsetリセット
      updateUrl(searchTitle, activeTab, selectedReviewerId, status);
    },
    [activeTab, searchTitle, selectedReviewerId, selectedStatus, updateUrl]
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
    activeTab,
    searchTitle,
    selectedReviewerId,
    selectedStatus,
    hasMore,
    isLoading,
    setActiveTab,
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

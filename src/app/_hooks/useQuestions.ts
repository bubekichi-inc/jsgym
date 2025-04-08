import { QuestionType, UserQuestionStatus } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useFetch } from "./useFetch";
import { QuestionLevel } from "@/app/_serevices/JsQuestionGenerateService";
import { api } from "@/app/_utils/api";
import { Question } from "@/app/api/questions/route";
import { Reviewer } from "@/app/api/reviewers/route";

// ステータスの型定義を拡張
type ExtendedStatus = UserQuestionStatus | "NOT_SUBMITTED" | "ALL";

interface UseQuestionsProps {
  limit: number;
  initialTitle?: string;
  initialType?: QuestionType | "ALL";
  initialLevel?: QuestionLevel | "ALL";
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
  setSelectedLevel: (level: QuestionLevel | "ALL") => void;
  setSearchTitle: (title: string) => void;
  setSelectedReviewerId: (reviewerId: number) => void;
  setSelectedStatus: (status: ExtendedStatus) => void;
  handleSearchInputChange: (value: string) => void;
  handleLevelChange: (level: QuestionLevel | "ALL") => void;
  handleReviewerSelect: (reviewerId: number) => void;
  handleStatusChange: (status: ExtendedStatus) => void;
  handleLoadMore: () => void;
  selectedType: QuestionType | "ALL";
  handleTypeChange: (type: QuestionType | "ALL") => void;
  updateUrl: (
    title: string,
    type: QuestionType | "ALL",
    level: QuestionLevel | "ALL",
    reviewerId: number,
    status: ExtendedStatus
  ) => void;
}

export const useQuestions = ({
  limit,
  initialTitle = "",
  initialType = "ALL",
  initialLevel = "ALL",
  initialReviewerId = 0,
  initialStatus = "ALL",
}: UseQuestionsProps): UseQuestionsReturn => {
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
      type: QuestionType | "ALL",
      level: QuestionLevel | "ALL",
      reviewerId: number,
      status: ExtendedStatus
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
      setOffset(0); // 検索時はoffsetリセット
      updateUrl(
        value,
        selectedType,
        selectedLevel,
        selectedReviewerId,
        selectedStatus
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
      setOffset(0); // タブ切替時はoffsetリセット

      // レビュワー選択はリセットしない（組み合わせて検索できるように）
      updateUrl(
        searchTitle,
        selectedType,
        level,
        selectedReviewerId,
        selectedStatus
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
      setOffset(0); // タイプ変更時はoffsetリセット
      updateUrl(
        searchTitle,
        type,
        selectedLevel,
        selectedReviewerId,
        selectedStatus
      );
    },
    [searchTitle, selectedLevel, selectedReviewerId, selectedStatus, updateUrl]
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
      updateUrl(
        searchTitle,
        selectedType,
        selectedLevel,
        newReviewerId,
        selectedStatus
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

      console.log("Status changed:", status);
      setSelectedStatus(status);
      setOffset(0); // ステータス変更時はoffsetリセット
      updateUrl(
        searchTitle,
        selectedType,
        selectedLevel,
        selectedReviewerId,
        status
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
    handleLevelChange,
    handleReviewerSelect,
    handleStatusChange,
    handleLoadMore,
    updateUrl,
    selectedType,
    handleTypeChange,
  };
};

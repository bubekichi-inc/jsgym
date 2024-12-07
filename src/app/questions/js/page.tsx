"use client";
import { QuetionList } from "../_components/QuetionList";
import { useFetch } from "@/app/_hooks/useFetch";
import { QuestionsResponse } from "@/app/_types/QuestionsResponse";

export default function Page() {
  const { data, error, isLoading } =
    useFetch<QuestionsResponse>("/api/js_questions");
  if (isLoading) return <div>読込み中</div>;
  if (error) return <div>JS問題の取得中にエラーが発生しました</div>;
  if (!data) return <div>JSの問題がありません</div>;
  console.log(data);
  return <QuetionList questions={data} />;
}

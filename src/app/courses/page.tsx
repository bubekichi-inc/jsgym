"use client";
import { api } from "../_utils/api";
import { useEffect, useState } from "react";
import { useSupabaseSession } from "../_hooks/useSupabaseSessoin";
import { CoursesList } from "./_components/CoursesList";
export default function Courses() {
  const { token, isLoading } = useSupabaseSession();
  const [isUserCreated, setIsUserCreated] = useState(false);
  useEffect(() => {
    const postUser = async () => {
      if (isLoading) return;
      if (!token) return;
      try {
        const resp = await api.post<{}, { message: string }>(
          "/api/create_user",
          {}
        );
        setIsUserCreated(true);
      } catch (err) {
        console.error("ユーザー作成API呼び出し中にエラー:", err);
      }
    };
    postUser();
  }, [token, isLoading]);
  return (
    <>
      <h2 className="p-10 text-5xl">Course一覧</h2>
      {!isUserCreated ? (
        <div className="text-center">読込み中...</div>
      ) : (
        <CoursesList />
      )}
    </>
  );
}

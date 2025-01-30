"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/app/_utils/api";
import { GoogleRequest } from "@/app/api/oauth/google/_types/GoogleRequest";
export default function OAuthCallback() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    setAccessToken(token);
  }, []);

  useEffect(() => {
    const postUser = async () => {
      if (!accessToken) return;
      try {
        await api.post<GoogleRequest, { message: string }>(
          "/api/oauth/google",
          { accessToken }
        );
        //プロトタイプはJS問題一覧へ遷移
        router.replace("/courses/1/1");
        return;
      } catch (e) {
        console.error("ユーザー情報の登録に失敗:", e);
      }
    };
    postUser();
  }, [accessToken, router]);

  return <div className="text-center">読込み中...</div>;
}

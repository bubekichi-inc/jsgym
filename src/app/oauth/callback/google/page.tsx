"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { useQuestionDetailRedirect } from "@/app/_hooks/useQuestionDetailRedirect";
import { api } from "@/app/_utils/api";
import { GoogleRequest } from "@/app/api/oauth/google/_types/GoogleRequest";

export default function OAuthCallback() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { mutate } = useMe();
  const { redirectQid, reset } = useQuestionDetailRedirect();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    setAccessToken(token);
  }, []);

  useEffect(() => {
    const postUser = async () => {
      if (!accessToken) {
        await mutate();
        router.replace(redirectQid ? `/q/${redirectQid}` : "/q");
        return;
      }

      try {
        await api.post<GoogleRequest, { message: string }>(
          "/api/oauth/google",
          { accessToken }
        );
        await mutate();
        router.replace(redirectQid ? `/q/${redirectQid}` : "/q");
        reset();
      } catch (e) {
        console.error("ユーザー情報の登録に失敗:", e);
      }
    };
    postUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return <div className="text-center">読込み中...</div>;
}

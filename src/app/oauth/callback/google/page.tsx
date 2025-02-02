"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/app/_utils/api";
import { supabase } from "@/app/_utils/supabase";
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
        const response = await api.post<
          GoogleRequest,
          { message: string; isNewUser: boolean }
        >("/api/oauth/google", { accessToken });

        // 新規ユーザーの場合のみアップロード処理を実行
        if (response.isNewUser) {
          // Supabaseユーザー情報を取得
          const { data: supabaseUser, error: userError } =
            await supabase.auth.getUser(accessToken);

          if (userError || !supabaseUser?.user) {
            console.error("Supabase ユーザーの取得に失敗:", userError?.message);
            return;
          }

          const {
            id: userId,
            user_metadata: { avatar_url: avatarUrl },
          } = supabaseUser.user;

          if (!avatarUrl) {
            console.error("Google アイコンURLが取得できませんでした");
            return;
          }

          // Googleのアイコン画像を取得してFileオブジェクトを作成
          try {
            const response = await fetch(avatarUrl);
            const blob = await response.blob();
            const file = new File([blob], "avatar.jpg", { type: blob.type });

            // Supabase ストレージにアップロード
            const { error: uploadError } = await supabase.storage
              .from("profile_icons")
              .upload(`private/${userId}`, file, {
                upsert: false, // 既存のものがあれば上書き
              });

            if (uploadError) {
              console.error(
                "アイコンのアップロードに失敗:",
                uploadError.message
              );
              return;
            }
          } catch (error) {
            console.error("Google アイコンの取得に失敗:", error);
          }
        }

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

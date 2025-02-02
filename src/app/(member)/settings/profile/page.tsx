"use client";

import Image from "next/image";
import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
// import TextInput from "./_components/TextInput";
import { useFetch } from "@/app/_hooks/useFetch";
import { api } from "@/app/_utils/api";
import { supabase } from "@/app/_utils/supabase";
import { UserProfileUpdateRequest } from "@/app/api/me/_types/UserProfile";

const ProfilePage: React.FC = () => {
  const {
    data: userProfile,
    error,
    isLoading,
    mutate,
  } = useFetch<{
    id: string;
    name: string;
    email: string;
    receiptName: string;
    iconUrl: string | null;
  }>("/api/me");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProfileUpdateRequest>();

  useEffect(() => {
    if (userProfile) {
      const { name, email, receiptName, iconUrl } = userProfile;
      setValue("name", name);
      setValue("email", email);
      setValue("receiptName", receiptName || null);
      setValue("iconUrl", iconUrl || null);
    }
  }, [userProfile, setValue]);

  // **フォーム送信**
  const onSubmit = async (data: UserProfileUpdateRequest) => {
    try {
      await api.put<UserProfileUpdateRequest, void>("/api/me", data);
      await mutate(undefined, { revalidate: true });
      alert("プロフィールが更新されました！");
    } catch (err) {
      console.error("プロフィールの更新に失敗:", err);
      alert("更新に失敗しました");
    }
  };

  // キャッシュ回避用のタイムスタンプを生成
  const getTimestampedUrl = (url: string) => `${url}?t=${new Date().getTime()}`;

  // アイコン画像アップロード
  const handleUpdateIcon = async () => {
    if (!userProfile) return alert("ユーザーデータが取得できていません");

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("画像を選択してください。");
      return;
    }

    const filePath = `private/${userProfile.id}`;

    //現在のファイルが存在するか確認
    const { data: fileList, error: listError } = await supabase.storage
      .from("profile_icons")
      .list("private", { search: userProfile.id });

    if (listError) {
      console.error("ファイル一覧の取得に失敗:", listError.message);
      return;
    }

    const fileExists = fileList?.some((file) => file.name === userProfile.id);
    const uploadMethod = fileExists ? "update" : "upload";
    const { error: uploadError } = await supabase.storage
      .from("profile_icons")
      [uploadMethod](filePath, file, { cacheControl: "3600", upsert: true });
    if (uploadError) {
      console.error("アイコンのアップロードに失敗:", uploadError.message);
      return;
    }

    //アップロード成功後、URL 取得
    const { data } = await supabase.storage
      .from("profile_icons")
      .getPublicUrl(filePath);
    const newIconUrl = getTimestampedUrl(data.publicUrl);

    try {
      // **API を介してデータベースを更新**
      await api.put<{ iconUrl: string }, void>("/api/me", {
        iconUrl: newIconUrl,
      });

      // **ブラウザの表示を即時更新**
      setValue("iconUrl", newIconUrl);
      await mutate((prev) => (prev ? { ...prev, iconUrl: newIconUrl } : prev), {
        revalidate: false,
      });

      alert("アイコンが更新されました！");
    } catch (err) {
      console.error("アイコン更新失敗:", err);
      alert("アイコンの更新に失敗しました");
    }
  };

  // **アイコン画像削除**
  const handleDeleteIcon = async () => {
    try {
      await api.put<{ iconUrl: null }, void>("/api/me", { iconUrl: null });
      setValue("iconUrl", null);
      await mutate(undefined, { revalidate: true });
      alert("アイコンが削除されました！");
    } catch (err) {
      console.error("アイコン削除失敗:", err);
      alert("アイコンの削除に失敗しました");
    }
  };

  if (isLoading) return <p>読み込み中...</p>;
  if (error)
    return <p className="text-red-500">データ取得に失敗: {error.message}</p>;

  return (
    <>
      <div className="mx-auto  w-full max-w-2xl">
        <div className="flex flex-col gap-y-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-y-6"
          >
            <div>
              <h3 className="mb-4 text-xl font-bold">ユーザーアイコン</h3>
              <div className="flex items-center gap-x-4">
                {userProfile?.iconUrl ? (
                  <Image
                    src={userProfile.iconUrl}
                    alt="アイコン"
                    width={80}
                    height={80}
                    className="size-20 rounded-full border"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-full border text-gray-700">
                    No Icon
                  </div>
                )}

                <button
                  type="button"
                  className="rounded border bg-gray-100 px-4 py-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  変更
                </button>
                <button
                  type="button"
                  className="rounded bg-red-500 px-4 py-2 text-white"
                  onClick={handleDeleteIcon}
                >
                  削除
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleUpdateIcon}
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="mb-1 block text-lg font-bold">
                名前
              </label>
              <input
                id="name"
                type="text"
                className="w-full rounded border px-4 py-2"
                {...register("name", {
                  required: "名前は必須です。",
                  maxLength: {
                    value: 30,
                    message: "名前は30文字以内で入力してください。",
                  },
                })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-lg font-bold">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded border px-4 py-2"
                {...register("email", {
                  required: "メールアドレスは必須です。",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "正しいメールアドレス形式で入力してください。",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="receiptName"
                className="mb-1 block text-lg font-bold"
              >
                領収書記載名
              </label>
              <input
                id="receiptName"
                type="text"
                placeholder="株式会社HOGEHOGE"
                className="w-full rounded border px-4 py-2"
                {...register("receiptName", {
                  maxLength: {
                    value: 50,
                    message: "領収書記載名は50文字以内で入力してください。",
                  },
                })}
              />
              {errors.receiptName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.receiptName.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white"
            >
              保存
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

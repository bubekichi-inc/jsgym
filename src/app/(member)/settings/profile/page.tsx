"use client";

import Image from "next/image";
import NextLink from "next/link";
import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFetch } from "@/app/_hooks/useFetch";
import { api } from "@/app/_utils/api";
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

  // 初期データをフォームにセット
  useEffect(() => {
    if (userProfile) {
      setValue("name", userProfile.name || "");
      setValue("email", userProfile.email || "");
      setValue("receiptName", userProfile.receiptName || "");
    }
  }, [userProfile, setValue]);

  // **フォーム送信**
  const onSubmit: (data: UserProfileUpdateRequest) => Promise<void> = async (
    data
  ) => {
    try {
      await api.put<UserProfileUpdateRequest, void>("/api/me", data);
      await mutate(); // SWR キャッシュを更新
      alert("プロフィールが更新されました！");
    } catch (err) {
      console.error("プロフィールの更新に失敗:", err);
      alert("更新に失敗しました");
    }
  };

  // **アイコン画像アップロード**
  const handleUpdateIcon = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("画像を選択してください。");
      return;
    }

    const formData = new globalThis.FormData();
    formData.append("icon", file);

    try {
      await api.post<FormData, void>("/api/me", formData);
      await mutate();
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
      await mutate();
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
      <div className="mx-auto mt-[100px] w-full max-w-2xl">
        <div className="flex flex-col gap-y-6">
          <h2 className="text-3xl font-bold">各種設定</h2>
          <div className="flex gap-x-12">
            <div className="border-b-2 border-black pb-1">
              <h3 className="px-6 text-xl font-bold"> プロフィール</h3>
            </div>
            <NextLink
              href="/settings/points"
              className="px-6 pb-1 text-xl font-bold text-gray-500"
            >
              ポイント購入
            </NextLink>
            <NextLink
              href="#"
              className="px-6 pb-1 text-xl font-bold text-gray-500"
            >
              通知設定
            </NextLink>
          </div>

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

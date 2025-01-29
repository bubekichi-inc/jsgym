"use client";

import Image from "next/image";
import NextLink from "next/link";
import React, { useRef, useState } from "react";
import { useFetch } from "@/app/_hooks/useFetch";

const ProfilePage = () => {
  const {
    data: userProfile,
    error,
    isLoading,
    mutate,
  } = useFetch<{
    name: string;
    email: string;
    receiptName: string;
    iconUrl: string;
  }>("/api/me");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    receiptName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({
    name: "",
    email: "",
    receiptName: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 初期データをフォームにセット
  React.useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        receiptName: userProfile.receiptName || "",
      });
    }
  }, [userProfile]);

  // フォームの値を変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // バリデーションチェック
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name) {
      errors.name = "名前は必須です。";
    } else if (formData.name.length > 30) {
      errors.name = "名前は30文字以内で入力してください。";
    }

    if (!formData.email) {
      errors.email = "メールアドレスは必須です。";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "正しいメールアドレス形式で入力してください。";
    }

    if (formData.receiptName && formData.receiptName.length > 50) {
      errors.receiptName = "領収書記載名は50文字以内で入力してください。";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // フォームを送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("/api/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("更新に失敗しました");
      }
      await mutate(); // SWR キャッシュを更新
      alert("プロフィールが更新されました！");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };
  // アイコン画像更新
  const handleUpdateIcon = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("画像を選択してください。");
      return;
    }

    const formData = new FormData();
    formData.append("icon", file);

    try {
      const response = await fetch("/api/me", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("アイコン更新に失敗しました");
      }
      await mutate(); // SWR キャッシュを更新
      alert("アイコンが更新されました！");
    } catch (err) {
      console.error("Error updating icon:", err);
    }
  };
  // アイコン画像削除
  const handleDeleteIcon = async () => {
    try {
      const response = await fetch("/api/me", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("アイコン削除に失敗しました");
      }
      await mutate(); // SWR キャッシュを更新
      alert("アイコンが削除されました！");
    } catch (err) {
      console.error("Error deleting icon:", err);
    }
  };

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500">
        データの取得に失敗しました: {error.message}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-y-6">
      <h2 className="text-3xl font-bold">プロフィール設定</h2>

      <div className="flex gap-x-12">
        <div className="border-b-2 border-black  pb-1">
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
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-y-6">
        <div>
          <h3 className="mb-4 text-xl font-bold">ユーザーアイコン</h3>
          <div className="flex items-center gap-x-4">
            {userProfile?.iconUrl ? (
              <Image
                src={userProfile.iconUrl}
                alt="ユーザーアイコン"
                width={80} // 画像の幅を指定
                height={80} // 画像の高さを指定
                className="size-20 rounded-full border"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full border text-gray-700">
                No Icon
              </div>
            )}
            <button
              type="button"
              className="rounded border border-slate-700 bg-gray-100 px-4 py-2"
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
            {/* ファイルアップロードインプット（非表示） */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleUpdateIcon}
            />
          </div>
        </div>

        {/* 名前 */}
        <div>
          <label htmlFor="name" className="mb-1 block text-lg font-bold">
            名前
          </label>
          <input
            id="name"
            type="text"
            className="w-full rounded border px-4 py-2"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* メールアドレス */}
        <div>
          <label htmlFor="email" className="mb-1 block text-lg font-bold">
            通知先メールアドレス
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded border px-4 py-2"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* 領収書記載名 */}
        <div>
          <label
            htmlFor="receiptName "
            className="mb-1 block text-lg font-bold"
          >
            領収書に記載する名前
          </label>
          <input
            id="receiptName"
            type="text"
            placeholder="株式会社HOGEHOGE"
            className="w-full rounded border px-4 py-2"
            value={formData.receiptName}
            onChange={handleChange}
          />
          {errors.receiptName && (
            <p className="mt-1 text-sm text-red-500">{errors.receiptName}</p>
          )}
        </div>

        {/* 保存ボタン */}
        <button
          type="submit"
          className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white"
        >
          保存
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;

"use client";
import {
  faUpload,
  faUser,
  faSave,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Reviewer } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { api } from "@/app/_utils/api";
import { updateSupabaseImage } from "@/app/_utils/updateSupabaseImage";

export type ReviewerFormData = {
  name: string;
  bio: string;
  hiddenProfile: string;
  profileImageUrl: string;
  userId?: string;
  fired: boolean;
};

type ReviewerFormProps = {
  initialData?: Reviewer;
  isNew?: boolean;
};

export const ReviewerForm = ({
  initialData,
  isNew = false,
}: ReviewerFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ReviewerFormData>({
    name: initialData?.name || "",
    bio: initialData?.bio || "",
    hiddenProfile: initialData?.hiddenProfile || "",
    profileImageUrl: initialData?.profileImageUrl || "",
    userId: initialData?.userId || "",
    fired: initialData?.fired || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData?.profileImageUrl || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 画像選択ハンドラー
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // プレビュー表示
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setLoading(true);
    setError("");

    try {
      // ダミーのユーザーIDを使用する場合（新規作成時など）
      const userId = initialData?.id?.toString() || "new_reviewer";

      // Supabaseに画像をアップロード
      const result = await updateSupabaseImage({
        bucketName: "profile_icons",
        userId,
        file,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          profileImageUrl: result.imageUrl || "",
        }));
      }
    } catch (err) {
      setError("画像のアップロードに失敗しました。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.bio || !formData.hiddenProfile) {
      setError("必須項目をすべて入力してください");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isNew) {
        // 新規作成
        console.log(formData);
        await api.post("/api/admin/reviewers", formData);

        router.push("/admin/reviewers");
      } else if (initialData) {
        // 更新
        await api.put(`/api/admin/reviewers/${initialData.id}`, formData);

        router.push("/admin/reviewers");
      }
    } catch (err) {
      setError("エラーが発生しました。ネットワーク接続を確認してください。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 入力フィールド変更ハンドラー
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // チェックボックス変更ハンドラー
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isNew ? "レビュワーを新規作成" : "レビュワー情報を編集"}
        </h1>
        <button
          onClick={() => router.push("/admin/reviewers")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          一覧に戻る
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="mb-2 block font-semibold text-gray-700">
            プロフィール画像
          </label>
          <div className="flex items-center">
            <div className="relative mr-4 size-24 overflow-hidden rounded-full bg-gray-100">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="プロフィール画像"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <FontAwesomeIcon icon={faUser} size="2x" />
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center rounded-md bg-blue-50 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-100"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                画像を選択
              </button>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, GIF (最大5MB)
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            className="mb-2 block font-semibold text-gray-700"
            htmlFor="name"
          >
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="mb-2 block font-semibold text-gray-700"
            htmlFor="bio"
          >
            公開プロフィール <span className="text-red-500">*</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            ユーザーに公開されるプロフィール情報です
          </p>
        </div>

        <div className="mb-4">
          <label
            className="mb-2 block font-semibold text-gray-700"
            htmlFor="hiddenProfile"
          >
            非公開プロフィール <span className="text-red-500">*</span>
          </label>
          <textarea
            id="hiddenProfile"
            name="hiddenProfile"
            value={formData.hiddenProfile}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            管理者のみ閲覧可能な詳細情報です
          </p>
        </div>

        <div className="mb-4">
          <label
            className="mb-2 block font-semibold text-gray-700"
            htmlFor="userId"
          >
            ユーザーID
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId || ""}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            システム上のユーザーと紐付ける場合はIDを入力（オプション）
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="fired"
              name="fired"
              checked={formData.fired}
              onChange={handleCheckboxChange}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              className="ml-2 block font-semibold text-gray-700"
              htmlFor="fired"
            >
              退職済み
            </label>
          </div>
          <p className="mt-1 pl-6 text-xs text-gray-500">
            退職したレビュワーはこのチェックを入れてください
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {loading ? "処理中..." : isNew ? "作成する" : "更新する"}
          </button>
        </div>
      </form>
    </div>
  );
};

import Image from "next/image";
import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useMe } from "../../../_hooks/useMe";
import { updateSupabaseImage } from "@/app/_utils/updateSupabaseImage";

export const ProfileIcon: React.FC = () => {
  const { data: userProfile } = useMe();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formContext = useFormContext(); // ✅ まず useFormContext() を取得
  if (!formContext) return null;
  const { setValue, watch, formState } = formContext;
  const isSubmitting = formState?.isSubmitting || false;
  const iconUrl = watch("iconUrl");
  const userId = userProfile?.id;

  const handleUpdateIcon = async () => {
    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file || !userId) {
        alert("画像を選択してください。");
        return;
      }

      const { imageUrl, error } = await updateSupabaseImage({
        bucketName: "profile_icons",
        userId,
        file,
      });

      if (!imageUrl) {
        throw new Error(error || "画像のアップロードに失敗しました。");
      }

      setValue("iconUrl", imageUrl);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "予期しないエラーが発生しました。"
      );
    }
  };

  const handleDeleteIcon = async () => {
    setValue("iconUrl", null);
  };

  return (
    <div className="flex items-center gap-x-4">
      {iconUrl ? (
        <Image
          src={iconUrl}
          alt="アイコン"
          width={80}
          height={80}
          className="size-20 rounded-full border object-cover"
        />
      ) : (
        <div className="flex size-20 items-center justify-center rounded-full border text-gray-700">
          No Icon
        </div>
      )}

      {iconUrl ? (
        <>
          <button
            type="button"
            className="rounded border bg-gray-100 px-4 py-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
          >
            更新
          </button>
          <button
            type="button"
            className="rounded bg-red-500 px-4 py-2 text-white"
            onClick={handleDeleteIcon}
            disabled={isSubmitting}
          >
            削除
          </button>
        </>
      ) : (
        <button
          type="button"
          className="rounded border bg-gray-100 px-4 py-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSubmitting}
        >
          アップロード
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleUpdateIcon}
        disabled={isSubmitting}
      />
    </div>
  );
};

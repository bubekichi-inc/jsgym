import Image from "next/image";
import React, { useRef } from "react";
import { supabase } from "@/app/_utils/supabase";

interface Props {
  userId: string;
  iconUrl: string | null;
  setValue: (iconUrl: string | null) => void;
  disabled?: boolean;
}

export const ProfileIcon: React.FC<Props> = ({
  userId,
  iconUrl,
  setValue,
  disabled,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const getTimestampedUrl = (url: string) => `${url}?t=${new Date().getTime()}`;

  const handleUpdateIcon = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("画像を選択してください。");
      return;
    }

    const filePath = `private/${userId}`;

    const { data: fileList, error: listError } = await supabase.storage
      .from("profile_icons")
      .list("private", { search: userId });

    if (listError) {
      console.error("ファイル一覧の取得に失敗:", listError.message);
      return;
    }

    const fileExists = fileList?.some((file) => file.name === userId);
    const uploadMethod = fileExists ? "update" : "upload";

    const { error: uploadError } = await supabase.storage
      .from("profile_icons")
      [uploadMethod](filePath, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      console.error("アイコンのアップロードに失敗:", uploadError.message);
      return;
    }

    const { data } = await supabase.storage
      .from("profile_icons")
      .getPublicUrl(filePath);

    const newIconUrl = getTimestampedUrl(data.publicUrl);
    setValue(newIconUrl);
  };

  const handleDeleteIcon = async () => {
    setValue(null);
  };

  return (
    <div className="flex items-center gap-x-4">
      {iconUrl ? (
        <Image
          src={iconUrl}
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
        disabled={disabled}
      >
        変更
      </button>
      <button
        type="button"
        className="rounded bg-red-500 px-4 py-2 text-white"
        onClick={handleDeleteIcon}
        disabled={disabled}
      >
        削除
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleUpdateIcon}
        disabled={disabled}
      />
    </div>
  );
};

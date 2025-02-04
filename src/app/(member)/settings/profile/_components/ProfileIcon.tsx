import Image from "next/image";
import React from "react";

interface Props {
  iconUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleUpdateIcon: () => Promise<void>;
  handleDeleteIcon: () => Promise<void>;
}

const ProfileIcon: React.FC<Props> = ({
  iconUrl,

  fileInputRef,
  handleUpdateIcon,
  handleDeleteIcon,
}) => {
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
  );
};

export default ProfileIcon;

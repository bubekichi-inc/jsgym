"use client";

import React from "react";
import { ProfileIcon } from "./_components/ProfileIcon";
import { TextInput } from "./_components/TextInput";
import { useProfileForm } from "./_hooks/useProfileForm";
import { Button } from "@/app/_components/Button";

const ProfilePage: React.FC = () => {
  const {
    userProfile,
    error,
    fileInputRef,
    register,
    handleSubmit,
    errors,
    onSubmit,
    iconUrl,
    handleUpdateIcon,
    handleDeleteIcon,
  } = useProfileForm();

  // const {
  //   setValue,

  //   // formState: { errors },
  // } = useForm<UserProfileUpdateRequest>();

  // const getTimestampedUrl = (url: string) => `${url}?t=${new Date().getTime()}`;

  // const handleUpdateIcon = async () => {
  //   if (!userProfile) return alert("ユーザーデータが取得できていません");

  //   const file = fileInputRef.current?.files?.[0];
  //   if (!file) {
  //     alert("画像を選択してください。");
  //     return;
  //   }

  //   const filePath = `private/${userProfile.id}`;

  //   const { data: fileList, error: listError } = await supabase.storage
  //     .from("profile_icons")
  //     .list("private", { search: userProfile.id });

  //   if (listError) {
  //     console.error("ファイル一覧の取得に失敗:", listError.message);
  //     return;
  //   }

  //   const fileExists = fileList?.some((file) => file.name === userProfile.id);
  //   const uploadMethod = fileExists ? "update" : "upload";

  //   const { error: uploadError } = await supabase.storage
  //     .from("profile_icons")
  //     [uploadMethod](filePath, file, { cacheControl: "3600", upsert: true });

  //   if (uploadError) {
  //     console.error("アイコンのアップロードに失敗:", uploadError.message);
  //     return;
  //   }

  //   const { data } = await supabase.storage
  //     .from("profile_icons")
  //     .getPublicUrl(filePath);

  //   const newIconUrl = getTimestampedUrl(data.publicUrl);
  //   setValue("iconUrl", newIconUrl);
  // };

  // const handleDeleteIcon = async () => {
  //   setValue("iconUrl", null);
  // };

  if (!userProfile) return <p>読み込み中...</p>;
  if (error)
    return <p className="text-red-500">データ取得に失敗: {error.message}</p>;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex flex-col gap-y-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-y-6"
        >
          <div>
            <h3 className="mb-4 text-xl font-bold">ユーザーアイコン</h3>
            <ProfileIcon
              iconUrl={iconUrl}
              fileInputRef={fileInputRef}
              handleUpdateIcon={handleUpdateIcon}
              handleDeleteIcon={handleDeleteIcon}
            />
          </div>

          <TextInput
            id="name"
            label="名前"
            register={register}
            errors={errors}
            validationRules={{
              required: "名前は必須です。",
              maxLength: {
                value: 30,
                message: "名前は30文字以内で入力してください。",
              },
            }}
          />

          <TextInput
            id="email"
            label="連絡先メールアドレス"
            type="email"
            register={register}
            errors={errors}
            validationRules={{
              required: "メールアドレスは必須です。",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "正しいメールアドレス形式で入力してください。",
              },
            }}
          />

          <TextInput
            id="receiptName"
            label="領収書に記載する名前"
            type="text"
            register={register}
            errors={errors}
            validationRules={{
              maxLength: {
                value: 50,
                message: "領収書記載名は50文字以内で入力してください。",
              },
            }}
            placeholder="株式会社HOGEHOGE"
          />

          {/* ✅ Button.tsx を適用 */}
          <Button type="submit" variant="w-full">
            保存
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

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
    register,
    handleSubmit,
    errors,
    onSubmit,
    iconUrl,
    setValue,
    isSubmitting,
  } = useProfileForm();

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
              userProfile={userProfile}
              setValue={setValue}
              disabled={isSubmitting}
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
            disabled={isSubmitting}
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

          <Button type="submit" variant="w-full">
            保存
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

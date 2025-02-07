import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMe } from "../_hooks/useMe";
import { api } from "@/app/_utils/api";

import { UserProfileUpdateRequest } from "@/app/api/me/_types/UserProfile";

export const useProfileForm = () => {
  const { data: userProfile, error, mutate } = useMe();
  // const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserProfileUpdateRequest>();

  const resetForm = useCallback(() => {
    if (userProfile) {
      const { name, email, receiptName, iconUrl } = userProfile;

      reset({
        name: name || "",
        email: email || "",
        receiptName: receiptName || null,
        iconUrl: iconUrl || null,
      });
    }
  }, [userProfile, reset]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const iconUrl = watch("iconUrl");

  const onSubmit = async (data: UserProfileUpdateRequest) => {
    try {
      await api.put<UserProfileUpdateRequest, { message: string }>(
        "/api/me",
        data
      );
      await mutate();
      alert("プロフィールを更新しました。");
    } catch (err) {
      console.error("プロフィールの更新に失敗:", err);
      alert("更新に失敗しました");
    }
  };

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

  return {
    userProfile,
    error,
    // fileInputRef,
    register,
    handleSubmit,
    errors,
    onSubmit,
    iconUrl,
    watch,
    setValue,
    // handleUpdateIcon,
    // handleDeleteIcon,
  };
  // return {
  //   userProfile,
  //   error,
  //   register,
  //   onSubmit,
  //   handleSubmit: handleSubmit(onSubmit),
  //   errors,
  //   watch,
  //   setValue,
  // };
};

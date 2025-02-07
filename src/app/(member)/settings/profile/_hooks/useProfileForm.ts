import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMe } from "../_hooks/useMe";
import { api } from "@/app/_utils/api";
import { UserProfileUpdateRequest } from "@/app/api/me/_types/UserProfile";

export const useProfileForm = () => {
  const { data: userProfile, error, mutate } = useMe();

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

  return {
    userProfile,
    error,
    register,
    handleSubmit,
    errors,
    onSubmit,
    iconUrl,
    watch,
    setValue,
  };
};

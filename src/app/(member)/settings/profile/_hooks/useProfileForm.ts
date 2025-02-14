import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMe } from "../_hooks/useMe";
import { api } from "@/app/_utils/api";
import { UserProfileUpdateRequest } from "@/app/api/me/_types/UserProfile";

export const useProfileForm = () => {
  const { data: userProfile, mutate } = useMe();

  const formMethods = useForm<UserProfileUpdateRequest>();

  useEffect(() => {
    if (!userProfile) return;
    const { name, email, receiptName, iconUrl } = userProfile;

    formMethods.reset({
      name: name || "",
      email: email || "",
      receiptName: receiptName,
      iconUrl: iconUrl,
    });
  }, [userProfile, formMethods]);

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
    ...formMethods,
    onSubmit,
  };
};

"use client";

import { useCallback } from "react";
import { useFetch } from "../useFetch";
import { toast } from "react-toastify";
import { api } from "../../_utils/api";
import { 
  ForumCategoriesResponse, 
  CreateCategoryRequest,
  CreateCategoryResponse
} from "../../api/forum/categories/route";
import { 
  ForumCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse
} from "../../api/forum/categories/[slug]/route";

interface UseForumCategoriesProps {
  initialSlug?: string;
}

export const useForumCategories = (props?: UseForumCategoriesProps) => {
  const { initialSlug } = props || {};

  // すべてのカテゴリを取得
  const { data: categoriesData, isLoading: isLoadingCategories, mutate: mutateCategories } = 
    useFetch<ForumCategoriesResponse>("/api/forum/categories");

  // 特定のカテゴリを取得
  const { data: categoryData, isLoading: isLoadingCategory, mutate: mutateCategory } = 
    useFetch<ForumCategoryResponse>(
      initialSlug ? `/api/forum/categories/${initialSlug}` : null
    );

  // カテゴリの作成（管理者用）
  const createCategory = useCallback(async (data: CreateCategoryRequest) => {
    try {
      const response = await api.post<CreateCategoryRequest, CreateCategoryResponse>("/api/forum/categories", data);
      toast.success("カテゴリが作成されました");
      await mutateCategories();
      return response;
    } catch (error) {
      console.error("カテゴリの作成に失敗しました:", error);
      toast.error("カテゴリの作成に失敗しました");
      throw error;
    }
  }, [mutateCategories]);

  // カテゴリの更新（管理者用）
  const updateCategory = useCallback(async (slug: string, data: UpdateCategoryRequest) => {
    try {
      const response = await api.put<UpdateCategoryRequest, UpdateCategoryResponse>(`/api/forum/categories/${slug}`, data);
      toast.success("カテゴリが更新されました");
      await Promise.all([
        mutateCategories(),
        initialSlug === slug ? mutateCategory() : Promise.resolve()
      ]);
      return response;
    } catch (error) {
      console.error("カテゴリの更新に失敗しました:", error);
      toast.error("カテゴリの更新に失敗しました");
      throw error;
    }
  }, [mutateCategories, mutateCategory, initialSlug]);

  // カテゴリの削除（管理者用）
  const deleteCategory = useCallback(async (slug: string) => {
    if (!confirm("このカテゴリを削除しますか？関連するすべてのスレッドと投稿も削除されます。")) {
      return false;
    }

    try {
      await api.del(`/api/forum/categories/${slug}`);
      toast.success("カテゴリが削除されました");
      await mutateCategories();
      return true;
    } catch (error) {
      console.error("カテゴリの削除に失敗しました:", error);
      toast.error("カテゴリの削除に失敗しました");
      return false;
    }
  }, [mutateCategories]);

  return {
    // カテゴリ一覧
    categories: categoriesData?.categories || [],
    isLoadingCategories,
    mutateCategories,
    
    // 特定のカテゴリ
    category: categoryData?.category,
    isLoadingCategory,
    mutateCategory,
    
    // カテゴリ管理関数
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
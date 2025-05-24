"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "@/app/_utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faEye,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { UpdateCategoryRequest, CommunityCategoriesResponse } from "@/app/api/community/categories/route";

interface Category {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  threadCount: number;
}

interface EditModalProps {
  category: Category;
  onClose: () => void;
  onSave: (category: Category) => void;
}

function EditCategoryModal({ category, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState({
    title: category.title,
    description: category.description || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error("タイトルは必須項目です");
      return;
    }

    setIsSubmitting(true);

    try {
      // 注意: スラグは変更しない（URLが変わるとリンク切れの原因になるため）
      const updateData: UpdateCategoryRequest = {
        title: formData.title,
        description: formData.description || undefined,
      };

      await api.put(`/api/community/categories/${category.slug}`, updateData);
      
      toast.success("カテゴリを更新しました");
      
      // 親コンポーネントに更新を通知
      onSave({
        ...category,
        title: formData.title,
        description: formData.description,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(
        error.response?.data?.error || "カテゴリの更新に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">カテゴリ編集</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} className="size-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              スラグ
            </label>
            <input
              type="text"
              value={category.slug}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              disabled
            />
            <p className="mt-1 text-xs text-gray-500">
              スラグはURLに使用されるため変更できません
            </p>
          </div>
          
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              カテゴリタイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              説明
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "更新中..." : "更新"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CommunityCategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = search 
        ? `/api/community/categories?search=${encodeURIComponent(search)}`
        : "/api/community/categories";
        
      const response = await api.get<CommunityCategoriesResponse>(url);
      setCategories(response.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("カテゴリの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCategories();
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchCategories();
  };

  const confirmDelete = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await api.delete(`/api/community/categories/${categoryToDelete.slug}`);
      toast.success("カテゴリを削除しました");
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(
        error.response?.data?.error || "カテゴリの削除に失敗しました"
      );
    } finally {
      setCategoryToDelete(null);
    }
  };

  const handleCategoryUpdate = (updatedCategory: Category) => {
    setCategories(
      categories.map(c => 
        c.id === updatedCategory.id ? updatedCategory : c
      )
    );
    setEditingCategory(null);
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && categories.length === 0) {
    return <div className="text-center py-4">読み込み中...</div>;
  }

  if (error && categories.length === 0) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4 flex">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="カテゴリを検索..."
            className="block w-full rounded-l-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-400 hover:text-gray-600"
              />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          検索
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                タイトル
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                スラグ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                スレッド数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                作成日時
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  カテゴリがありません
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {category.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {category.slug}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {category.threadCount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/community/categories/${category.slug}`}
                        target="_blank"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FontAwesomeIcon icon={faEye} title="表示" />
                      </Link>
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FontAwesomeIcon icon={faEdit} title="編集" />
                      </button>
                      <button
                        onClick={() => confirmDelete(category)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FontAwesomeIcon icon={faTrash} title="削除" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 編集モーダル */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleCategoryUpdate}
        />
      )}

      {/* 削除確認モーダル */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium">カテゴリの削除</h3>
            <p className="mb-4 text-sm text-gray-600">
              本当に「{categoryToDelete.title}」を削除しますか？
              {categoryToDelete.threadCount > 0 && (
                <span className="mt-2 block font-semibold text-red-600">
                  警告: このカテゴリには{categoryToDelete.threadCount}件のスレッドがあります。
                  削除するとすべてのスレッドと投稿も削除されます。
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
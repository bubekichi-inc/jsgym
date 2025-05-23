"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/app/_utils/api";
import { CreateCategoryRequest } from "@/app/api/community/categories/route";

export default function CommunityCategoryForm() {
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    description: string;
  }>({
    title: "",
    slug: "",
    description: "",
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

  const generateSlug = () => {
    if (!formData.title) {
      toast.error("タイトルを入力してください");
      return;
    }
    
    // タイトルをもとにスラグを生成（日本語はローマ字変換せず、英数字のみ抽出して小文字に変換）
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    if (!slug) {
      toast.error("有効なスラグを生成できませんでした。英数字を含むタイトルを入力してください。");
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error("タイトルとスラグは必須項目です");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post<CreateCategoryRequest>("/api/community/categories", {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
      });
      
      toast.success("カテゴリを作成しました");
      
      // フォームをリセット
      setFormData({
        title: "",
        slug: "",
        description: "",
      });
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast.error(
        error.response?.data?.error || "カテゴリの作成に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          htmlFor="slug"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          スラグ <span className="text-red-500">*</span>
        </label>
        <div className="flex">
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="mt-1 block w-full rounded-l-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            disabled={isSubmitting}
            required
          />
          <button
            type="button"
            onClick={generateSlug}
            className="mt-1 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            自動生成
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          URLに使用される識別子です（例: javascript-basics）
        </p>
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

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "作成中..." : "カテゴリを作成"}
        </button>
      </div>
    </form>
  );
}
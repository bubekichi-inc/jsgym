import CommunityCategoryForm from "./_components/CommunityCategoryForm";
import CommunityCategoryList from "./_components/CommunityCategoryList";

export const metadata = {
  title: "コミュニティカテゴリ管理 | JSGym管理画面",
  description: "JSGym管理画面のコミュニティカテゴリ管理ページです",
};

export default function CommunityCategoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">コミュニティカテゴリ管理</h1>
        <p className="text-gray-600">
          コミュニティ機能で使用するカテゴリの作成、編集、削除ができます。
        </p>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">新規カテゴリ作成</h2>
        <CommunityCategoryForm />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">カテゴリ一覧</h2>
        <CommunityCategoryList />
      </div>
    </div>
  );
}
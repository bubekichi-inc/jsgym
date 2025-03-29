import QuestionTagList from "./_components/QuestionTagList";

export const metadata = {
  title: "問題タグ管理 | JSGym管理画面",
  description: "JSGym管理画面の問題タグ管理ページです",
};

export default function QuestionTagsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">問題タグ管理</h1>
        <p className="text-gray-600">
          問題に関連付けるタグの管理ができます。タグの作成、編集、削除が可能です。
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <QuestionTagList />
      </div>
    </div>
  );
}

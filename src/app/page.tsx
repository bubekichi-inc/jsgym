"use client";

import { useState, useEffect } from "react";
import { SimpleConsole } from "./_components/SimpleConsole";

const initialCode = `export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reactサンプルアプリ</h1>
      <p className="mb-2">これはサンプルアプリです。</p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => console.log('ボタンがクリックされました！')}
      >
        クリックしてログを表示
      </button>
    </div>
  );
}`;

export default function Home() {
  const [files, setFiles] = useState<Record<string, string>>({
    "/App.tsx": initialCode,
  });
  const [code, setCode] = useState(initialCode);

  // コードが変更されたらファイルを更新
  useEffect(() => {
    setFiles({
      "/App.tsx": code,
    });
  }, [code]);

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-col items-center p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">JSGym - シンプルコンソール</h1>
        <p className="text-gray-600 mt-2">
          コードを編集してコンソール出力を確認できます
        </p>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* コードエディタ部分 */}
        <div className="w-full lg:w-1/2 p-4 border-r border-gray-200">
          <div className="mb-2 flex justify-between items-center">
            <h2 className="text-lg font-semibold">コードエディタ</h2>
          </div>
          <textarea
            className="w-full h-[500px] p-4 font-mono text-sm border border-gray-300 rounded"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* シンプルコンソール部分 */}
        <div className="w-full lg:w-1/2">
          <SimpleConsole files={files} />
        </div>
      </div>
    </main>
  );
}

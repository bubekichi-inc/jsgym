"use client";

import { useState, useEffect } from "react";
import SimpleConsole from "./_components/SimpleConsole";

export default function Home() {
  const [code, setCode] =
    useState<string>(`// ここにJavaScriptコードを入力してください
console.log("Hello, World!");
console.info("これは情報メッセージです");
console.warn("これは警告メッセージです");
console.error("これはエラーメッセージです");

// オブジェクトも表示できます
const user = {
  name: "山田太郎",
  age: 30,
  hobbies: ["読書", "旅行", "プログラミング"],
  address: {
    city: "東京",
    zipCode: "123-4567"
  }
};

console.log("ユーザー情報:", user);

// 配列
const numbers = [1, 2, 3, 4, 5];
console.log("数値配列:", numbers);

// 関数も表示できます
function greet(name) {
  return \`こんにちは、\${name}さん!\`;
}

console.log("関数:", greet);
console.log("関数実行結果:", greet("山田"));

// 数学計算
console.log("計算結果:", 123 * 456);
`);

  const [files, setFiles] = useState<
    Record<string, { content: string; type: string }>
  >({});

  // コードが変更されたらファイルを更新
  useEffect(() => {
    setFiles({
      "script.js": {
        content: code,
        type: "javascript",
      },
    });
  }, [code]);

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          JavaScriptコンソール
        </h1>
        <p className="text-sm text-gray-600">
          コードを入力して実行結果を確認できます（Chiiを使わない純粋な実装）
        </p>
      </header>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* コードエディタ */}
        <div className="flex flex-1 flex-col overflow-hidden rounded border border-gray-300 bg-white">
          <div className="flex items-center justify-between border-b border-gray-300 bg-gray-200 px-4 py-2">
            <span className="text-sm font-medium">コードエディタ</span>
          </div>
          <textarea
            className="flex-1 resize-none p-4 font-mono text-sm outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* コンソール出力 */}
        <div className="flex-1 overflow-hidden">
          <SimpleConsole files={files} />
        </div>
      </div>

      <footer className="mt-4 text-center text-xs text-gray-500">
        <p>© 2023 シンプルJavaScriptコンソール</p>
      </footer>
    </main>
  );
}

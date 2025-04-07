// Service Worker for React Preview
// esbuild-wasmを使用してJSX/TSXファイルをコンパイル

importScripts(
  "https://cdn.jsdelivr.net/npm/esbuild-wasm@0.19.5/lib/browser.min.js"
);

// DBの名前とバージョン
const DB_NAME = "preview-files-db";
const DB_VERSION = 1;
const STORE_NAME = "files";

let esbuildInitPromise = null;

// Esbuildの初期化
async function initEsbuild() {
  if (esbuildInitPromise) return esbuildInitPromise;

  esbuildInitPromise = esbuild.initialize({
    wasmURL: "https://cdn.jsdelivr.net/npm/esbuild-wasm@0.19.5/esbuild.wasm",
    worker: false,
  });

  return esbuildInitPromise;
}

// IndexedDBの初期化
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDBを開けませんでした:", event);
      reject(new Error("データベースを開けませんでした"));
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "name" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

// ファイルの取得
async function getFile(filename) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(filename);

    request.onerror = () => {
      reject(new Error(`ファイル ${filename} の取得に失敗しました`));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

// ファイル一覧の取得
async function getAllFiles() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => {
      reject(new Error("ファイル一覧の取得に失敗しました"));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

// ルートファイルの取得
async function getRootFile() {
  const allFiles = await getAllFiles();
  return allFiles.find((file) => file.isRoot === true);
}

// 相対パスのimportを.mjs拡張子に変換する
function transformImports(code) {
  // 単純な相対パスの変換: './Component' -> './Component.mjs'
  const importRegex =
    /import\s+(?:(?:{[^}]*}|\*\s+as\s+[^,]+|[^,{}\s*]+)(?:\s*,\s*(?:{[^}]*}|\*\s+as\s+[^,]+|[^,{}\s*]+))*\s+from\s+)?['"]([^'"]+)['"]/g;

  return code.replace(importRegex, (match, importPath) => {
    // CDNのURLや絶対パスはそのまま
    if (importPath.startsWith("http") || importPath.startsWith("/")) {
      return match;
    }

    // ノードモジュール（'react'など）はそのまま
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      return match;
    }

    // 既に.mjsや他の拡張子が付いている場合はそのまま
    if (/\.(m?js|tsx?|jsx|css|json|html)$/.test(importPath)) {
      return match;
    }

    // 相対パスに.mjsを追加
    const newImportPath = `${importPath}.mjs`;
    return match.replace(importPath, newImportPath);
  });
}

// ファイルをコンパイルする
async function compileFile(file) {
  await initEsbuild();

  try {
    const ext = file.ext.toLowerCase();

    // JSX/TSXファイルのトランスパイル
    if (["jsx", "tsx"].includes(ext)) {
      const result = await esbuild.transform(file.content, {
        loader: ext,
        jsxFactory: "React.createElement",
        jsxFragment: "React.Fragment",
        target: "es2020",
        format: "esm",
      });

      // 相対パスのimportを.mjs拡張子に変換
      return transformImports(result.code, file.name);
    }
    // TypeScriptファイルのトランスパイル
    else if (ext === "ts") {
      const result = await esbuild.transform(file.content, {
        loader: "ts",
        target: "es2020",
        format: "esm",
      });

      return transformImports(result.code, file.name);
    }
    // CSS, HTML, JSONは変換不要
    else {
      return file.content;
    }
  } catch (error) {
    console.error("コンパイル中にエラーが発生しました:", error);
    // コンパイルエラーを表示できるようにエラーコードを返す
    return `console.error("コンパイルエラー: ${error.message.replace(
      /"/g,
      '\\"'
    )}");
export default function ErrorComponent() {
  return {
    message: "${error.message.replace(/"/g, '\\"')}",
    stack: "${(error.stack || "").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"
  };
}`;
  }
}

// Service Workerのインストールとアクティベート
self.addEventListener("install", () => {
  console.log("[SW] インストール中");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] アクティベート中");
  event.waitUntil(clients.claim());
});

// リクエストのインターセプト
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 外部ライブラリ（React、React DOM等）のリクエストは処理しない
  if (url.hostname !== self.location.hostname) {
    // CDNからのリクエストはそのまま通す
    return;
  }

  // /preview/からのリクエストのみ処理
  if (url.pathname.startsWith("/preview/")) {
    // HTMLのリクエスト
    if (
      url.pathname === "/preview/" ||
      url.pathname === "/preview/index.html"
    ) {
      event.respondWith(fetch(event.request));
      return;
    }

    // App.mjsのリクエスト（ルートファイル）
    if (url.pathname === "/preview/App.mjs") {
      event.respondWith(handleRootFileRequest());
      return;
    }

    // その他の.mjsファイルのリクエスト処理
    if (url.pathname.endsWith(".mjs")) {
      const filename = url.pathname.split("/").pop().replace(".mjs", "");
      console.log(`[SW] .mjsファイルリクエスト: ${filename}`);
      event.respondWith(handleMjsRequest(url));
      return;
    }

    // CSSファイル
    if (url.pathname.endsWith(".css")) {
      const filename = url.pathname.split("/").pop();
      event.respondWith(handleCssRequest(filename));
      return;
    }
  }

  // その他のリクエストはそのまま通す
  event.respondWith(fetch(event.request));
});

// ルートファイルのリクエスト処理
async function handleRootFileRequest() {
  try {
    console.log("[SW] ルートファイルのリクエスト処理中");
    const rootFile = await getRootFile();

    if (!rootFile) {
      console.error("[SW] ルートファイルが見つかりません");
      return new Response(
        `console.error("ルートファイルが見つかりません。isRoot=trueのファイルが必要です。");
export default function ErrorComponent() {
  return { message: "ルートファイルが見つかりません。" };
}`,
        {
          status: 200,
          headers: { "Content-Type": "application/javascript" },
        }
      );
    }

    console.log(`[SW] ルートファイルを見つけました: ${rootFile.name}`);
    const allFiles = await getAllFiles();
    const compiledCode = await compileFile(rootFile, allFiles);

    return new Response(compiledCode, {
      status: 200,
      headers: { "Content-Type": "application/javascript" },
    });
  } catch (error) {
    console.error("[SW] ルートファイルの処理中にエラーが発生しました:", error);
    return new Response(
      `console.error("ルートファイル処理エラー: ${error.message}");
export default function ErrorComponent() {
  return { message: "ルートファイル処理エラー: ${error.message}" };
}`,
      {
        status: 500,
        headers: { "Content-Type": "application/javascript" },
      }
    );
  }
}

// .mjsファイルのリクエスト処理
async function handleMjsRequest(url) {
  try {
    const filename = url.pathname.split("/").pop().replace(".mjs", "");
    const allFiles = await getAllFiles();

    console.log(
      `[SW] 検索しているファイル: ${filename}`,
      allFiles.map((f) => f.name)
    );

    // 完全な一致でファイルを検索
    let matchedFile = allFiles.find((f) => f.name === filename);

    // 拡張子付きのファイル名で検索
    if (!matchedFile) {
      const possibleExts = ["js", "jsx", "tsx", "ts"];
      for (const ext of possibleExts) {
        const fullName = `${filename}.${ext}`;
        console.log(`[SW] 検索: ${fullName}`);
        matchedFile = allFiles.find((f) => f.name === fullName);
        if (matchedFile) {
          console.log(`[SW] 見つかりました: ${matchedFile.name}`);
          break;
        }
      }
    }

    if (!matchedFile) {
      console.error(`[SW] ファイルが見つかりません: ${filename}`);
      return new Response(
        `console.error("ファイルが見つかりません: ${filename}");
export default {};`,
        {
          status: 200,
          headers: { "Content-Type": "application/javascript" },
        }
      );
    }

    console.log(`[SW] ファイルをコンパイルします: ${matchedFile.name}`);
    const compiledCode = await compileFile(matchedFile, allFiles);

    return new Response(compiledCode, {
      status: 200,
      headers: { "Content-Type": "application/javascript" },
    });
  } catch (error) {
    console.error("[SW] MJSリクエスト処理中にエラーが発生しました:", error);
    return new Response(
      `console.error("エラーが発生しました: ${error.message}");
export default {};`,
      {
        status: 500,
        headers: { "Content-Type": "application/javascript" },
      }
    );
  }
}

// CSSファイルのリクエスト処理
async function handleCssRequest(filename) {
  try {
    const file = await getFile(filename);

    if (!file) {
      return new Response("/* CSSファイルが見つかりません */", {
        status: 200,
        headers: { "Content-Type": "text/css" },
      });
    }

    return new Response(file.content, {
      status: 200,
      headers: { "Content-Type": "text/css" },
    });
  } catch (error) {
    console.error("[SW] CSSリクエスト処理中にエラーが発生しました:", error);
    return new Response("/* エラーが発生しました */", {
      status: 500,
      headers: { "Content-Type": "text/css" },
    });
  }
}

// メッセージハンドラー
self.addEventListener("message", async (event) => {
  console.log(`[SW] メッセージを受信: ${event.data.type}`);

  if (event.data.type === "CLEAR_FILES") {
    // ファイルのクリア
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log("[SW] すべてのファイルをクリアしました");
        event.source.postMessage({ type: "CLEAR_FILES_SUCCESS" });
      };

      request.onerror = (error) => {
        console.error("[SW] ファイルクリア中にエラーが発生しました:", error);
        event.source.postMessage({
          type: "CLEAR_FILES_ERROR",
          error: error.toString(),
        });
      };
    } catch (error) {
      console.error("[SW] ファイルクリア中にエラーが発生しました:", error);
      event.source.postMessage({
        type: "CLEAR_FILES_ERROR",
        error: error.toString(),
      });
    }
  } else if (event.data.type === "SAVE_FILES") {
    // ファイルの保存
    try {
      console.log(`[SW] ${event.data.files.length}ファイルを保存します`);

      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      // 既存のファイルをクリア
      await new Promise((resolve, reject) => {
        const clearRequest = store.clear();
        clearRequest.onsuccess = resolve;
        clearRequest.onerror = reject;
      });

      const files = event.data.files;
      let savedCount = 0;

      // ファイルを順番に保存
      for (const file of files) {
        await new Promise((resolve, reject) => {
          const fileName = file.name + (file.ext ? `.${file.ext}` : "");
          console.log(`[SW] ファイルを保存: ${fileName}`);

          const request = store.put({
            name: fileName,
            content: file.content,
            ext: file.ext,
            isRoot: file.isRoot,
          });

          request.onsuccess = () => {
            savedCount++;
            console.log(
              `[SW] ファイル保存成功 (${savedCount}/${files.length}): ${fileName}`
            );
            resolve();
          };

          request.onerror = (e) => {
            console.error(`[SW] ファイル保存エラー: ${fileName}`, e);
            reject(e);
          };
        });
      }

      console.log("[SW] すべてのファイルを保存しました");
      event.source.postMessage({ type: "SAVE_FILES_SUCCESS" });
    } catch (error) {
      console.error("[SW] ファイル保存中にエラーが発生しました:", error);
      event.source.postMessage({
        type: "SAVE_FILES_ERROR",
        error: error.toString(),
      });
    }
  }
});

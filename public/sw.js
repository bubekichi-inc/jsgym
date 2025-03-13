importScripts(
  "https://cdn.jsdelivr.net/npm/esbuild-wasm@0.19.0/lib/browser.min.js"
);

// Service Workerの初期化
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// リクエストの処理
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // App.tsxへのリクエストのみをインターセプト
  if (url.pathname === "/App.tsx") {
    event.respondWith(getAppFromIndexedDB());
  }
});

async function getAppFromIndexedDB() {
  try {
    const db = await openDatabase();
    const content = await getFileContent(db, "/App.tsx");

    if (!content) {
      return new Response("File not found", { status: 404 });
    }

    return new Response(content, {
      headers: {
        "Content-Type": "application/typescript",
      },
    });
  } catch (error) {
    console.error("Error getting file from IndexedDB:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

// IndexedDBの操作関数
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CodeEditorDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "path" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getFileContent(db, path) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["files"], "readonly");
    const store = transaction.objectStore("files");
    const request = store.get(path);

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.content);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => reject(request.error);
  });
}

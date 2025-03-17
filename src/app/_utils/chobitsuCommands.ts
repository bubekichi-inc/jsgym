/**
 * Chobitsuコマンドを送信するためのユーティリティ関数
 */

/**
 * ローカルストレージをクリアする
 * @param iframe プレビューiframeの参照
 * @param origin オリジン（デフォルトは'http://localhost:3000'）
 */
export const clearLocalStorage = (
  iframe: HTMLIFrameElement | null,
  origin: string = "http://localhost:3000"
) => {
  if (!iframe?.contentWindow) return;

  iframe.contentWindow.postMessage(
    {
      type: "CHOBITSU_COMMAND",
      command: JSON.stringify({
        id: 1,
        method: "DOMStorage.clear",
        params: {
          storageId: {
            isLocalStorage: true,
            securityOrigin: origin,
          },
        },
      }),
    },
    "*"
  );
};

/**
 * コンソールをクリアする
 * @param iframe プレビューiframeの参照
 */
export const clearConsole = (iframe: HTMLIFrameElement | null) => {
  if (!iframe?.contentWindow) return;

  iframe.contentWindow.postMessage(
    {
      type: "CHOBITSU_COMMAND",
      command: JSON.stringify({
        id: 2,
        method: "Runtime.evaluate",
        params: {
          expression: "console.clear()",
        },
      }),
    },
    "*"
  );
};

/**
 * JavaScriptを実行する
 * @param iframe プレビューiframeの参照
 * @param code 実行するJavaScriptコード
 */
export const evaluateJavaScript = (
  iframe: HTMLIFrameElement | null,
  code: string
) => {
  if (!iframe?.contentWindow) return;

  iframe.contentWindow.postMessage(
    {
      type: "CHOBITSU_COMMAND",
      command: JSON.stringify({
        id: 3,
        method: "Runtime.evaluate",
        params: {
          expression: code,
        },
      }),
    },
    "*"
  );
};

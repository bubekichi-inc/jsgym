/**
 * シンプルコンソール用のユーティリティ関数
 * Chiiなどの外部ライブラリに依存せず、単純なpostMessageを使用して通信します
 */

/**
 * コンソールログを送信する
 * @param iframe コンソールiframeの参照
 * @param message ログメッセージ
 * @param logType ログタイプ (log, info, warn, error)
 */
export const sendConsoleLog = (
  iframe: HTMLIFrameElement | null,
  message: unknown,
  logType: "log" | "info" | "warn" | "error" = "log"
): boolean => {
  if (!iframe?.contentWindow) {
    console.error("コンソールiframeが見つかりません");
    return false;
  }

  try {
    iframe.contentWindow.postMessage(
      {
        type: "CONSOLE_LOG",
        logType,
        message,
      },
      "*"
    );
    return true;
  } catch (error) {
    console.error("コンソールへのメッセージ送信に失敗しました:", error);
    return false;
  }
};

/**
 * テストログを送信する
 * @param iframe コンソールiframeの参照
 * @param count オプションのログカウンター値
 */
export const sendTestLog = (
  iframe: HTMLIFrameElement | null,
  count?: number
): boolean => {
  if (!iframe?.contentWindow) {
    console.error("コンソールiframeが見つかりません");
    return false;
  }

  try {
    iframe.contentWindow.postMessage(
      {
        type: "TRIGGER_TEST_LOG",
        count,
      },
      "*"
    );
    return true;
  } catch (error) {
    console.error("テストログの送信に失敗しました:", error);
    return false;
  }
};

/**
 * コンソールをクリアする
 * @param iframe コンソールiframeの参照
 */
export const clearConsole = (iframe: HTMLIFrameElement | null): boolean => {
  if (!iframe?.contentWindow) {
    console.error("コンソールiframeが見つかりません");
    return false;
  }

  try {
    iframe.contentWindow.postMessage(
      {
        type: "CLEAR_CONSOLE",
      },
      "*"
    );
    return true;
  } catch (error) {
    console.error("コンソールのクリアに失敗しました:", error);
    return false;
  }
};

/**
 * コードを実行する
 * @param iframe コンソールiframeの参照
 * @param code 実行するJavaScriptコード
 */
export const executeCode = (
  iframe: HTMLIFrameElement | null,
  code: string
): boolean => {
  if (!iframe?.contentWindow) {
    console.error("コンソールiframeが見つかりません");
    return false;
  }

  try {
    iframe.contentWindow.postMessage(
      {
        type: "EXECUTE_CODE",
        code,
      },
      "*"
    );
    return true;
  } catch (error) {
    console.error("コードの実行に失敗しました:", error);
    return false;
  }
};

/**
 * TSXコードの評価結果を表示する
 * @param iframe コンソールiframeの参照
 * @param result 評価結果
 */
export const evaluateTSX = (
  iframe: HTMLIFrameElement | null,
  result: unknown
): boolean => {
  if (!iframe?.contentWindow) {
    console.error("コンソールiframeが見つかりません");
    return false;
  }

  try {
    iframe.contentWindow.postMessage(
      {
        type: "EVALUATE_TSX",
        result,
      },
      "*"
    );
    return true;
  } catch (error) {
    console.error("TSXコードの評価に失敗しました:", error);
    return false;
  }
};

export const devToolHTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="no-referrer">
  <title>DevTools</title>
  <script src="https://cdn.jsdelivr.net/npm/requestidlecallback-polyfill@1.0.2/index.min.js"></script>
  <script src="https://unpkg.com/@ungap/custom-elements/es.js"></script>
  <script type="module" src="https://cdn.jsdelivr.net/npm/chii@1.8.0/public/front_end/entrypoints/chii_app/chii_app.js"></script>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
    }
  </style>
  <script>
    // メッセージイベントリスナーを追加
    window.addEventListener('message', (event) => {
      // Chiiのイベントディスパッチャーを取得
      const chiiApp = document.querySelector('chii-app');
      if (chiiApp && chiiApp.connection) {
        // メッセージをChiiに転送
        chiiApp.connection.dispatch(event.data);
      }
    });

    // Chiiが読み込まれたことを確認するためのポーリング
    function checkChiiLoaded() {
      const chiiApp = document.querySelector('chii-app');
      if (chiiApp && chiiApp.connection) {
        // 親ウィンドウに準備完了を通知
        window.parent.postMessage({ type: 'DEVTOOLS_READY' }, '*');
      } else {
        setTimeout(checkChiiLoaded, 100);
      }
    }

    // ページ読み込み後にChiiの読み込みを確認
    window.addEventListener('load', () => {
      checkChiiLoaded();
    });
  </script>
</head>
<body>
</body>
</html>
`;

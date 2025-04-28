"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type LogType = "normal" | "error" | "warn" | "table" | "info" | "debug";

export type LogObj = { type: LogType; message: string; isHtml?: boolean };

export const useCodeExecutor = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [executionResult, setExecutionResult] = useState<LogObj[]>([]);

  const addLog = useCallback(
    (type: LogType, message: string, isHtml = false) => {
      setExecutionResult((prevLogs) => [
        ...prevLogs,
        { type, message, isHtml },
      ]);
    },
    []
  );

  const resetLogs = () => {
    setExecutionResult([]);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, messages, isHtml } = event.data;
      if (["log", "warn", "error", "table", "info", "debug"].includes(type)) {
        addLog(type as LogType, messages, isHtml);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [addLog]);

  const executeCode = (code: string) => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
              font-family: monospace;
              font-size: 14px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #444;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #333;
            }
          </style>
        </head>
        <body>
          <script>
            const setupConsole = () => {
              // 共通の処理関数
              const processArgs = (args) => {
                return args.map(arg => {
                  if (typeof arg === 'undefined') return 'undefined';
                  if (arg === null) return 'null';
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return String(arg);
                    }
                  }
                  return String(arg);
                }).join(' ');
              };

              // 基本的なコンソールメソッドのオーバーライド
              ['log', 'error', 'warn', 'info', 'debug'].forEach(method => {
                const original = console[method];
                console[method] = (...args) => {
                  original.apply(console, args);
                  const message = processArgs(args);
                  window.parent.postMessage({ type: method, messages: message }, '*');
                };
              });

              // console.tableの特別な処理
              const originalTable = console.table;
              console.table = (data, columns) => {
                originalTable.apply(console, [data, columns]);

                try {
                  // HTMLテーブルを生成
                  let tableHtml = '<table>';

                  // データが配列の場合
                  if (Array.isArray(data)) {
                    // ヘッダー行を生成
                    const headers = columns ||
                      (data.length > 0 && typeof data[0] === 'object' ?
                        Object.keys(data[0]) :
                        ['(index)', 'Value']);

                    tableHtml += '<tr>';
                    tableHtml += '<th>(index)</th>';
                    headers.forEach(header => {
                      if (header !== '(index)') {
                        tableHtml += \`<th>\${header}</th>\`;
                      }
                    });
                    tableHtml += '</tr>';

                    // データ行を生成
                    data.forEach((item, index) => {
                      tableHtml += '<tr>';
                      tableHtml += \`<td>\${index}</td>\`;

                      if (typeof item === 'object' && item !== null) {
                        headers.forEach(header => {
                          if (header !== '(index)') {
                            const value = item[header];
                            tableHtml += \`<td>\${
                              value === undefined ? '' :
                              typeof value === 'object' ? JSON.stringify(value) :
                              String(value)
                            }</td>\`;
                          }
                        });
                      } else {
                        tableHtml += \`<td>\${item === undefined ? '' : String(item)}</td>\`;
                      }

                      tableHtml += '</tr>';
                    });
                  }
                  // データがオブジェクトの場合
                  else if (typeof data === 'object' && data !== null) {
                    const keys = Object.keys(data);

                    // ヘッダー行
                    tableHtml += '<tr><th>(index)</th><th>Value</th></tr>';

                    // データ行
                    keys.forEach(key => {
                      const value = data[key];
                      tableHtml += '<tr>';
                      tableHtml += \`<td>\${key}</td>\`;
                      tableHtml += \`<td>\${
                        value === undefined ? '' :
                        typeof value === 'object' ? JSON.stringify(value) :
                        String(value)
                      }</td>\`;
                      tableHtml += '</tr>';
                    });
                  }

                  tableHtml += '</table>';
                  window.parent.postMessage({
                    type: 'table',
                    messages: tableHtml,
                    isHtml: true
                  }, '*');
                } catch (e) {
                  console.error('Error generating table:', e);
                  window.parent.postMessage({
                    type: 'error',
                    messages: 'Error generating table: ' + e.toString()
                  }, '*');
                }
              };

              try {
                const userCode = () => {
                  ${code}
                }
                userCode();
              } catch (error) {
                console.error('Error:', error.toString());
                window.parent.postMessage({ type: 'error', messages: error.toString() }, '*');
              }
            };
            setupConsole();
          </script>
        </body>
      </html>
    `;
  };

  return { iframeRef, executeCode, executionResult, resetLogs };
};

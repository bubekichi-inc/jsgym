import { useRef } from "react";
import DOMPurify from "dompurify";

export const useCodeExecutor = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const executeCode = (code: string) => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    const sanitizedCode = DOMPurify.sanitize(code);

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            const setupConsole = () => {
              const originalLog = console.log;
              console.log = (...args) => {
                window.parent.postMessage({ type: 'log', messages: args }, '*');
              };
              console.error = (...args) => {
                window.parent.postMessage({ type: 'error', messages: args }, '*');
              };
              console.warn = (...args) => {
                window.parent.postMessage({ type: 'warn', messages: args }, '*');
              };

              try {
                const userCode = () => {
                  ${sanitizedCode}
                }
                userCode();
              } catch (error) {
                console.error('Error:', error.toString());
                window.parent.postMessage({ type: 'error', error: error.toString() }, '*');
              }
            };
            setupConsole();
          </script>
        </body>
      </html>
    `;
  };

  return { iframeRef, executeCode };
};

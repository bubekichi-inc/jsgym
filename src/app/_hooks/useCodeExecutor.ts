import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";
import { LogType } from "../(member)/courses/[courseId]/[lessonId]/[questionId]/_types/LogType";

export const useCodeExecutor = (
  addLog: (type: LogType, message: string) => void
) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, messages } = event.data;
      if (type === "log" || type === "warn" || type === "error") {
        addLog(type, messages);
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
    const sanitizedCode = DOMPurify.sanitize(code);

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            const setupConsole = () => {
              const originalLog = console.log;
              console.log = (...args) => {
              const formattedArgs = args.map(arg =>
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
                );
                window.parent.postMessage({ type: 'log', messages: formattedArgs.join(' ') }, '*');
              };
              console.error = (...args) => {
                const formattedArgs = args.map(arg =>
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
                );
                window.parent.postMessage({ type: 'error', messages: formattedArgs.join(' ') }, '*');
              };
              console.warn = (...args) => {
                const formattedArgs = args.map(arg =>
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
                );
                window.parent.postMessage({ type: 'warn', messages: formattedArgs.join(' ') }, '*');
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

import {
  faCircleExclamation,
  faTriangleExclamation,
  faInfoCircle,
  faTable,
  faBug,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { RefObject } from "react";
import { Header } from "./Header";
import { LogObj } from "@/app/_hooks/useCodeExecutor";

interface Props {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  executionResult: LogObj[];
  onClear: () => void;
}

export const Terminal: React.FC<Props> = ({
  executionResult,
  iframeRef,
  onClear,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "warn":
        return (
          <FontAwesomeIcon
            className="mr-2 text-yellow-400"
            icon={faTriangleExclamation}
          />
        );
      case "error":
        return (
          <FontAwesomeIcon
            className="mr-2 text-red-500"
            icon={faCircleExclamation}
          />
        );
      case "info":
        return (
          <FontAwesomeIcon className="mr-2 text-blue-400" icon={faInfoCircle} />
        );
      case "table":
        return (
          <FontAwesomeIcon className="mr-2 text-gray-300" icon={faTable} />
        );
      case "debug":
        return (
          <FontAwesomeIcon className="mr-2 text-purple-400" icon={faBug} />
        );
      default:
        return null;
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case "warn":
        return "text-yellow-400";
      case "error":
        return "text-red-500";
      case "info":
        return "text-blue-400";
      case "debug":
        return "text-purple-400";
      default:
        return "";
    }
  };

  return (
    <div className="h-full border-t border-gray-700">
      <Header onClear={onClear} />
      <div className="h-full overflow-y-scroll bg-black">
        <div className="w-full px-4 text-white">
          {executionResult.map((item, index) => {
            return (
              <div
                key={index}
                className={`${
                  !item.isHtml &&
                  item.message.length > 100 &&
                  "whitespace-pre-wrap break-words"
                } ${getTextColor(item.type)}`}
              >
                {getIcon(item.type)}
                {item.isHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: item.message }}
                    className="terminal-html-content"
                  />
                ) : (
                  item.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")
                )}
              </div>
            );
          })}
        </div>
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts allow-modals"
          className="hidden"
        />
      </div>
    </div>
  );
};

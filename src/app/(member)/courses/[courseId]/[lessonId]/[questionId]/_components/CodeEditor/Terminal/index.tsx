import {
  faCircleExclamation,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { RefObject } from "react";
import { Header } from "./Header";
import { LogObj } from "@/app/_hooks/useCodeExecutor";

interface Props {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  executionResult: LogObj[];
}

export const Terminal: React.FC<Props> = ({ executionResult, iframeRef }) => {
  return (
    <div className="border-t border-gray-700">
      <Header />
      <div className="h-[280px] overflow-y-scroll bg-black">
        <div className="px-4 text-white">
          {executionResult.map((item, index) => {
            return (
              <div
                key={index}
                className={`${
                  item.type === "warn"
                    ? "text-yellow-400"
                    : item.type === "error"
                    ? "text-red-500"
                    : ""
                }`}
              >
                {item.type === "warn" && (
                  <FontAwesomeIcon
                    className="mr-2 text-yellow-400"
                    icon={faTriangleExclamation}
                  />
                )}
                {item.type === "error" && (
                  <FontAwesomeIcon
                    className="mr-2 text-red-500"
                    icon={faCircleExclamation}
                  />
                )}
                {item.message}
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

"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  children: string;
}

export const MarkdownWrapper: React.FC<Props> = ({ children }) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, className, children: codeChildren, ...props }) {
          const isInline =
            node?.tagName === "code" && node?.children[0].position;
          console.log(node?.children[0].position);
          return isInline ? (
            <code
              className={className}
              {...props}
              style={{
                backgroundColor: "oklch(0.901 0.076 70.697)",
                margin: "0 2px",
                padding: "1px 4px",
                borderRadius: "2px",
              }}
            >
              {codeChildren}
            </code>
          ) : (
            <pre
              style={{
                backgroundColor: "#1e1e1e",
                color: "white",
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              <code className={className} {...props}>
                {codeChildren}
              </code>
            </pre>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

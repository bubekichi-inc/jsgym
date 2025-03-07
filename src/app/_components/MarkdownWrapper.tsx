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
        h1: ({ children }) => (
          <h1
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              margin: "1rem 0",
            }}
          >
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              margin: "1rem 0",
            }}
          >
            {children}
          </h2>
        ),
        ul: ({ children }) => (
          <ul
            style={{
              listStyle: "disc",
              paddingLeft: "1.5rem",
              margin: "1rem 0",
            }}
          >
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li style={{ margin: "0.5rem 0" }}>{children}</li>
        ),
        code({ node, className, children: codeChildren, ...props }) {
          const isInline =
            node?.tagName === "code" && node?.children[0].position;
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

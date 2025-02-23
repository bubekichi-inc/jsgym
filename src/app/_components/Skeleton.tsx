import React from "react";

interface Props {
  width?: number;
  height?: number;
  round?: number;
}

export const Skeleton: React.FC<Props> = ({ width, height, round }) => {
  return (
    <div
      className="animate-pulse bg-gray-200"
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
        borderRadius: round ? `${round}px` : "4px",
      }}
    ></div>
  );
};

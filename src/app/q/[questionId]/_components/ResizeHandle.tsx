"use client";

import { PanelResizeHandle } from "react-resizable-panels";
import React from "react";

export const ResizeHandle: React.FC = () => {
  return (
    <PanelResizeHandle className="group flex items-center justify-center w-2 mx-1 transition-colors duration-150 hover:bg-blue-500 active:bg-blue-600 cursor-col-resize">
      <div className="w-0.5 h-16 bg-gray-300 group-hover:bg-white group-active:bg-white rounded" />
    </PanelResizeHandle>
  );
};

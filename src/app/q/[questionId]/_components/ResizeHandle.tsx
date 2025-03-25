"use client";

import React from "react";
import { PanelResizeHandle } from "react-resizable-panels";

export const ResizeHandle: React.FC = () => {
  return (
    <PanelResizeHandle className="group mx-1 flex w-2 cursor-col-resize items-center justify-center transition-colors duration-150 hover:bg-blue-500 active:bg-blue-600">
      <div className="h-16 w-0.5 rounded bg-gray-300 group-hover:bg-white group-active:bg-white" />
    </PanelResizeHandle>
  );
};

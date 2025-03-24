import React from "react";

interface Props {
  onClear: () => void;
}

export const Header: React.FC<Props> = ({ onClear }) => {
  return (
    <div className="flex items-center justify-between bg-black p-3 text-xs text-gray-300">
      <div>ターミナル (出力)</div>
      <div>
        <button
          className="rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300"
          onClick={onClear}
        >
          クリア
        </button>
      </div>
    </div>
  );
};

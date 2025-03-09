import React from "react";
import type { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"input"> {
  label: string;
  onClick? : () => Promise<void>;
}

export const CheckBox: React.FC<Props> = ({ 
  label,
  id,
  type,
  defaultChecked,
  disabled,
  onClick,
  }) => {
    return (
      <div>
        <input
          id={id} 
          type={type}
          className="size-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
          onClick={onClick}
          defaultChecked={defaultChecked}
          disabled={disabled}
        />
        <label htmlFor="id" className="ms-2 text-sm font-medium text-gray-900">
          {label}
        </label>
      </div>
    );
}
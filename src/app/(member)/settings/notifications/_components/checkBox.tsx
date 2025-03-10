import React from "react";
import type { ComponentPropsWithRef } from "react";

interface Props extends ComponentPropsWithRef<"input"> {
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
  ...props
  }) => {
    return (
      <div className="flex items-center">
        <input
          id={id} 
          type={type}
          className="size-5 rounded-sm border-gray-300 bg-buttonMain text-blue-600"
          onClick={onClick}
          defaultChecked={defaultChecked}
          disabled={disabled}
          {...props}
        />
        <label htmlFor="id" className="ms-2 text-lg font-bold text-gray-900">
          {label}
        </label>
      </div>
    );
}
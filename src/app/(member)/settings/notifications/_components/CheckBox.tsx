import React from "react";
import type { ComponentPropsWithRef } from "react";

interface Props extends ComponentPropsWithRef<"input"> {
  label: string;
}

export const CheckBox: React.FC<Props> = ({ label, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        className="size-5 rounded-sm border-gray-300 bg-buttonMain text-blue-600"
        {...props}
      />
      <label
        htmlFor={props.id}
        className="ms-2 text-lg font-bold text-gray-900"
      >
        {label}
      </label>
    </div>
  );
};

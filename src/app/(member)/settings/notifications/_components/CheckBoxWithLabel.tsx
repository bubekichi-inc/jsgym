import React from "react";
import type { ComponentPropsWithRef } from "react";
import { CheckBox } from "@/app/_components/CheckBox";

interface Props extends ComponentPropsWithRef<"input"> {
  label: string;
}

export const CheckBoxWithLabel: React.FC<Props> = ({ label, ...props }) => {
  return (
    <div className="flex items-center">
      <CheckBox
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
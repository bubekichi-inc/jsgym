import React from "react";
import type { ComponentPropsWithRef } from "react";

type Props = Omit<ComponentPropsWithRef<"input">, "type">;

export const CheckBox: React.FC<Props> = ({ ...props }) => {
  return (
    <input
      type="checkbox"
      className="size-5 rounded-sm border-gray-300 bg-buttonMain text-blue-600"
      {...props}
    />
  );
};

import React from "react";
import type { ComponentPropsWithRef } from "react";

interface Props extends ComponentPropsWithRef<"input"> {
  label: string;
  errorMessage?: string;
}

export const TextInput: React.FC<Props> = ({
  label,
  id,
  type,
  errorMessage,
  ...otherProps
}) => {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-lg font-bold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full rounded border px-4 py-2"
        {...otherProps}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

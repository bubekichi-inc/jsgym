import React from "react";
import type { ComponentPropsWithRef } from "react";

import type {
  FieldErrors,
  UseFormRegister,
  RegisterOptions,
  FieldValues,
  Path,
} from "react-hook-form";

interface Props<T extends FieldValues>
  extends Omit<ComponentPropsWithRef<"input">, "name"> {
  id: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validationRules?: RegisterOptions<T, Path<T>>;
}

export const TextInput = <T extends FieldValues>({
  id,
  label,
  type = "text",
  register,
  errors,
  validationRules,
  ...rest
}: Props<T>) => {
  const errorMessage = errors[id]?.message;

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-lg font-bold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full rounded border px-4 py-2"
        {...register(id, validationRules)}
        {...rest}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-500">
          {typeof errorMessage === "string"
            ? errorMessage
            : String(errorMessage)}
        </p>
      )}
    </div>
  );
};

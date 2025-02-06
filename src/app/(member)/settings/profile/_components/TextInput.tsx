import React from "react";
import type {
  FieldErrors,
  UseFormRegister,
  RegisterOptions,
  FieldValues,
  Path,
} from "react-hook-form";

interface Props<T extends FieldValues> {
  id: Path<T>;
  label: string;
  type?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validationRules?: RegisterOptions<T, Path<T>>;
  placeholder?: string;
}

export const TextInput = <T extends FieldValues>({
  id,
  label,
  type = "text",
  register,
  errors,
  validationRules,
  placeholder,
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
        placeholder={placeholder}
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

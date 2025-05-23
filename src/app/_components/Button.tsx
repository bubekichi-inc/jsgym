import { ReactNode, ComponentPropsWithRef, forwardRef } from "react";

type Variant =
  | "text-blue"
  | "text-red"
  | "text-black"
  | "text-white"
  | "bg-gray"
  | "bg-blue"
  | "w-full";

interface Props extends Omit<ComponentPropsWithRef<"button">, "className"> {
  variant: Variant;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant, children, ...props }, ref) => {
    const className = () => {
      switch (variant) {
        case "text-blue":
          return "text-blue-500 hover:text-blue-600 transition-colors duration-200";
        case "text-red":
          return "text-red-500 hover:text-red-600 transition-colors duration-200";
        case "text-black":
          return "text-black hover:text-gray-800 transition-colors duration-200";
        case "text-white":
          return "text-white hover:text-gray-200 transition-colors duration-200";
        case "bg-gray":
          return "bg-[#777777] text-white hover:bg-[#666666] transition-colors duration-200";
        case "bg-blue":
          return "bg-[#4E89FF] text-white hover:bg-[#3d78ef] transition-colors duration-200";
        case "w-full":
          return "bg-[#4E89FF] text-white w-full font-bold hover:bg-[#3d78ef] transition-colors duration-200";
        default:
          return "";
      }
    };
    return (
      <button
        ref={ref}
        {...props}
        className={`rounded-md p-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${className()}`}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

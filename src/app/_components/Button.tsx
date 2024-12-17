import { ReactNode, ComponentPropsWithRef, forwardRef } from "react";

type Variant = "text-blue" | "text-red" | "bg-gray" | "bg-blue";

interface Props extends Omit<ComponentPropsWithRef<"button">, "className"> {
  variant: Variant;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant, children, ...props }, ref) => {
    const className = () => {
      switch (variant) {
        case "text-blue":
          return "text-blue-500";
        case "text-red":
          return "text-red-500";
        case "bg-gray":
          return "bg-[#777777] text-white";
        case "bg-blue":
          return "bg-[#4E89FF] text-white";
        default:
          return "";
      }
    };
    return (
      <button
        ref={ref}
        {...props}
        className={`w-[162px] h-[46px] rounded-md ${className()}`}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

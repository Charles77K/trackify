import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const Button = ({ children, className, ...props }: IButton) => {
  return (
    <button
      className={cn(
        "w-full p-2 bg-sidebar text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-lg hover:bg-sidebar-active cursor-pointer transition-all ease-in-out duration-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

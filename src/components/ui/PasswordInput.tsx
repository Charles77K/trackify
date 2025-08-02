import React, { forwardRef, type InputHTMLAttributes } from "react";
import { type FieldError, type FieldErrors } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

interface IPasswordInput extends InputHTMLAttributes<HTMLInputElement> {
  htmlFor?: string;
  label: string;
  icon?: React.ReactElement;
  error?: string | FieldError | FieldErrors;
  className?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, IPasswordInput>(
  ({ htmlFor, label, icon, error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const errorMessage =
      typeof error === "string"
        ? error
        : error && "message" in error
        ? error.message
        : undefined;
    return (
      <div className="text-sm flex flex-col gap-1">
        <label htmlFor={htmlFor} className="text-xs">
          {label}
        </label>
        <div className="flex gap-1 border border-gray-400 focus-within:border-fadedOrange p-2 rounded-md">
          {icon}
          <input
            className={cn(
              "text-xs flex-1 bg-transparent outline-none",
              className
            )}
            type={showPassword ? "text" : "password"}
            {...props}
            ref={ref}
          />
          <div
            onClick={() => setShowPassword((prevState) => !prevState)}
            className="cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="size-5 text-primary" />
            ) : (
              <Eye className="size-5 text-primary" />
            )}
          </div>
        </div>
        {error && (
          <p className="text-danger text-xs">{errorMessage?.toString()}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;

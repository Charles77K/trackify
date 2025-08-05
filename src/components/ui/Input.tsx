import { forwardRef, type ReactNode, type InputHTMLAttributes } from "react";
import { type FieldError, type FieldErrors } from "react-hook-form";
import { cn } from "../../lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  htmlFor?: string;
  label: string;
  icon?: ReactNode;
  error?: string | FieldError | FieldErrors; // ✅ Now supports nested errors
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { htmlFor, label, icon, type = "text", error, className, ...props },
    ref
  ) => {
    // Extract error message safely
    const errorMessage =
      typeof error === "string"
        ? error
        : error && "message" in error
        ? error.message
        : undefined;

    return (
      <div className="text-sm flex flex-1 flex-col gap-1">
        <label htmlFor={htmlFor} className="text-xs">
          {label}
        </label>
        <div className="flex gap-1 border border-gray-400 focus-within:border-fadedOrange p-3 rounded-md">
          {icon}
          <input
            className={cn(
              "text-xs flex-1 bg-transparent outline-none",
              className
            )}
            type={type}
            {...props}
            ref={ref}
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-xs">{errorMessage.toString()}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;

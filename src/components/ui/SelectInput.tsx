import React from "react";
import type { FieldError, FieldErrors } from "react-hook-form";

type SelectInputProps<T> = {
  options: T[];
  label: string;
  optionValue: (option: T) => string | number;
  optionMain: (option: T) => string;
  onChange: (value: string | number) => void;
  value: string | number;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  multiple?: boolean;
  className?: string;
  error?: FieldError | FieldErrors;
};

// Inner function with generic
function SelectInputInner<T>(
  props: SelectInputProps<T>,
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  const {
    options,
    label,
    optionValue,
    optionMain,
    onChange,
    value,
    placeholder,
    isDisabled = false,
    isLoading = false,
    isError = false,
    multiple = false,
    className = "",
    error,
  } = props;

  return (
    <div>
      <label className="text-xs">{label}</label>
      <select
        ref={ref}
        className={`block bg-gray-100 p-3 w-full border border-gray-200 text-xs rounded-md ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
        multiple={multiple}
      >
        {!multiple && <option value="">{placeholder}</option>}

        {isLoading ? (
          <option>Loading...</option>
        ) : isError ? (
          <option disabled>Error loading</option>
        ) : options.length > 0 ? (
          options.map((option, idx) => (
            <option key={idx} value={optionValue(option)}>
              {optionMain(option)}
            </option>
          ))
        ) : (
          <option disabled>No options found</option>
        )}
      </select>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message?.toString()}</p>
      )}
    </div>
  );
}

// Cast it to generic-friendly version
const SelectInput = React.forwardRef(SelectInputInner) as <T>(
  props: SelectInputProps<T> & { ref?: React.Ref<HTMLSelectElement> }
) => ReturnType<typeof SelectInputInner>;

export default SelectInput;

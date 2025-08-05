/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

interface SelectOption {
  id: number;
  name: string;
}

interface EditableTableCellProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
  inputType?: "text" | "number" | "email" | "select";
  selectOptions?: SelectOption[];
  className?: string;
  placeholder?: string;
}

const EditableTableCell: React.FC<EditableTableCellProps> = ({
  getValue,
  row,
  column,
  table,
  inputType = "text",
  selectOptions = [],
  className = "border rounded px-2 py-1 text-sm w-full",
  placeholder,
}) => {
  const initialValue = getValue();
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setValue(e.target.value);
  };

  if (tableMeta?.editedRows[row.id]) {
    if (inputType === "select") {
      return (
        <select
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          className={className}
          autoFocus
        >
          <option value="">{placeholder || "Select an option"}</option>
          {selectOptions.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={className}
        type={inputType}
        placeholder={placeholder}
        autoFocus
      />
    );
  }

  // Display logic for non-editing state
  if (inputType === "select" && value) {
    return (
      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
        {value}
      </span>
    );
  }

  return <span>{value}</span>;
};

export default EditableTableCell;

import React from "react";

type InputType = "text" | "search" | "number" | "date"; // Input types
type InputProps = {
  type: InputType;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  min?: number; // For number type
  max?: number; // For number type
  step?: number; // For number type
  required?: boolean;
  style:string;
};

const Input: React.FC<InputProps> = ({
  type,
  value,
  onChange,
  placeholder = "",
  label,
  min,
  max,
  step,
  required = false,
  style=""
}) => {
  const renderInputField = () => {
    switch (type) {
      case "search":
        return (
          <input
            type="search"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={style||"w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"}
            required={required}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className={style||"w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"}
            required={required}
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={onChange}
            className={style||"w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"}
            required={required}
          />
        );
      case "text":
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={style||"w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"}
            required={required}
          />
        );
    }
  };

  return (
    <div className="flex flex-col">
      {label && <label className="text-sm font-medium mb-2">{label}</label>}
      {renderInputField()}
    </div>
  );
};

export default Input;

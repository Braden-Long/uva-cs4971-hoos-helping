import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(7)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`rounded-md border ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-primary focus:ring-primary"
          } px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      helperText,
      className = "",
      id,
      options,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substring(7)}`;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-md border ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-primary focus:ring-primary"
            } bg-white px-3 py-2 pr-10 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            {...props}
          >
            {options
              ? options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              : children}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
            <svg
              viewBox="0 0 12 8"
              width="12"
              height="8"
              fill="none"
              className="stroke-current"
            >
              <path
                d="M1 1.5 6 6l5-4.5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substring(7)}`;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`rounded-md border ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-primary focus:ring-primary"
          } px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

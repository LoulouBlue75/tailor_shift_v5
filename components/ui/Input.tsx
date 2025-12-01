import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, required, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="block text-label font-medium text-charcoal"
        >
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "mt-2 block w-full rounded border bg-white px-4 py-3 text-body text-charcoal placeholder:text-soft-grey transition-colors",
            "focus:border-matte-gold focus:outline-none focus:ring-1 focus:ring-matte-gold",
            "disabled:cursor-not-allowed disabled:bg-concrete/30 disabled:text-soft-grey",
            error
              ? "border-error focus:border-error focus:ring-error"
              : "border-concrete",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          required={required}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-2 text-caption text-error">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-2 text-caption text-soft-grey">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };

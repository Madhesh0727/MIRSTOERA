import React, { forwardRef } from 'react';

export interface RoyalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const RoyalInput = forwardRef<HTMLInputElement, RoyalInputProps>(
  ({ label, error, helperText, required, id, className = '', ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold tracking-wider uppercase text-[#16283D]"
        >
          {label} {required && <span className="text-[#692D40]">*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            required={required}
            className={`w-full px-3.5 py-2.5 bg-[#FCF9F2] text-[#292623] placeholder-[#292623]/40 border rounded-sm text-sm transition-colors duration-150 focus:outline-none focus:ring-1 ${
              error
                ? 'border-[#692D40] focus:border-[#692D40] focus:ring-[#692D40]/30'
                : 'border-[#E3D8C4] hover:border-[#C8A45D]/60 focus:border-[#C8A45D] focus:ring-[#C8A45D]/30'
            } ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-[#692D40] font-medium mt-1">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-[#292623]/60 mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

RoyalInput.displayName = 'RoyalInput';

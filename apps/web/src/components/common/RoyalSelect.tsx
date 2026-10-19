import React, { forwardRef } from 'react';

export interface OptionItem {
  value: string;
  label: string;
}

export interface RoyalSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: OptionItem[];
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
}

export const RoyalSelect = forwardRef<HTMLSelectElement, RoyalSelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      required,
      id,
      placeholder = 'Select an option',
      className = '',
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name || Math.random().toString(36).substring(2, 9);
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold tracking-wider uppercase text-[#16283D]"
        >
          {label} {required && <span className="text-[#692D40]">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            required={required}
            className={`w-full px-3.5 py-2.5 bg-[#FCF9F2] text-[#292623] border rounded-sm text-sm transition-colors duration-150 focus:outline-none focus:ring-1 appearance-none pr-10 ${
              error
                ? 'border-[#692D40] focus:border-[#692D40] focus:ring-[#692D40]/30'
                : 'border-[#E3D8C4] hover:border-[#C8A45D]/60 focus:border-[#C8A45D] focus:ring-[#C8A45D]/30'
            } ${className}`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#16283D]/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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

RoyalSelect.displayName = 'RoyalSelect';

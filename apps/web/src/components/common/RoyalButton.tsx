import React from 'react';

export interface RoyalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary-gold' | 'royal-navy' | 'luxury-outline' | 'burgundy-wax' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const RoyalButton: React.FC<RoyalButtonProps> = ({
  variant = 'primary-gold',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8A45D] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none tracking-wide text-center';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 rounded-sm min-h-[36px]',
    md: 'text-sm px-5 py-2.5 rounded-sm min-h-[44px]',
    lg: 'text-base px-7 py-3 rounded-sm min-h-[50px] font-semibold',
  };

  const variantClasses = {
    'primary-gold':
      'bg-[#C8A45D] text-[#16283D] font-semibold border border-[#9B7833]/40 shadow-sm hover:bg-[#D5B573] hover:shadow-royal active:translate-y-[1px]',
    'royal-navy':
      'bg-[#16283D] text-[#F7F1E5] border border-[#C8A45D]/50 shadow-sm hover:bg-[#253D5B] hover:border-[#C8A45D] hover:shadow-royal active:translate-y-[1px]',
    'luxury-outline':
      'bg-transparent text-[#16283D] border border-[#C8A45D] hover:bg-[#C8A45D]/10 hover:border-[#9B7833] active:translate-y-[1px]',
    'burgundy-wax':
      'bg-[#692D40] text-[#F7F1E5] border border-[#883C54] shadow-sm hover:bg-[#883C54] active:translate-y-[1px]',
    ghost:
      'bg-transparent text-[#16283D] hover:text-[#C8A45D] hover:bg-black/5',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
};

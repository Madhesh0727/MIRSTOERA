import React from 'react';

interface RoyalBadgeProps {
  variant?: 'gold' | 'navy' | 'burgundy' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const RoyalBadge: React.FC<RoyalBadgeProps> = ({
  variant = 'gold',
  size = 'md',
  children,
  className = '',
}) => {
  const variantClasses = {
    gold: 'bg-[#C8A45D]/15 text-[#9B7833] border border-[#C8A45D]/40',
    navy: 'bg-[#16283D] text-[#F7F1E5] border border-[#C8A45D]/30',
    burgundy: 'bg-[#692D40]/15 text-[#692D40] border border-[#692D40]/30',
    outline: 'bg-transparent text-[#16283D] border border-[#C8A45D]',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium uppercase rounded-sm ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

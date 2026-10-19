import React from 'react';

interface RoyalCrownProps {
  className?: string;
  size?: number;
  color?: string;
}

export const RoyalCrown: React.FC<RoyalCrownProps> = ({
  className = '',
  size = 24,
  color = '#C8A45D',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v1H5z" />
      <circle cx="12" cy="4" r="1.2" fill={color} />
      <circle cx="5" cy="4" r="1.2" fill={color} />
      <circle cx="19" cy="4" r="1.2" fill={color} />
    </svg>
  );
};

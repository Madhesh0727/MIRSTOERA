import React from 'react';

interface RoyalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  doubleBorder?: boolean;
  elevation?: 'flat' | 'subtle' | 'elevated';
  children: React.ReactNode;
}

export const RoyalCard: React.FC<RoyalCardProps> = ({
  doubleBorder = false,
  elevation = 'subtle',
  children,
  className = '',
  ...props
}) => {
  const elevationClasses = {
    flat: 'border border-[#E3D8C4] bg-[#FCF9F2]',
    subtle: 'border border-[#E3D8C4] bg-[#FCF9F2] shadow-sm hover:shadow-royal transition-shadow duration-300',
    elevated: 'border border-[#C8A45D]/40 bg-[#FCF9F2] shadow-royal',
  };

  return (
    <div
      className={`rounded-sm p-6 relative ${elevationClasses[elevation]} ${
        doubleBorder ? 'royal-double-border' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

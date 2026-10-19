import React from 'react';
import { RoyalCrown } from './RoyalCrown';
import { MomeraLogo } from './MomeraLogo';

interface GoldDividerProps {
  className?: string;
  withCrown?: boolean;
  withEmblem?: boolean;
}

export const GoldDivider: React.FC<GoldDividerProps> = ({
  className = '',
  withCrown = true,
  withEmblem = false,
}) => {
  return (
    <div className={`flex items-center justify-center space-x-3 my-6 ${className}`} role="separator">
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#C8A45D] to-[#C8A45D]" />
      {withEmblem ? (
        <MomeraLogo variant="emblem" size={22} alt="MIRSTOERA Crest" />
      ) : withCrown ? (
        <RoyalCrown size={18} color="#C8A45D" />
      ) : (
        <div className="w-1.5 h-1.5 rotate-45 bg-[#C8A45D]" />
      )}
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-[#C8A45D] to-[#C8A45D]" />
    </div>
  );
};

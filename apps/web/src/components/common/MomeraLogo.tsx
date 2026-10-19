import React from 'react';

export interface MomeraLogoProps {
  /**
   * 'full': Complete emblem with MIRSTOERA typography
   * 'emblem': The royal winged crown emblem only
   */
  variant?: 'full' | 'emblem';
  className?: string;
  size?: number | string;
  alt?: string;
  priority?: boolean;
}

export const MomeraLogo: React.FC<MomeraLogoProps> = ({
  variant = 'full',
  className = '',
  size = 40,
  alt = 'MIRSTOERA — Royal Moments Experience Platform',
  priority = false,
}) => {
  const src = variant === 'emblem' ? '/logo-emblem.svg' : '/logo.svg';
  const dimensionStyle =
    typeof size === 'number'
      ? { height: `${size}px`, width: 'auto' }
      : { height: size };

  return (
    <img
      src={src}
      alt={alt}
      style={dimensionStyle}
      className={`inline-block object-contain select-none transition-transform duration-300 ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
};

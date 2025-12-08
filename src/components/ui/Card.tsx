import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const hoverStyles = hover ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-xl p-6 rounded-2xl ${className}`}>
      {children}
    </div>
  );
};

export default Card;
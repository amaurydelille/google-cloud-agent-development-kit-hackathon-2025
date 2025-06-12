import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variantClasses = {
    default: 'bg-neutral-900/10 backdrop-blur-xl border border-neutral-700/20',
    glass: 'bg-neutral-900/5 backdrop-blur-sm border border-neutral-700/10',
    solid: 'bg-neutral-800/20 backdrop-blur-xl border border-neutral-600/30'
  };
  
  const classes = `${variantClasses[variant]} rounded-3xl p-8 shadow-2xl ${className}`.trim();
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
} 
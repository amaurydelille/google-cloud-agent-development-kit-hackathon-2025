import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-medium transition-all duration-200 backdrop-blur-sm';
  
  const variantClasses = {
    primary: 'bg-teal-500 hover:bg-teal-600 from-neutral-700 to-neutral-800 hover:from-neutral-600 hover:to-neutral-700 disabled:from-neutral-800 disabled:to-neutral-900 text-neutral-100 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'text-neutral-300 hover:text-neutral-100 bg-neutral-800/10 hover:bg-neutral-700/20 border border-neutral-700/20'
  };
  
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm rounded-xl',
    md: 'py-3 px-6 text-base rounded-2xl',
    lg: 'py-5 px-8 text-lg rounded-xl'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const classes = `cursor-pointer ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
} 
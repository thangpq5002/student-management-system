import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  const variants = {
    primary:
      'bg-primary-container text-on-primary hover:bg-primary shadow-sm hover:shadow focus:ring-2 focus:ring-primary/20',
    secondary:
      'bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary border border-outline-variant/30',
    danger:
      'bg-error text-on-error hover:bg-error/90 shadow-sm focus:ring-2 focus:ring-error/20',
    ghost:
      'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
    outline:
      'border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low',
  };

  const sizes = {
    sm: 'text-xs h-9 px-3 gap-1.5',
    md: 'text-sm h-11 px-4 gap-2',
    lg: 'text-base h-12 px-5 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="material-symbols-outlined text-[18px] animate-spin">
          progress_activity
        </span>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};

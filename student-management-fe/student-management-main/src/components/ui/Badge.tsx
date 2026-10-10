import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'neutral';
  withDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'primary',
  withDot = false,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-fixed text-primary',
    secondary: 'bg-secondary-fixed text-secondary',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    error: 'bg-error-container text-error',
    outline: 'border border-outline-variant text-on-surface-variant bg-surface-container-lowest',
    neutral: 'bg-surface-container text-on-surface-variant',
  };

  const dots = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    error: 'bg-error',
    outline: 'bg-outline',
    neutral: 'bg-on-surface-variant',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap',
        variants[variant],
        className
      )}
      {...props}
    >
      {withDot && <span className={cn('w-1.5 h-1.5 rounded-full', dots[variant])} />}
      {children}
    </span>
  );
};

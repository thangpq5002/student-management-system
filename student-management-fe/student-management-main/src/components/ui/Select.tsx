import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, required, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-on-surface flex items-center gap-1">
            {label}
            {required && <span className="text-error font-bold">*</span>}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full h-11 pl-3.5 pr-9 rounded-xl bg-surface-container-low text-on-surface font-normal text-sm appearance-none outline-none border border-transparent focus:bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer',
              error && 'border-error/60 bg-error-container/20 focus:border-error focus:ring-error/20',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <span className="material-symbols-outlined absolute right-3 pointer-events-none text-outline text-[18px]">
            expand_more
          </span>
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

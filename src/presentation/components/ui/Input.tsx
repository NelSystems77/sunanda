import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/shared/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-all duration-300 outline-none',
              error
                ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30'
                : 'border-gray-200 dark:border-dark-600 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 dark:focus:ring-gold-900/30',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-dark-800',
              className
            )}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

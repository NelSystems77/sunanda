import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = false,
      resize = 'vertical',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const resizeClass = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-all duration-300 outline-none min-h-[100px]',
            error
              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30'
              : 'border-gray-200 dark:border-dark-600 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 dark:focus:ring-gold-900/30',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-dark-800',
            resizeClass[resize],
            className
          )}
          disabled={disabled}
          {...props}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

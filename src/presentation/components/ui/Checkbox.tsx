import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, disabled, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only peer"
              disabled={disabled}
              {...props}
            />
            <div
              className={cn(
                'w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center',
                error
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-dark-600 peer-checked:border-gold-500 peer-checked:bg-gold-500',
                disabled && 'opacity-50 cursor-not-allowed',
                'peer-focus:ring-2 peer-focus:ring-gold-200 dark:peer-focus:ring-gold-900/30',
                className
              )}
            >
              <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>

          {(label || description) && (
            <div className="flex-1">
              {label && (
                <span
                  className={cn(
                    'text-sm font-medium text-gray-700 dark:text-gray-300',
                    disabled && 'opacity-50'
                  )}
                >
                  {label}
                </span>
              )}
              {description && (
                <p
                  className={cn(
                    'text-xs text-gray-500 dark:text-gray-400 mt-0.5',
                    disabled && 'opacity-50'
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </label>

        {error && <p className="text-sm text-red-500 ml-8">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

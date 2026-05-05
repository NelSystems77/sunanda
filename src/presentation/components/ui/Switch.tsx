import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/utils';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: {
    track: 'w-9 h-5',
    thumb: 'w-4 h-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7',
  },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, size = 'md', className, disabled, ...props }, ref) => {
    const styles = sizeStyles[size];

    return (
      <label className={cn('flex items-start gap-3 cursor-pointer group', className)}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            disabled={disabled}
            {...props}
          />
          <div
            className={cn(
              'rounded-full transition-all duration-300',
              styles.track,
              'bg-gray-300 dark:bg-dark-600',
              'peer-checked:bg-gold-500',
              'peer-focus:ring-2 peer-focus:ring-gold-200 dark:peer-focus:ring-gold-900/30',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />
          <div
            className={cn(
              'absolute left-0.5 rounded-full bg-white shadow-md transition-transform duration-300',
              styles.thumb,
              'peer-checked:' + styles.translate
            )}
          />
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
    );
  }
);

Switch.displayName = 'Switch';

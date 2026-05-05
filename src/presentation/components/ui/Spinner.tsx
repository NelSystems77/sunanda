import { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  fullScreen?: boolean;
  text?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const variantStyles = {
  primary: 'text-gold-500',
  secondary: 'text-dark-900 dark:text-white',
  white: 'text-white',
};

export function Spinner({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  text,
  className,
  ...props
}: SpinnerProps) {
  const spinner = (
    <div
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      {...props}
    >
      <Loader2 className={cn('animate-spin', sizeStyles[size], variantStyles[variant])} />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

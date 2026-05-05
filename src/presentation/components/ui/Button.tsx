import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles = {
  primary:
    'bg-gold-500 text-white hover:bg-gold-600 shadow-gold-md hover:shadow-gold-lg border-gold-500',
  secondary:
    'bg-dark-900 text-white hover:bg-dark-800 shadow-md hover:shadow-lg border-dark-900',
  outline:
    'border-2 border-gold-500 text-gold-600 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/10',
  ghost:
    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 border-transparent',
  danger:
    'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg border-red-500',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 border disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 dark:focus:ring-offset-dark-900',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span>{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span>{rightIcon}</span>}
    </motion.button>
  );
}

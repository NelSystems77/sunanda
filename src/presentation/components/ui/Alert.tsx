import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  icon?: ReactNode;
}

const variantStyles = {
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'text-blue-500',
    title: 'text-blue-900 dark:text-blue-300',
    text: 'text-blue-700 dark:text-blue-400',
    IconComponent: Info,
  },
  success: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    icon: 'text-green-500',
    title: 'text-green-900 dark:text-green-300',
    text: 'text-green-700 dark:text-green-400',
    IconComponent: CheckCircle,
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-500',
    title: 'text-yellow-900 dark:text-yellow-300',
    text: 'text-yellow-700 dark:text-yellow-400',
    IconComponent: AlertCircle,
  },
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-500',
    title: 'text-red-900 dark:text-red-300',
    text: 'text-red-700 dark:text-red-400',
    IconComponent: XCircle,
  },
};

export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  icon,
  className,
  ...props
}: AlertProps) {
  const styles = variantStyles[variant];
  const IconComponent = styles.IconComponent;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'relative flex gap-3 p-4 rounded-lg border',
        styles.container,
        className
      )}
      {...props}
    >
      <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
        {icon || <IconComponent className="w-5 h-5" />}
      </div>

      <div className="flex-1 space-y-1">
        {title && <h4 className={cn('font-semibold text-sm', styles.title)}>{title}</h4>}
        <div className={cn('text-sm', styles.text)}>{children}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            'flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
            styles.icon
          )}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

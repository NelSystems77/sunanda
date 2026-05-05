import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
      )}

      <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
          {description}
        </p>
      )}

      {action && (
        <Button onClick={action.onClick} leftIcon={action.icon}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

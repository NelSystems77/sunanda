import { ReactNode } from 'react';
import { cn } from '@/shared/utils';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}

      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-dark-900 dark:text-white truncate">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">{description}</p>
          )}
        </div>

        {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

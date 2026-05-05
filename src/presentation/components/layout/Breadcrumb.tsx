import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/shared/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)}>
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-dark-400 hover:text-gold-500 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-dark-600" />
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-dark-400 hover:text-gold-500 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-medium">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
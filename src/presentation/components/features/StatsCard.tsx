import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { cn, formatCurrency } from '@/shared/utils';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  isCurrency?: boolean;
  className?: string;
}

const variantStyles = {
  default: {
    bg: 'bg-gray-50 dark:bg-dark-700',
    icon: 'text-gray-600 dark:text-gray-400',
  },
  primary: {
    bg: 'bg-gold-50 dark:bg-gold-900/20',
    icon: 'text-gold-600 dark:text-gold-400',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
  },
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  isCurrency = false,
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant];
  const displayValue = isCurrency && typeof value === 'number' 
    ? formatCurrency(value) 
    : value;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(className)}
    >
      <Card padding="md" variant="gold">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {title}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-dark-900 dark:text-white">
                {displayValue}
              </p>

              {trend && (
                <div className="flex items-center gap-1 mt-2">
                  {trend.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      trend.isPositive ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    vs mes anterior
                  </span>
                </div>
              )}
            </div>

            <div className={cn('p-3 rounded-lg', styles.bg)}>
              <Icon className={cn('w-6 h-6', styles.icon)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

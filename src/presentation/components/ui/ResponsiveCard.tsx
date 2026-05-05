import { ReactNode } from 'react';
import { useMobileDetect } from '@/presentation/hooks';
import { cn } from '@/shared/utils';
import { LucideIcon } from 'lucide-react';

/**
 * Card Responsive Component
 * 
 * Mobile: Full width, padding reducido, tap-friendly
 * Desktop: Ancho específico, padding generoso
 */

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({ children, className, padding = 'md', onClick }: CardProps) {
  const { isMobile } = useMobileDetect();

  const paddingClasses = {
    none: 'p-0',
    sm: isMobile ? 'p-3' : 'p-4',
    md: isMobile ? 'p-4' : 'p-6',
    lg: isMobile ? 'p-5' : 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm',
        paddingClasses[padding],
        onClick && 'cursor-pointer active:scale-98 transition-transform',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * StatCard - Card con estadística
 * Mobile: Compacto, icono pequeño
 * Desktop: Espacioso, icono grande
 */

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'gold' | 'blue' | 'green' | 'purple' | 'red';
  onClick?: () => void;
}

export function StatCard({ label, value, icon: Icon, trend, color = 'gold', onClick }: StatCardProps) {
  const { isMobile } = useMobileDetect();

  const colorClasses = {
    gold: 'from-gold-500 to-gold-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <Card 
      onClick={onClick}
      padding={isMobile ? 'sm' : 'md'}
      className={cn(onClick && 'hover:shadow-lg transition-shadow')}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            'text-gray-600 dark:text-gray-400 font-medium',
            isMobile ? 'text-xs mb-1' : 'text-sm mb-2'
          )}>
            {label}
          </p>
          <p className={cn(
            'font-bold text-gray-900 dark:text-white',
            isMobile ? 'text-2xl' : 'text-3xl'
          )}>
            {value}
          </p>
          
          {/* Trend indicator */}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {trend.isPositive ? (
                  <path fillRule="evenodd" d="M12 7a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 11-2 0v-2.586l-4.293 4.293a1 1 0 01-1.414 0L8 11.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 11.586l3.293-3.293H13a1 1 0 01-1-1z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M12 13a1 1 0 01-1 1H7a1 1 0 01-1-1V9a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0L13 9.414l-3.293 3.293H11a1 1 0 011 1z" clipRule="evenodd" />
                )}
              </svg>
              <span className="text-sm font-semibold">
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className={cn(
            'rounded-lg bg-gradient-to-br flex items-center justify-center',
            colorClasses[color],
            isMobile ? 'w-10 h-10' : 'w-12 h-12'
          )}>
            <Icon className={cn('text-white', isMobile ? 'w-5 h-5' : 'w-6 h-6')} />
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * CardGrid Responsive
 * Mobile: 1 columna
 * Tablet: 2 columnas
 * Desktop: 2-4 columnas según especificado
 */

interface CardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function CardGrid({ children, columns = 3, className }: CardGridProps) {
  const { isMobile, isTablet } = useMobileDetect();

  return (
    <div className={cn(
      'grid gap-4 md:gap-6',
      // Mobile: siempre 1 columna
      isMobile && 'grid-cols-1',
      // Tablet: máximo 2 columnas
      isTablet && 'grid-cols-2',
      // Desktop: según prop
      !isMobile && !isTablet && {
        'grid-cols-2': columns === 2,
        'grid-cols-3': columns === 3,
        'grid-cols-4': columns === 4,
      },
      className
    )}>
      {children}
    </div>
  );
}

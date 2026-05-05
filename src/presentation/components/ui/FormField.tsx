import { ReactNode } from 'react';
import { useMobileDetect } from '@/presentation/hooks';
import { cn } from '@/shared/utils';

/**
 * FormField Responsive Component
 * 
 * Mobile: Stack vertical, full width, 48px height (touch-friendly)
 * Desktop: Puede ser grid, inputs normales
 */

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  helper?: string;
  className?: string;
}

export function FormField({
  label,
  children,
  error,
  required,
  helper,
  className
}: FormFieldProps) {
  const { isMobile } = useMobileDetect();

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <label className={cn(
        'block font-medium text-gray-700 dark:text-gray-300',
        isMobile ? 'text-base' : 'text-sm'
      )}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input/Select/Textarea wrapper */}
      <div className={cn(
        // Mobile: Min height 48px, font 16px (evita zoom iOS)
        isMobile && '[&_input]:min-h-[48px] [&_input]:text-base',
        isMobile && '[&_select]:min-h-[48px] [&_select]:text-base',
        isMobile && '[&_textarea]:min-h-[120px] [&_textarea]:text-base',
        // Desktop: Altura normal
        !isMobile && '[&_input]:h-10 [&_input]:text-sm',
        !isMobile && '[&_select]:h-10 [&_select]:text-sm'
      )}>
        {children}
      </div>

      {/* Helper text */}
      {helper && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {helper}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * FormGrid Responsive
 * Mobile: 1 columna
 * Tablet: 2 columnas
 * Desktop: 2-3 columnas según especificado
 */

interface FormGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function FormGrid({ children, columns = 2, className }: FormGridProps) {
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
        'grid-cols-1': columns === 1,
        'grid-cols-2': columns === 2,
        'grid-cols-3': columns === 3,
      },
      className
    )}>
      {children}
    </div>
  );
}

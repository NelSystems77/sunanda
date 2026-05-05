import { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils';
import { useTheme } from '@/presentation/hooks/useTheme';

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark' | 'auto';
}

const sizeStyles = {
  sm: { img: 'w-8 h-8', text: 'text-lg' },
  md: { img: 'w-12 h-12', text: 'text-2xl' },
  lg: { img: 'w-16 h-16', text: 'text-3xl' },
  xl: { img: 'w-24 h-24', text: 'text-4xl' },
};

export function Logo({ size = 'md', showText = true, variant = 'auto', className, ...props }: LogoProps) {
  const styles = sizeStyles[size];
  const { theme } = useTheme();
  
  // Determinar variante basado en tema actual
  const effectiveVariant = variant === 'auto' 
    ? (theme === 'dark' ? 'dark' : 'light')
    : variant;

  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      <img
        src="/icons/icon-192.png"
        alt="SUNANDA Logo"
        className={cn(styles.img, 'object-contain rounded-full shadow-gold-md')}
      />
      {showText && (
        <div>
          <h1
            className={cn(
              'font-serif font-bold leading-none',
              styles.text,
              effectiveVariant === 'light' ? 'text-dark-900' : 'text-white'
            )}
          >
            SUNANDA
          </h1>
          <p
            className={cn(
              'text-xs',
              effectiveVariant === 'light' ? 'text-gold-600' : 'text-gold-400'
            )}
          >
            Estética y Spa
          </p>
        </div>
      )}
    </div>
  );
}
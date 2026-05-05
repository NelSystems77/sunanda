import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: ReactNode;
}

const variantStyles = {
  default:
    'bg-white dark:bg-dark-800 shadow-md hover:shadow-lg border border-gray-100 dark:border-dark-700',
  gold: 'bg-white dark:bg-dark-800 shadow-gold-md hover:shadow-gold-lg border border-gold-200 dark:border-gold-800',
  glass: 'glass-effect border border-white/20 dark:border-dark-700/50',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  variant = 'default',
  padding = 'md',
  hover = true,
  children,
  className,
  ...props
}: CardProps) {
  const Component = hover ? motion.div : 'div';
  const motionProps = hover
    ? {
        whileHover: { y: -4 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={cn(
        'rounded-lg transition-all duration-300',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-xl font-semibold text-dark-900 dark:text-white', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-gray-600 dark:text-gray-400', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-100 dark:border-dark-700', className)} {...props}>
      {children}
    </div>
  );
}

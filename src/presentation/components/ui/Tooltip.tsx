import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/utils';

export interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const positionStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-dark-700',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-dark-700',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-dark-700',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-dark-700',
};

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-dark-700 rounded-lg shadow-lg whitespace-nowrap pointer-events-none',
              positionStyles[position],
              className
            )}
          >
            {content}
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-0 h-0 border-4 border-transparent',
                arrowStyles[position]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

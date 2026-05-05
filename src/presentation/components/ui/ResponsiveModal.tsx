import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMobileDetect } from '@/presentation/hooks';
import { cn } from '@/shared/utils';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ResponsiveModal Component
 * 
 * Mobile: Fullscreen desde bottom (slide up)
 * Tablet/Desktop: Modal centrado tradicional
 */

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className
}: ResponsiveModalProps) {
  const { isMobile } = useMobileDetect();

  // Bloquear scroll del body cuando modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          {isMobile ? (
            // MOBILE: Fullscreen desde bottom
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-dark-900"
            >
              {/* Header fijo */}
              <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 sticky top-0 z-10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                {children}
              </div>

              {/* Footer fijo (si existe) */}
              {footer && (
                <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 sticky bottom-0">
                  {footer}
                </div>
              )}
            </motion.div>
          ) : (
            // DESKTOP/TABLET: Modal centrado
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'relative w-full bg-white dark:bg-dark-900 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col',
                  sizeClasses[size],
                  className
                )}
              >
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                    aria-label="Cerrar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800 rounded-b-2xl">
                    {footer}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * ModalFooter helper - botones alineados correctamente
 */

interface ModalFooterProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
}

export function ModalFooter({ children, align = 'right' }: ModalFooterProps) {
  const { isMobile } = useMobileDetect();

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div className={cn(
      'flex gap-3',
      // Mobile: Stack vertical, full width
      isMobile && 'flex-col',
      // Desktop: Horizontal, según align
      !isMobile && 'flex-row',
      !isMobile && alignClasses[align],
      // Mobile buttons full width
      isMobile && '[&>button]:w-full'
    )}>
      {children}
    </div>
  );
}

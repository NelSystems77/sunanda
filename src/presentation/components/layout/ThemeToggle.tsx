import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/presentation/hooks/useTheme';
import { cn } from '@/shared/utils';

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative p-2 rounded-lg transition-colors',
        'hover:bg-gray-100 dark:hover:bg-dark-700',
        'focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 dark:focus:ring-offset-dark-900',
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1,
            rotate: isDark ? 180 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Sun className="w-6 h-6 text-gold-500" />
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            opacity: isDark ? 1 : 0,
            rotate: isDark ? 0 : -180,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Moon className="w-6 h-6 text-gold-400" />
        </motion.div>
      </div>
    </button>
  );
}

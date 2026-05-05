import { HTMLAttributes } from 'react';
import { cn, getInitials, stringToColor } from '@/shared/utils';
import { User } from 'lucide-react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  showStatus?: boolean;
}

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-2xl',
};

const statusStyles = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

const statusSizeStyles = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
};

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  showStatus = false,
  className,
  ...props
}: AvatarProps) {
  const initials = name ? getInitials(name) : '';
  const backgroundColor = name ? stringToColor(name) : '#d4af37';

  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold text-white border-2 border-white dark:border-dark-800 shadow-md',
          sizeStyles[size]
        )}
        style={{ backgroundColor: src ? undefined : backgroundColor }}
      >
        {src ? (
          <img src={src} alt={alt || name || 'Avatar'} className="w-full h-full object-cover" />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className="w-1/2 h-1/2" />
        )}
      </div>

      {showStatus && status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-dark-800',
            statusStyles[status],
            statusSizeStyles[size]
          )}
        />
      )}
    </div>
  );
}

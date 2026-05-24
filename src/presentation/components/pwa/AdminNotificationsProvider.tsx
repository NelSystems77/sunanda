import { useAdminNotifications } from '@/presentation/hooks/useAdminNotifications';
import { NotificationPermission } from './NotificationPermission';

export function AdminNotificationsProvider({ children }: { children: React.ReactNode }) {
  useAdminNotifications();
  return (
    <>
      {children}
      <NotificationPermission />
    </>
  );
}

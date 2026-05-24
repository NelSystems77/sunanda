import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { fcmService } from '@/core/infrastructure/services/FCMNotificationService';
import { useAuthStore } from '@/presentation/context/AuthStore';

export function useAdminNotifications() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?.id) return;
    if (!fcmService.isSupported()) return;
    if (Notification.permission !== 'granted') return;

    let unsubscribe: (() => void) | undefined;

    const setup = async () => {
      await fcmService.registerToken(user.id);

      unsubscribe = fcmService.onForegroundMessage((payload) => {
        const body = payload.notification?.body || '';
        const type = payload.data?.type;

        switch (type) {
          case 'new_appointment':
            toast.success(`🗓️ Nueva cita: ${body}`, {
              duration: 10000,
              style: { background: '#1c2537', color: '#fff', borderLeft: '4px solid #22c55e' },
            });
            break;
          case 'appointment_cancelled':
            toast.error(`❌ Cita cancelada: ${body}`, {
              duration: 10000,
              style: { background: '#1c2537', color: '#fff', borderLeft: '4px solid #ef4444' },
            });
            break;
          case 'reminder_24h':
            toast(`⏰ Mañana: ${body}`, {
              duration: 8000,
              style: { background: '#1c2537', color: '#fff', borderLeft: '4px solid #eab308' },
            });
            break;
          case 'reminder_1h':
            toast(`🔔 En 1 hora: ${body}`, {
              duration: 8000,
              style: { background: '#1c2537', color: '#fff', borderLeft: '4px solid #f97316' },
            });
            break;
          default:
            toast(body || payload.notification?.title || 'Notificación SUNANDA Spa', {
              duration: 6000,
            });
        }
      });
    };

    setup();

    return () => {
      unsubscribe?.();
    };
  }, [user?.id]);
}

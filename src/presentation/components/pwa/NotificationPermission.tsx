import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { fcmService } from '@/core/infrastructure/services/FCMNotificationService';
import { useAuthStore } from '@/presentation/context/AuthStore';

export function NotificationPermission() {
  const user = useAuthStore((state) => state.user);
  const [show, setShow] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    if (!fcmService.isSupported()) return;
    if (Notification.permission !== 'default') return;

    // Mostrar el banner 4 segundos después del login para no interrumpir
    const timer = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(timer);
  }, [user?.id]);

  if (!show || !user) return null;

  const handleEnable = async () => {
    setRequesting(true);
    const granted = await fcmService.requestPermission();
    if (granted) {
      await fcmService.registerToken(user.id);
    }
    setShow(false);
    setRequesting(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-xs bg-dark-800 border border-gold-500/40 rounded-xl p-4 shadow-2xl shadow-black/40 animate-in slide-in-from-bottom-4">
      <button
        onClick={() => setShow(false)}
        className="absolute top-2.5 right-2.5 text-dark-500 hover:text-dark-300 transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gold-500/15 flex items-center justify-center">
          <Bell className="w-4.5 h-4.5 text-gold-400" />
        </div>
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-sm font-semibold text-white">Activar notificaciones</p>
          <p className="text-xs text-dark-400 mt-0.5 leading-relaxed">
            Recibe alertas de nuevas citas y recordatorios en este dispositivo
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEnable}
              disabled={requesting}
              className="px-3 py-1.5 bg-gold-500 text-dark-900 text-xs font-bold rounded-lg hover:bg-gold-400 disabled:opacity-60 transition-colors"
            >
              {requesting ? 'Activando…' : 'Activar'}
            </button>
            <button
              onClick={() => setShow(false)}
              className="px-3 py-1.5 text-dark-400 text-xs rounded-lg hover:text-white transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/presentation/context/AuthStore';

/**
 * Componente que muestra un prompt cuando hay una nueva versión disponible
 * Usa vite-plugin-pwa para detectar actualizaciones del Service Worker
 */
export function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('✅ SW Registered:', registration);
      
      // Verificar actualizaciones cada 60 minutos
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('❌ SW Registration error:', error);
      toast.error('Error al registrar Service Worker');
    },
    onOfflineReady() {
      console.log('📴 App ready to work offline');
      toast.success('App lista para modo offline', {
        icon: '📴',
        duration: 3000
      });
    },
    onNeedRefresh() {
      console.log('🔄 New version available');
      setUpdateAvailable(true);
      setShowPrompt(true);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      // App está lista para funcionar offline
      console.log('App configurada para modo offline');
    }
  }, [offlineReady]);

  useEffect(() => {
    if (needRefresh) {
      // Nueva versión disponible
      console.log('Nueva actualización disponible');
    }
  }, [needRefresh]);

  const handleUpdate = async () => {
    try {
      await updateServiceWorker(true);
      setShowPrompt(false);
      setNeedRefresh(false);
      
      // Recargar la página para aplicar cambios
      window.location.reload();
    } catch (error) {
      console.error('Error updating SW:', error);
      toast.error('Error al actualizar');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setNeedRefresh(false);
    setOfflineReady(false);
    
    toast('Actualización pospuesta', {
      icon: '⏭️',
      duration: 2000
    });
  };

  // No mostrar nada si no hay prompt
  if (!showPrompt && !updateAvailable) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            onClick={handleDismiss}
          />

          {/* Modal de actualización */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md mx-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header con gradiente */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 text-center relative">
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 text-white hover:text-gray-100 transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  <RefreshCw className="w-12 h-12 text-white mx-auto mb-3" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-white">
                  Nueva versión disponible
                </h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                  Hay una actualización disponible con mejoras y nuevas características.
                  ¿Deseas actualizar ahora?
                </p>

                {/* Botones */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDismiss}
                    className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors"
                  >
                    Más tarde
                  </button>
                  
                  <button
                    onClick={handleUpdate}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Actualizar
                  </button>
                </div>

                {/* Info adicional */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  La app se recargará automáticamente después de actualizar
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook personalizado para obtener info del PWA
 */
export function usePWAInfo() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detectar cambios de conectividad
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detectar si está instalada como PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInApp = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInApp);

    // Capturar evento de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar cuando se instala
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success('¡App instalada correctamente!', {
        icon: '🎉',
        duration: 5000
      });
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) {
      toast.error('La instalación no está disponible');
      return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success('Instalación iniciada');
      setDeferredPrompt(null);
      return true;
    } else {
      toast('Instalación cancelada', { icon: '❌' });
      return false;
    }
  };

  return {
    isOnline,
    isInstalled,
    canInstall: !!deferredPrompt,
    installPWA
  };
}

/**
 * Componente de instalación PWA
 */
export function InstallPrompt() {
  const { canInstall, installPWA, isInstalled } = usePWAInfo();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Mostrar banner después de 5 segundos si puede instalar y es usuario staff
    if (canInstall && !isInstalled && isAuthenticated) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [canInstall, isInstalled]);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setShowBanner(false);
    }
  };

  if (!showBanner || isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-3">
              <Download className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Instalar SUNANDA Spa
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Instala la app para acceso rápido y funcionalidad offline
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBanner(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Ahora no
                </button>
                <button
                  onClick={handleInstall}
                  className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-sm font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
                >
                  Instalar
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

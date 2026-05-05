import { useState, useEffect } from 'react';
import { Cookie, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'sunanda_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Pequeño delay para no interferir con el load inicial
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-gold-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold mb-1">Usamos cookies</p>
              <p className="text-sm text-dark-400">
                Utilizamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar el contenido.
                Tu privacidad es importante para nosotros.{' '}
                <a href="/privacy" className="text-gold-400 hover:underline">Más información</a>
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={decline}
                className="flex-1 sm:flex-none px-4 py-2.5 text-sm text-dark-400 hover:text-white border border-dark-600 hover:border-dark-500 rounded-xl transition-colors"
              >
                Solo esenciales
              </button>
              <button
                onClick={accept}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-dark-900 text-sm font-semibold rounded-xl transition-colors"
              >
                <Shield className="w-4 h-4" />
                Aceptar todo
              </button>
            </div>

            <button onClick={decline} className="absolute top-4 right-4 p-1 hover:bg-dark-700 rounded-lg sm:relative sm:top-0 sm:right-0 sm:flex-shrink-0">
              <X className="w-4 h-4 text-dark-500" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

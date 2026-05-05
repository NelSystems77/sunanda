import { useState, useEffect } from 'react';
import { X, Tag, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'sunanda_promo_dismissed';

export function PromosBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-gold-800 via-gold-600 to-gold-800 relative overflow-hidden"
        >
          <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
            <Tag className="w-4 h-4 text-dark-900 flex-shrink-0" />
            <p className="text-dark-900 text-sm font-semibold text-center">
              🌸 <span className="font-bold">Oferta Especial:</span> 15% de descuento en tu primer tratamiento facial
              <span className="hidden sm:inline"> · Válido este mes</span>
            </p>
            <div className="hidden sm:flex items-center gap-1 text-dark-900/70 text-xs flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>Mayo 2026</span>
            </div>
            <button
              onClick={dismiss}
              className="p-1 hover:bg-dark-900/10 rounded transition-colors flex-shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-dark-900" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

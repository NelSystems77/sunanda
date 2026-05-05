import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SCROLL_THRESHOLD = 300;

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          onClick={scrollToTop}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Volver al inicio"
          className="fixed bottom-24 right-6 z-50 group"
        >
          <div className="relative">
            {/* Anillo de pulso dorado */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gold-500 rounded-full"
            />
            {/* Botón */}
            <div className="relative bg-gold-500 hover:bg-gold-400 text-dark-900 rounded-full p-3 shadow-gold-xl transition-colors">
              <ChevronUp className="h-6 w-6" strokeWidth={2.5} />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

import { useState } from 'react';
import { MessageCircle, X, Phone, Clock, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WA = import.meta.env.VITE_WHATSAPP_NUMBER ?? '50688083390';

const QUICK_MESSAGES = [
  'Quiero agendar una cita 📅',
  'Consulta sobre tratamientos 💆',
  'Preguntar por precios 💰',
  'Información general 🌸',
];

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');

  const send = (msg: string) => {
    window.open(
      `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-dark-800 rounded-2xl border border-dark-700 shadow-2xl w-72 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-600 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">SUNANDA Spa</p>
                <div className="flex items-center gap-1 text-green-200 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  En línea
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              <div className="bg-dark-900 rounded-xl p-3 text-sm text-dark-400">
                <p className="text-white font-medium mb-1">¡Hola! 🌸</p>
                <p>¿En qué podemos ayudarte hoy?</p>
                <div className="flex items-center gap-1 text-dark-500 text-xs mt-2">
                  <Clock className="w-3 h-3" />
                  Respuesta en minutos
                </div>
              </div>

              <div className="space-y-2">
                {QUICK_MESSAGES.map(msg => (
                  <button
                    key={msg}
                    onClick={() => send(msg)}
                    className="w-full text-left px-3 py-2 bg-dark-700 hover:bg-dark-600 text-white text-sm rounded-lg transition-colors border border-dark-600 hover:border-green-500/50"
                  >
                    {msg}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe tu consulta…"
                  value={custom}
                  onChange={e => setCustom(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && custom.trim() && send(custom)}
                  className="flex-1 px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-dark-500"
                />
                <button
                  onClick={() => custom.trim() && send(custom)}
                  disabled={!custom.trim()}
                  className="p-2 bg-green-600 hover:bg-green-500 rounded-xl disabled:opacity-40 transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-dark-500 justify-center">
                <Phone className="w-3 h-3" />
                Abre WhatsApp automáticamente
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón principal */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-green-600 hover:bg-green-500 rounded-full shadow-xl flex items-center justify-center transition-colors relative"
        aria-label="Chat por WhatsApp"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X className="w-6 h-6 text-white" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Pulse */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
        )}
      </motion.button>
    </div>
  );
}

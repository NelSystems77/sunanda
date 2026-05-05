/**
 * WhatsAppButton Component
 * 
 * Botón flotante de WhatsApp
 * - Posición fija bottom-right
 * - Animación de pulso
 * - Link directo a WhatsApp Business
 * - Número: +506 8808-3390
 */

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function WhatsAppButton() {
  const whatsappNumber = '50688083390'; // Sin espacios ni guiones
  const message = encodeURIComponent('¡Hola! Me gustaría agendar una cita.');

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Botón principal */}
      <div className="relative">
        {/* Anillo de pulso */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-green-500 rounded-full"
        />

        {/* Botón */}
        <div className="relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl shadow-green-500/50 transition-colors">
          <MessageCircle className="h-7 w-7" />
        </div>

        {/* Badge "Contáctanos" */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          <div className="bg-dark-900 text-white px-4 py-2 rounded-lg shadow-xl border border-dark-700">
            <span className="font-medium">¡Contáctanos!</span>
          </div>
        </motion.div>
      </div>
    </motion.a>
  );
}

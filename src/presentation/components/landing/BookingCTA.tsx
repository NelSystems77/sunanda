import { Calendar, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const WA = import.meta.env.VITE_WHATSAPP_NUMBER ?? '50688083390';

export function BookingCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Fondo degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-gold-900/20 to-dark-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-medium mb-6 border border-gold-500/30">
            <Sparkles className="w-4 h-4" />
            <span>Agenda tu transformación hoy</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Tu Momento de Bienestar<br />
            <span className="text-gold-400">Comienza Aquí</span>
          </h2>

          <p className="text-lg text-dark-400 mb-10 max-w-2xl mx-auto">
            Reservá tu cita ahora y disfrutá de una experiencia única de belleza y relajación con productos Germaine de Capuccini.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-dark-900 rounded-xl font-bold text-lg hover:bg-gold-400 transition-all hover:scale-105 shadow-lg shadow-gold-500/25 w-full sm:w-auto justify-center"
            >
              <Calendar className="w-5 h-5" />
              Agendar Cita Online
            </a>

            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola! Quiero agendar una cita en SUNANDA Spa 🌸')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-dark-800 text-white rounded-xl font-bold text-lg hover:bg-dark-700 transition-all border border-dark-600 w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-5 h-5 text-green-400" />
              WhatsApp
            </a>
          </div>

          <p className="text-sm text-dark-500 mt-8">
            ⚡ Respuesta inmediata · 🌸 Primera cita con consulta personalizada incluida
          </p>
        </motion.div>
      </div>
    </section>
  );
}

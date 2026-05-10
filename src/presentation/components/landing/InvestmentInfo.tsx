/**
 * InvestmentInfo
 *
 * Sección informativa sobre la inversión personalizada y cuota de reserva.
 * Se muestra en el Landing (después de ServicesSection) y en PublicServicesPage.
 */

import { Link } from 'react-router-dom';
import { Calendar, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WA = import.meta.env.VITE_WHATSAPP_NUMBER ?? '50688083390';

export function InvestmentInfo() {
  return (
    <section className="py-16 md:py-20 bg-dark-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-dark-800 via-dark-800 to-gold-900/20 border border-gold-500/30 rounded-2xl p-8 md:p-10 text-center shadow-xl"
        >
          {/* Logo SUNANDA decorativo */}
          <div className="inline-flex items-center justify-center mb-6">
            <img
              src="/icons/icon-192.png"
              alt="SUNANDA Logo"
              className="w-16 h-16 object-contain rounded-full border-2 border-gold-500/40 shadow-lg shadow-gold-500/20"
            />
          </div>

          {/* Texto principal */}
          <p className="text-dark-200 text-base md:text-lg leading-relaxed mb-6">
            Entendemos que cada cuerpo es único; por ello, nuestros protocolos son tan exclusivos como usted.
            El plan de tratamiento e inversión se definen tras un{' '}
            <span className="text-gold-400 font-semibold">diagnóstico biométrico detallado</span>,
            alineado totalmente con sus objetivos personales.
          </p>

          <p className="text-dark-300 text-sm md:text-base leading-relaxed mb-6">
            Agende una cita de valoración y permítanos acompañarle en la conquista de sus metas.
          </p>

          {/* Cuota de reserva */}
          <div className="bg-dark-900/60 border border-gold-500/20 rounded-xl px-6 py-5 mb-8 text-left">
            <p className="text-dark-200 text-sm md:text-base leading-relaxed">
              Para brindarle una atención puntual y personalizada, con apertura de expediente clínico y diagnóstico
              en nuestra sede{' '}
              <span className="text-white font-semibold">Sunanda Guadalupe</span>, manejamos una{' '}
              <span className="text-gold-400 font-semibold">cuota de reserva de ₡10,000</span>.
            </p>
            <p className="text-dark-300 text-sm md:text-base leading-relaxed mt-3">
              Este monto no es un costo adicional, sino un{' '}
              <span className="text-white font-medium">pago inicial a su favor</span>,
              ya que se acreditará al 100% en el tratamiento o paquete que usted elija posterior a la valoración
              y análisis de sus objetivos.
            </p>
          </div>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold text-base rounded-xl shadow-lg shadow-gold-500/25 transition-all hover:scale-105 w-full sm:w-auto"
            >
              <Calendar className="h-5 w-5" />
              Agendar Cita de Valoración
            </Link>

            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola! Quiero agendar una cita de valoración en SUNANDA Spa 🌸')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-dark-700 hover:bg-dark-600 text-white font-bold text-base rounded-xl border border-dark-600 transition-all w-full sm:w-auto"
            >
              <MessageCircle className="h-5 w-5 text-green-400" />
              Consultar por WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WA = import.meta.env.VITE_WHATSAPP_NUMBER ?? '50688083390';

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: '¿Cuánto dura cada tratamiento?',
    answer: 'La duración varía según el servicio. Los tratamientos faciales duran entre 60 y 90 minutos, mientras que los corporales pueden extenderse hasta 120 minutos. Cada sesión incluye consulta personalizada y tiempo de relajación.',
  },
  {
    question: '¿Qué productos utilizan?',
    answer: 'Trabajamos exclusivamente con productos Germaine de Capuccini, una marca española de alta cosmética profesional. Todos nuestros productos son dermatológicamente testados y libres de crueldad animal.',
  },
  {
    question: '¿Necesito cita previa?',
    answer: 'Sí, trabajamos únicamente con cita previa para garantizar una atención personalizada. Podés agendar a través de nuestro sitio web, WhatsApp o llamada telefónica.',
  },
  {
    question: '¿Tienen estacionamiento?',
    answer: 'Sí, contamos con estacionamiento gratuito para nuestras clientas. El spa está ubicado en una zona segura y de fácil acceso en San José.',
  },
  {
    question: '¿Ofrecen paquetes o membresías?',
    answer: 'Sí, tenemos paquetes especiales con descuentos de hasta 20% y membresías mensuales. Consultanos por WhatsApp para conocer las opciones personalizadas.',
  },
  {
    question: '¿Cómo puedo pagar?',
    answer: 'Aceptamos SINPE Móvil y efectivo. Próximamente habilitaremos tarjetas de crédito/débito y transferencias bancarias.',
  },
  {
    question: '¿Puedo ir si tengo piel sensible?',
    answer: 'Por supuesto. Realizamos una consulta personalizada antes de cada tratamiento para adaptar los productos y técnicas a tu tipo de piel, incluyendo las más sensibles.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-dark-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-gold-400 text-sm font-semibold tracking-widest uppercase mb-3">FAQ</p>
          <h2 className="text-4xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
          <p className="text-dark-400">Todo lo que necesitás saber sobre nuestros servicios</p>
        </div>

        <div className="space-y-3" data-aos="fade-up" data-aos-delay="100">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-dark-750 transition-colors gap-4"
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gold-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-5 text-dark-400 leading-relaxed border-t border-dark-700 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="200">
          <p className="text-dark-400 mb-4">¿No encontrás tu respuesta?</p>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, tengo una consulta sobre los servicios de SUNANDA Spa')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-dark-900 rounded-xl font-semibold hover:bg-gold-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Consultanos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

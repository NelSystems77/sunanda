import { useState } from 'react';
import { X, Clock, Star, CheckCircle, Calendar, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WA = import.meta.env.VITE_WHATSAPP_NUMBER ?? '50688083390';

interface Treatment {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: string;
  rating: number;
  description: string;
  benefits: string[];
  steps: string[];
  ideal: string;
}

const TREATMENTS: Treatment[] = [
  {
    id: 'timexpert',
    name: 'Timexpert Lift_IN',
    category: 'Tratamiento Signature',
    duration: '90 min',
    price: '₡65,000',
    rating: 5,
    description: 'El tratamiento insignia de SUNANDA Spa. Tecnología avanzada Germaine de Capuccini que actúa sobre los mecanismos del envejecimiento desde adentro.',
    benefits: [
      'Efecto lifting visible desde la primera sesión',
      'Reafirmación cutánea profunda',
      'Reducción de arrugas y líneas de expresión',
      'Luminosidad y uniformidad del tono',
    ],
    steps: [
      'Consulta personalizada y análisis de piel',
      'Limpieza profunda y preparación',
      'Aplicación de sérum activo Lift_IN',
      'Masaje lifting con técnica especializada',
      'Mascarilla tensora con ácido hialurónico',
      'Finalización con FPS y cuidados post-tratamiento',
    ],
    ideal: 'Pieles maduras, flácidas o con pérdida de firmeza. A partir de 35 años.',
  },
  {
    id: 'hydracure',
    name: 'Hydracure Facial',
    category: 'Hidratación',
    duration: '75 min',
    price: '₡45,000',
    rating: 5,
    description: 'Hidratación profunda de última generación. Activa los acuaporines de la piel para una hidratación desde adentro hacia afuera.',
    benefits: [
      'Hidratación profunda de larga duración',
      'Reducción de rojeces e irritaciones',
      'Textura más suave y uniforme',
      'Barrera cutánea fortalecida',
    ],
    steps: [
      'Análisis de niveles de hidratación',
      'Limpieza suave con gel purificante',
      'Exfoliación enzimática',
      'Sérum Hydracure con hialurónico',
      'Mascarilla criotermal',
      'Crema barrera con SPF',
    ],
    ideal: 'Pieles deshidratadas, sensibles o con sensación de tirantez.',
  },
  {
    id: 'purifying',
    name: 'Limpieza Profunda',
    category: 'Purificación',
    duration: '60 min',
    price: '₡35,000',
    rating: 5,
    description: 'Limpieza facial completa que elimina impurezas, exceso de sebo y células muertas para revelar una piel luminosa y renovada.',
    benefits: [
      'Poros minimizados y limpios',
      'Eliminación de puntos negros',
      'Piel más luminosa y uniforme',
      'Preparación ideal para otros tratamientos',
    ],
    steps: [
      'Análisis del tipo de piel',
      'Limpieza con espuma purificante',
      'Vaporización e higienización',
      'Extracción profesional de impurezas',
      'Mascarilla reguladora de sebo',
      'Hidratante oil-free con FPS',
    ],
    ideal: 'Todo tipo de piel. Especialmente recomendado para piel grasa o mixta.',
  },
  {
    id: 'massage',
    name: 'Masaje Relajante',
    category: 'Cuerpo',
    duration: '60 min',
    price: '₡40,000',
    rating: 5,
    description: 'Masaje de cuerpo completo con técnica sueca y aceites esenciales premium que libera tensiones y restaura el equilibrio energético.',
    benefits: [
      'Relajación muscular profunda',
      'Reducción del estrés y ansiedad',
      'Mejora de la circulación',
      'Sensación de bienestar total',
    ],
    steps: [
      'Consulta de zonas de tensión',
      'Preparación con aceites esenciales',
      'Masaje técnica sueca (espalda)',
      'Masaje miembro superior e inferior',
      'Reflexología de pies',
      'Relajación final con aromaterapia',
    ],
    ideal: 'Para cualquier persona con estrés, tensión muscular o simplemente en busca de bienestar.',
  },
];

interface Props {
  preselectedId?: string;
  onClose: () => void;
}

export function TreatmentDetailsModal({ preselectedId, onClose }: Props) {
  const [selected, setSelected] = useState<Treatment>(
    TREATMENTS.find(t => t.id === preselectedId) ?? TREATMENTS[0]
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header con selector */}
          <div className="flex items-center justify-between p-5 border-b border-dark-700">
            <div className="flex gap-2 flex-wrap">
              {TREATMENTS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selected.id === t.id
                      ? 'bg-gold-500 text-dark-900'
                      : 'bg-dark-700 text-dark-400 hover:bg-dark-600'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-lg ml-2 flex-shrink-0">
              <X className="w-5 h-5 text-dark-400" />
            </button>
          </div>

          {/* Contenido */}
          <div className="overflow-y-auto flex-1 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs text-gold-400 font-semibold uppercase tracking-wide">{selected.category}</span>
                    <h3 className="text-2xl font-bold text-white mt-1">{selected.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gold-400">{selected.price}</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Clock className="w-3.5 h-3.5 text-dark-400" />
                      <span className="text-sm text-dark-400">{selected.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: selected.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-500 fill-current" />
                  ))}
                </div>

                <p className="text-dark-400 mb-6 leading-relaxed">{selected.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Beneficios */}
                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gold-400" />
                      Beneficios
                    </h4>
                    <ul className="space-y-2">
                      {selected.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-dark-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pasos */}
                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gold-400" />
                      Procedimiento
                    </h4>
                    <ol className="space-y-2">
                      {selected.steps.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-dark-400">
                          <span className="w-5 h-5 rounded-full bg-dark-700 flex items-center justify-center text-xs text-gold-400 font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="p-4 bg-dark-900 rounded-xl border border-dark-700 mb-6">
                  <p className="text-xs text-dark-500 uppercase font-semibold mb-1">Ideal para</p>
                  <p className="text-sm text-dark-400">{selected.ideal}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer CTA */}
          <div className="p-5 border-t border-dark-700 flex gap-3">
            <a
              href="/booking"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gold-500 text-dark-900 rounded-xl font-bold hover:bg-gold-400 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Agendar ahora
            </a>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola! Me interesa el tratamiento ${selected.name} 🌸`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-dark-700 text-white rounded-xl font-medium hover:bg-dark-600 transition-colors border border-dark-600"
            >
              <MessageCircle className="w-4 h-4 text-green-400" />
              Consultar por WhatsApp
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function TreatmentDetails() {
  const [open, setOpen] = useState(false);
  const [treatmentId, setTreatmentId] = useState<string | undefined>();

  return (
    <>
      <section className="py-20 bg-dark-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="text-gold-400 text-sm font-semibold tracking-widest uppercase mb-3">Tratamientos</p>
            <h2 className="text-4xl font-bold text-white mb-4">Nuestros Tratamientos</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Cada servicio está diseñado para dar resultados visibles desde la primera sesión
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            {TREATMENTS.map(t => (
              <motion.div
                key={t.id}
                whileHover={{ y: -3 }}
                className="bg-dark-900 rounded-xl border border-dark-700 p-6 cursor-pointer hover:border-gold-500/50 transition-all"
                onClick={() => { setTreatmentId(t.id); setOpen(true); }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-gold-400 font-semibold uppercase tracking-wide">{t.category}</span>
                    <h3 className="text-lg font-bold text-white mt-1">{t.name}</h3>
                  </div>
                  <span className="text-gold-400 font-bold text-lg">{t.price}</span>
                </div>
                <p className="text-sm text-dark-400 mb-4 line-clamp-2">{t.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-dark-500">
                    <Clock className="w-3.5 h-3.5" />
                    {t.duration}
                  </div>
                  <span className="text-xs text-gold-400 font-medium">Ver detalles →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {open && (
        <TreatmentDetailsModal
          preselectedId={treatmentId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

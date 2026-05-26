import { useState, useEffect } from 'react';
import { X, Clock, Star, CheckCircle, Calendar, MessageCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServiceStore } from '../../context/ServiceStore';
import { Service } from '@/core/domain/interfaces/Service';
import { getServiceCategoryText } from '@/core/domain/enums/serviceCategory';

const WA = import.meta.env.VITE_WHATSAPP_NUMBER ?? '50688083390';

// ---------------------------------------------------------------------------
// Modal de detalle — muestra un Service de Firestore
// ---------------------------------------------------------------------------
interface ModalProps {
  service: Service;
  onClose: () => void;
}

function TreatmentDetailsModal({ service, onClose }: ModalProps) {
  const durationLabel = `${service.duration} min`;
  const priceLabel    = `₡${service.priceCRC.toLocaleString()}`;
  const categoryLabel = service.brand
    ? `${getServiceCategoryText(service.category)} · ${service.brand}`
    : getServiceCategoryText(service.category);

  const hasRealImage =
    service.imageURL &&
    (service.imageURL.startsWith('http') || service.imageURL.startsWith('/'));

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
          className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-dark-700">
            <div className="min-w-0 flex-1">
              <span className="text-xs text-gold-400 font-semibold uppercase tracking-wide">
                {categoryLabel}
              </span>
              <h3 className="text-xl font-bold text-white mt-1 leading-tight">{service.name}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-700 rounded-lg ml-3 flex-shrink-0"
            >
              <X className="w-5 h-5 text-dark-400" />
            </button>
          </div>

          {/* Contenido */}
          <div className="overflow-y-auto flex-1 p-6 space-y-5">
            {/* Imagen real */}
            {hasRealImage && (
              <div className="relative h-48 rounded-xl overflow-hidden">
                <img
                  src={service.imageURL}
                  alt={service.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}

            {/* Duración · Estrellas · Precio */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-dark-400">
                <Clock className="w-4 h-4 text-gold-400" />
                {durationLabel}
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-gold-500 fill-current" />
                ))}
              </div>
              {service.hasPromotion && service.promotionValue ? (
                <div className="ml-auto text-right">
                  <span className="text-xs text-dark-500 line-through block">
                    {priceLabel}
                  </span>
                  <span className="text-gold-400 font-bold text-sm">
                    {service.promotionType === 'percentage'
                      ? `₡${Math.round(service.priceCRC * (1 - service.promotionValue / 100)).toLocaleString()}`
                      : priceLabel}
                  </span>
                </div>
              ) : (
                <span className="text-gold-400 font-bold ml-auto">{priceLabel}</span>
              )}
            </div>

            {/* Descripción */}
            <p className="text-dark-400 leading-relaxed">{service.description}</p>

            {/* Beneficios */}
            {service.benefits && service.benefits.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gold-400" />
                  Beneficios
                </h4>
                <ul className="space-y-2">
                  {service.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-dark-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Promoción vigente */}
            {service.hasPromotion && service.promotionDescription && (
              <div className="p-4 bg-gold-500/10 rounded-xl border border-gold-500/30">
                <p className="text-xs text-gold-400 uppercase font-semibold mb-1">
                  Promoción especial
                </p>
                <p className="text-sm text-dark-300">{service.promotionDescription}</p>
              </div>
            )}

            {/* Sesiones si aplica */}
            {service.sessions && service.sessions > 1 && (
              <div className="p-4 bg-dark-900 rounded-xl border border-dark-700">
                <p className="text-xs text-dark-500 uppercase font-semibold mb-1">
                  Sesiones incluidas
                </p>
                <p className="text-sm text-dark-300 font-medium">
                  {service.sessions} sesiones
                </p>
              </div>
            )}
          </div>

          {/* Footer CTAs */}
          <div className="p-5 border-t border-dark-700 flex gap-3">
            <a
              href="/booking"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gold-500 text-dark-900 rounded-xl font-bold hover:bg-gold-400 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Agendar ahora
            </a>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola! Me interesa el tratamiento ${service.name} 🌸`)}`}
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

// ---------------------------------------------------------------------------
// Sección pública del catálogo — carga desde Firestore
// ---------------------------------------------------------------------------
export function TreatmentDetails() {
  const { services, loading, fetchActiveServices } = useServiceStore();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetchActiveServices();
  }, [fetchActiveServices]);

  const activeServices = services.filter(s => s.isActive);

  return (
    <>
      {/* Sección: bg-dark-800 para que las tarjetas bg-dark-700 sean visibles (más claras que el fondo) */}
      <section className="py-20 bg-dark-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="text-gold-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Tratamientos
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">Nuestros Tratamientos</h2>
            <p className="text-dark-300 max-w-2xl mx-auto">
              Cada servicio está diseñado para dar resultados visibles desde la primera sesión
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
            </div>
          ) : activeServices.length === 0 ? (
            <p className="text-center text-dark-300 py-12">
              No hay tratamientos disponibles en este momento.
            </p>
          ) : (
            <div
              className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {activeServices.map(service => {
                const hasRealImage =
                  service.imageURL &&
                  (service.imageURL.startsWith('http') || service.imageURL.startsWith('/'));

                const isEmoji =
                  service.imageURL &&
                  !service.imageURL.startsWith('http') &&
                  !service.imageURL.startsWith('/') &&
                  !service.imageURL.startsWith('data:');

                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ y: -4 }}
                    className="bg-dark-700 rounded-2xl border border-gold-500/20 cursor-pointer hover:border-gold-500/50 hover:shadow-gold transition-all overflow-hidden group"
                    onClick={() => setSelectedService(service)}
                  >
                    {/* Imagen de la card — visible mientras se scrollea */}
                    {hasRealImage ? (
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={service.imageURL}
                          alt={service.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Degradado para que el texto de abajo no choque con la imagen */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-700 via-dark-700/30 to-transparent" />
                        {/* Badges sobre la imagen */}
                        <div className="absolute top-3 left-3">
                          <span className="text-xs bg-black/60 backdrop-blur-sm text-gold-400 font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                            {service.brand
                              ? `${getServiceCategoryText(service.category)} · ${service.brand}`
                              : getServiceCategoryText(service.category)}
                          </span>
                        </div>
                        {service.hasPromotion && (
                          <div className="absolute top-3 right-3">
                            <span className="text-xs bg-gold-500/90 text-dark-900 font-bold px-2.5 py-1 rounded-full">
                              Promo
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Sin imagen real: fondo degradado con emoji o ícono genérico */
                      <div className="relative h-24 bg-gradient-to-br from-dark-600 to-dark-700 flex items-center justify-center overflow-hidden">
                        <span className="text-5xl opacity-60">
                          {isEmoji ? service.imageURL : '✨'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-700 to-transparent" />
                        {service.hasPromotion && (
                          <div className="absolute top-3 right-3">
                            <span className="text-xs bg-gold-500/90 text-dark-900 font-bold px-2.5 py-1 rounded-full">
                              Promo
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contenido textual */}
                    <div className="p-5">
                      {!hasRealImage && (
                        <span className="text-xs text-gold-400 font-semibold uppercase tracking-wide">
                          {service.brand
                            ? `${getServiceCategoryText(service.category)} · ${service.brand}`
                            : getServiceCategoryText(service.category)}
                        </span>
                      )}
                      <h3 className={`text-lg font-bold text-white leading-snug ${!hasRealImage ? 'mt-1' : ''}`}>
                        {service.name}
                      </h3>

                      <p className="text-sm text-dark-300 mt-2 mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-dark-300">
                          <Clock className="w-3.5 h-3.5 text-gold-500" />
                          {service.duration} min
                        </div>
                        <span className="text-xs text-gold-400 font-medium group-hover:text-gold-300 transition-colors">
                          Ver detalles →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selectedService && (
        <TreatmentDetailsModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}

/**
 * FeaturedServices Component
 * 
 * Muestra las 2 ofertas especiales:
 * 1. Limpieza facial profunda (2x1)
 * 2. Hidrolipoclasia (Promo apertura)
 * 
 * + Link para ver todos los servicios
 */

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, Tag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function FeaturedServices() {
  const { t } = useTranslation(['landing', 'common']);

  // Servicios destacados con promociones
  const featuredServices = [
    {
      id: 1,
      name: 'Limpieza Facial Profunda',
      nameEN: 'Deep Facial Cleansing',
      description: 'Tratamiento completo de limpieza y renovación facial',
      descriptionEN: 'Complete facial cleansing and renewal treatment',
      priceCRC: 35000,
      priceUSD: 69,
      duration: 60,
      sessions: 2,
      promo: {
        type: '2x1',
        badge: t('landing:services.twoForOne'),
      },
      emoji: '✨',
      gradient: 'from-primary-400/20 to-primary-500/20',
    },
    {
      id: 2,
      name: 'Hidrolipoclasia',
      nameEN: 'Hydrolipoclasia',
      description: 'Tratamiento avanzado para reducción de medidas',
      descriptionEN: 'Advanced treatment for body contouring',
      priceCRC: 100000,
      priceUSD: 196,
      duration: 90,
      sessions: 2,
      promo: {
        type: 'opening',
        badge: t('landing:services.opening'),
      },
      emoji: '💆',
      gradient: 'from-primary-500/20 to-primary-600/20',
    },
  ];

  const currentLang = t('common:language.es') === 'Español' ? 'es' : 'en';

  return (
    <section className="py-20 md:py-32 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="primary" className="mb-4">
              {t('landing:services.promo')}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t('landing:services.title')}
            </h2>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto">
              {t('landing:services.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Grid de servicios */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {featuredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className={`relative bg-gradient-to-br ${service.gradient} border border-primary-500/20 rounded-2xl p-8 hover:border-primary-500/40 transition-all duration-300 overflow-hidden`}>
                {/* Badge de promoción */}
                <div className="absolute top-4 right-4">
                  <Badge variant="danger" className="animate-pulse">
                    {service.promo.badge}
                  </Badge>
                </div>

                {/* Emoji grande */}
                <div className="text-6xl mb-6">{service.emoji}</div>

                {/* Nombre */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentLang === 'es' ? service.name : service.nameEN}
                </h3>

                {/* Descripción */}
                <p className="text-dark-300 mb-6">
                  {currentLang === 'es' ? service.description : service.descriptionEN}
                </p>

                {/* Info del servicio */}
                <div className="space-y-3 mb-6">
                  {/* Duración */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-dark-300">
                      <Clock className="h-4 w-4" />
                      {t('landing:services.duration')}
                    </div>
                    <span className="text-white font-medium">
                      {service.duration} {t('landing:services.minutes')}
                    </span>
                  </div>

                  {/* Sesiones */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-dark-300">
                      <Tag className="h-4 w-4" />
                      {service.sessions > 1 ? t('landing:services.sessions') : t('landing:services.session')}
                    </div>
                    <span className="text-white font-medium">
                      {service.sessions} {service.sessions > 1 ? t('landing:services.sessions') : t('landing:services.session')}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link to="/booking">
                  <Button
                    variant="primary"
                    className="w-full group-hover:bg-primary-600 transition-colors"
                  >
                    {t('landing:services.bookService')}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA para ver todos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link to="/services">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/10 group"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {t('landing:services.viewAll')}
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

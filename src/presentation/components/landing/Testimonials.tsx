/**
 * Testimonials Component
 * 
 * Muestra los 4 testimonios reales:
 * - María Rodríguez
 * - Marco Jiménez
 * - Juan Mora
 * - Andrea Vargas
 */

import { useTranslation } from 'react-i18next';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export function Testimonials() {
  const { t } = useTranslation('landing');

  const testimonials = [
    {
      id: 1,
      name: t('testimonials.testimonial1.name'),
      text: t('testimonials.testimonial1.text'),
      service: t('testimonials.testimonial1.service'),
      avatar: 'M',
      color: 'from-primary-400 to-primary-500',
    },
    {
      id: 2,
      name: t('testimonials.testimonial2.name'),
      text: t('testimonials.testimonial2.text'),
      service: t('testimonials.testimonial2.service'),
      avatar: 'M',
      color: 'from-primary-500 to-primary-600',
    },
    {
      id: 3,
      name: t('testimonials.testimonial3.name'),
      text: t('testimonials.testimonial3.text'),
      service: t('testimonials.testimonial3.service'),
      avatar: 'J',
      color: 'from-primary-400 to-primary-600',
    },
    {
      id: 4,
      name: t('testimonials.testimonial4.name'),
      text: t('testimonials.testimonial4.text'),
      service: t('testimonials.testimonial4.service'),
      avatar: 'A',
      color: 'from-primary-300 to-primary-500',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Grid de testimonios */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-dark-900/80 border border-dark-700 rounded-2xl p-8 hover:border-primary-500/30 transition-all duration-300">
                {/* Quote icon */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full p-4 shadow-xl shadow-primary-500/30">
                  <Quote className="h-6 w-6 text-dark-900" />
                </div>

                {/* Estrellas */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary-400 text-primary-400"
                    />
                  ))}
                </div>

                {/* Texto del testimonio */}
                <p className="text-dark-200 text-lg leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>

                {/* Autor */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-dark-900 font-bold text-lg shadow-lg`}>
                    {testimonial.avatar}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-dark-400">
                      {testimonial.service}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badge de confianza */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-6 py-3">
            <Star className="h-5 w-5 fill-primary-400 text-primary-400" />
            <span className="text-primary-300 font-medium">
              100% Testimonios Reales
            </span>
            <Star className="h-5 w-5 fill-primary-400 text-primary-400" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

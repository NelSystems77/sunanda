/**
 * Gallery Component
 * 
 * Galería de fotos del spa
 * - Placeholders de alta calidad (Unsplash)
 * - Grid responsive
 * - Preparado para reemplazar con Firebase Storage
 */

import { useTranslation } from 'react-i18next';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export function Gallery() {
  const { t } = useTranslation('landing');

  // Placeholders de alta calidad - Listos para reemplazar con Firebase Storage
  const images = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80',
      alt: t('gallery.altFacial'),
      category: 'facial',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      alt: t('gallery.altCorporal'),
      category: 'corporal',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
      alt: t('gallery.altProducts'),
      category: 'products',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
      alt: t('gallery.altAmbience'),
      category: 'ambience',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&q=80',
      alt: t('gallery.altReception'),
      category: 'reception',
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
      alt: t('gallery.altTreatment'),
      category: 'treatment',
    },
  ];

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
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-4">
              <Camera className="h-4 w-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">
                Gallery
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t('gallery.title')}
            </h2>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto">
              {t('gallery.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Grid de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              {/* Imagen */}
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay al hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-medium text-lg">
                    {image.alt}
                  </p>
                </div>
              </div>

              {/* Border glow al hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500/50 rounded-2xl transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Nota sobre Firebase Storage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-lg px-4 py-2">
            <Camera className="h-4 w-4 text-dark-400" />
            <span className="text-sm text-dark-400">
              {/* Nota técnica: Imágenes placeholder - Reemplazar con Firebase Storage */}
              Galería actualizada constantemente
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

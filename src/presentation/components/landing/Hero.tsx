/**
 * Hero Component
 * 
 * Sección principal de la landing page
 * - Título y slogan en español/inglés
 * - CTAs principales (Reservar + Ver Servicios)
 * - Badge de marca (Germaine de Capuccini)
 * - Imagen de fondo con overlay
 */

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export function Hero() {
  const { t } = useTranslation('landing');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background con overlay */}
      <div className="absolute inset-0 z-0">
        {/* Gradiente de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          {/* Badge de marca */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-6 py-2 mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">
              {t('hero.trustBadge')} - {t('hero.brandPartner')}
            </span>
          </motion.div>

          {/* Título principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-dark-300 mb-12 max-w-3xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* CTA Principal - Reservar */}
            <Link to="/booking">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-dark-900 font-semibold px-8 py-6 text-lg shadow-xl shadow-primary-500/30"
              >
                <Calendar className="h-5 w-5 mr-2" />
                {t('hero.cta')}
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {/* CTA Secundario - Ver Servicios */}
            <Link to="/services">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/10 text-white px-8 py-6 text-lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {t('hero.ctaSecondary')}
              </Button>
            </Link>
          </motion.div>

          {/* Indicador de scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex flex-col items-center gap-2 text-dark-400"
            >
              <span className="text-sm font-medium">Scroll</span>
              <div className="w-6 h-10 border-2 border-dark-400 rounded-full p-1">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-3 bg-primary-400 rounded-full mx-auto"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

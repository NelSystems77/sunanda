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
import { Sparkles, Clock, Tag, ArrowRight, MessageCircle, CheckCircle2, Zap } from 'lucide-react';
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
      description: 'Protocolo completo con aparatología, activos y mascarilla según tu condición de piel',
      descriptionEN: 'Full protocol with technology, actives and mask tailored to your skin condition',
      priceCRC: 20000,
      priceUSD: 39,
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

        {/* Tarjeta Premium: Glow Force */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-dark-900 to-orange-950/60 shadow-2xl shadow-amber-900/20">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-0">
              {/* Columna imagen */}
              <div className="relative h-64 md:h-auto min-h-[300px] bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center overflow-hidden">
                <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10" />
                <div className="absolute -bottom-12 -left-6 w-56 h-56 rounded-full bg-white/10" />
                <img
                  src="/assets/images/landing/timexpert-radiance.jpg"
                  alt="Glow Force Timexpert Radiance C+"
                  className="relative z-10 h-full w-full object-contain p-8 drop-shadow-2xl"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                {/* Badge HLG */}
                <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
                  <p className="text-xs font-bold text-gray-900 tracking-widest">HLG</p>
                  <p className="text-[10px] text-gray-500">Patented</p>
                </div>
                {/* Badge Premium */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-dark-900 text-xs font-bold rounded-full shadow-lg">
                    <Zap className="w-3 h-3" />
                    SUPER PREMIUM
                  </span>
                </div>
              </div>

              {/* Columna contenido */}
              <div className="p-8 md:p-10 flex flex-col justify-center gap-5">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-2">
                    GERMAINE DE CAPUCCINI · TIMEXPERT RADIANCE C+
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                    Glow Force<br />
                    <span className="text-amber-400">Máscara Iluminadora</span>
                  </h3>
                  <p className="text-dark-300 text-sm leading-relaxed">
                    Piel perfecta en tiempo récord. En solo <strong className="text-amber-400">15 minutos</strong> una piel más luminosa, firme, tonificada y radiante. Ideal para ocasiones especiales o refuerzo semanal de juventud y energía.
                  </p>
                </div>

                {/* Incluidos */}
                <div className="grid grid-cols-2 gap-2">
                  {['Vitamina C Pura', 'Anti-fatiga', 'Anti-manchas', 'Efecto luminoso', 'Firmeza y tono', 'Energía celular'].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-amber-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Info sesión + precio */}
                <div className="flex items-center gap-4 py-3 border-t border-amber-700/30">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-400">15</p>
                    <p className="text-xs text-dark-400">minutos</p>
                  </div>
                  <div className="w-px h-10 bg-amber-700/30" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-400">1</p>
                    <p className="text-xs text-dark-400">sesión</p>
                  </div>
                  <div className="w-px h-10 bg-amber-700/30" />
                  <div>
                    <p className="text-2xl font-bold text-white">₡55.000</p>
                    <p className="text-xs text-dark-400">por sesión</p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/50688083390?text=Hola!%20Me%20interesa%20el%20tratamiento%20Glow%20Force%20M%C3%A1scara%20Iluminadora%20Timexpert%20Radiance%20C%2B.%20%C2%BFPodr%C3%ADan%20darme%20m%C3%A1s%20informaci%C3%B3n%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-dark-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Consultar por WhatsApp
                  </a>
                  <Link
                    to="/booking"
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-amber-500/40 hover:border-amber-500 hover:bg-amber-500/10 text-amber-300 font-semibold rounded-xl transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Agendar cita
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tarjeta Premium: Hydraluronic */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-12"
        >
          <div className="relative rounded-3xl overflow-hidden border border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-dark-900 to-blue-950/60 shadow-2xl shadow-sky-900/20">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-0">
              {/* Columna imagen */}
              <div className="relative h-64 md:h-auto min-h-[300px] bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center overflow-hidden">
                <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10" />
                <div className="absolute -bottom-12 -left-6 w-56 h-56 rounded-full bg-white/10" />
                <img
                  src="/assets/images/landing/timexpert-hydraluronic.png"
                  alt="Hydraluronic Timexpert Extra-Hidratante"
                  className="relative z-10 h-full w-full object-contain p-8 drop-shadow-2xl"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                {/* Badge HLG */}
                <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
                  <p className="text-xs font-bold text-gray-900 tracking-widest">HLG</p>
                  <p className="text-[10px] text-gray-500">Patented</p>
                </div>
                {/* Badge Premium */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-400 text-dark-900 text-xs font-bold rounded-full shadow-lg">
                    <Zap className="w-3 h-3" />
                    SUPER PREMIUM
                  </span>
                </div>
              </div>

              {/* Columna contenido */}
              <div className="p-8 md:p-10 flex flex-col justify-center gap-5">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-sky-400 mb-2">
                    GERMAINE DE CAPUCCINI · TIMEXPERT HYDRALURONIC
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                    Hydraluronic<br />
                    <span className="text-sky-400">Máscara Extra-Hidratante</span>
                  </h3>
                  <p className="text-dark-300 text-sm leading-relaxed">
                    Hidratación suprema en <strong className="text-sky-400">15 minutos</strong>. Textura rica y cremosa que se transforma en aceite nutritivo. Con Ácido Hialurónico triple peso molecular y nanopolímero HLG patentado, la piel queda jugosa, radiante y profundamente reconfortada.
                  </p>
                </div>

                {/* Incluidos */}
                <div className="grid grid-cols-2 gap-2">
                  {['HA Triple Peso Molecular', 'HLG Patented', 'Piel jugosa y radiante', 'Recupera el volumen', 'Alisa y reconforta', 'Alivio inmediato'].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-sky-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Info sesión + precio */}
                <div className="flex items-center gap-4 py-3 border-t border-sky-700/30">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-sky-400">15</p>
                    <p className="text-xs text-dark-400">minutos</p>
                  </div>
                  <div className="w-px h-10 bg-sky-700/30" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-sky-400">1</p>
                    <p className="text-xs text-dark-400">sesión</p>
                  </div>
                  <div className="w-px h-10 bg-sky-700/30" />
                  <div>
                    <p className="text-2xl font-bold text-white">₡55.000</p>
                    <p className="text-xs text-dark-400">por sesión</p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/50688083390?text=Hola!%20Me%20interesa%20la%20Hydraluronic%20M%C3%A1scara%20Extra-Hidratante%20Timexpert.%20%C2%BFPodr%C3%ADan%20darme%20m%C3%A1s%20informaci%C3%B3n%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-dark-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-sky-500/25 hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Consultar por WhatsApp
                  </a>
                  <Link
                    to="/booking"
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-sky-500/40 hover:border-sky-500 hover:bg-sky-500/10 text-sky-300 font-semibold rounded-xl transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Agendar cita
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tarjeta Premium: Expert Lab Peeling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-12"
        >
          <div className="relative rounded-3xl overflow-hidden border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-dark-900 to-green-950/60 shadow-2xl shadow-emerald-900/20">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-green-500/10 blur-3xl" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-0">
              {/* Columna imagen */}
              <div className="relative h-64 md:h-auto min-h-[300px] bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center overflow-hidden">
                <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10" />
                <div className="absolute -bottom-12 -left-6 w-56 h-56 rounded-full bg-white/10" />
                <img
                  src="/assets/images/landing/expert-lab-flash-peel.jpg"
                  alt="Expert Lab Flash Peel Germaine de Capuccini"
                  className="relative z-10 h-full w-full object-contain p-8 drop-shadow-2xl"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                {/* Badge Expert Lab */}
                <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
                  <p className="text-xs font-bold text-gray-900 tracking-widest">EXPERT</p>
                  <p className="text-[10px] text-gray-500">Lab</p>
                </div>
                {/* Badge Premium */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400 text-dark-900 text-xs font-bold rounded-full shadow-lg">
                    <Zap className="w-3 h-3" />
                    SUPER PREMIUM
                  </span>
                </div>
              </div>

              {/* Columna contenido */}
              <div className="p-8 md:p-10 flex flex-col justify-center gap-5">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-2">
                    GERMAINE DE CAPUCCINI · EXPERT LAB
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                    Peeling Químico<br />
                    <span className="text-emerald-400">Profesional Expert Lab</span>
                  </h3>
                  <p className="text-dark-300 text-sm leading-relaxed">
                    Peeling de <strong className="text-emerald-400">alta gama</strong> con químicos de uso profesional diseñados para mejorar la calidad y regeneración de la piel. Tres fórmulas especializadas según tu necesidad.
                  </p>
                </div>

                {/* 3 variantes */}
                <div className="space-y-2.5">
                  {[
                    { label: 'Equilibrante', desc: 'Pieles grasas o con tendencia al acné · Equilibra sebo · Antiacné' },
                    { label: 'Antiedad', desc: 'Estimula colágeno · Mejora firmeza y elasticidad · Reduce arrugas' },
                    { label: 'Flash', desc: 'Luminosidad e hidratación inmediatas · Efecto brillo instantáneo' },
                  ].map((v) => (
                    <div key={v.label} className="flex items-start gap-3">
                      <span className="mt-0.5 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold rounded uppercase flex-shrink-0">
                        {v.label}
                      </span>
                      <p className="text-xs text-dark-400 leading-relaxed">{v.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Info sesión + precio */}
                <div className="flex items-center gap-4 py-3 border-t border-emerald-700/30">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">30</p>
                    <p className="text-xs text-dark-400">minutos</p>
                  </div>
                  <div className="w-px h-10 bg-emerald-700/30" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">1</p>
                    <p className="text-xs text-dark-400">sesión</p>
                  </div>
                  <div className="w-px h-10 bg-emerald-700/30" />
                  <div>
                    <p className="text-2xl font-bold text-white">₡55.000</p>
                    <p className="text-xs text-dark-400">por sesión</p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/50688083390?text=Hola!%20Me%20interesa%20el%20Expert%20Lab%20Peeling%20Qu%C3%ADmico%20de%20Germaine%20de%20Capuccini.%20%C2%BFPodr%C3%ADan%20darme%20m%C3%A1s%20informaci%C3%B3n%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-dark-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Consultar por WhatsApp
                  </a>
                  <Link
                    to="/booking"
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-emerald-500/40 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-300 font-semibold rounded-xl transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Agendar cita
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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

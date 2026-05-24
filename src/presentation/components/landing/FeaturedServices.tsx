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
import { Sparkles, ArrowRight, MessageCircle, CheckCircle2, Zap, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function FeaturedServices() {
  const { t } = useTranslation(['landing', 'common']);


  return (
    <section className="py-20 md:py-32 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="danger" className="mb-4 animate-pulse">
              <Flame className="w-3.5 h-3.5 mr-1.5 inline" />
              OFERTAS ESPECIALES · SOLO POR APERTURA
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Aprovecha Nuestras<br />
              <span className="text-rose-400">Promos de Apertura</span>
            </h2>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto">
              Precios exclusivos disponibles solo durante nuestra apertura. Espacios limitados — ¡no dejes pasar esta oportunidad!
            </p>
          </motion.div>
        </div>

        {/* Banner de urgencia */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-orange-500/50 bg-gradient-to-r from-red-950 via-orange-950 to-red-950 py-3 px-6">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/5 to-orange-500/10 animate-pulse pointer-events-none" />
            <div className="relative flex items-center justify-center gap-3 flex-wrap">
              <Flame className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <p className="text-sm font-bold tracking-[0.18em] uppercase text-orange-300 text-center">
                Precios exclusivos de apertura — aprovechá antes de que terminen
              </p>
              <Flame className="w-5 h-5 text-orange-400 flex-shrink-0" />
            </div>
          </div>
        </motion.div>

        {/* PROMO 1: Limpieza Facial Profunda */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <div className="relative rounded-3xl overflow-hidden border-2 border-rose-500/60 bg-gradient-to-br from-rose-950/90 via-dark-900 to-pink-950/70 shadow-2xl shadow-rose-900/30">
            {/* Ribbon de apertura */}
            <div className="relative overflow-hidden bg-gradient-to-r from-rose-700 via-pink-500 to-rose-700 py-3 px-6 flex items-center justify-center gap-3">
              <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
              <Flame className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-white font-black text-xs sm:text-sm tracking-[0.2em] uppercase">
                PRECIO ESPECIAL DE APERTURA — TIEMPO LIMITADO
              </span>
              <Flame className="w-4 h-4 text-white flex-shrink-0" />
            </div>

            {/* Fondo decorativo */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-pink-500/10 blur-3xl" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-0">
              {/* Imagen */}
              <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] bg-gradient-to-br from-rose-800 to-pink-900 overflow-hidden">
                <img
                  src="/assets/images/landing/limpieza-facial.JPG"
                  alt="Limpieza Facial Profunda"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                  <p className="text-sm font-black text-rose-600">3 sesiones</p>
                  <p className="text-xs text-gray-500 font-medium">90 min c/u</p>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-center gap-4">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-rose-400 mb-2">
                    FACIAL · PROTOCOLO COMPLETO 10 PASOS
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
                    Limpieza Facial <span className="text-rose-400">Profunda</span>
                  </h3>
                  <p className="text-dark-300 text-xs sm:text-sm leading-relaxed">
                    Protocolo de 10 pasos con aparatología, activos y mascarilla adaptados a tu piel. <strong className="text-rose-300">3 sesiones × 90 min</strong> a precio único de apertura.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {['Desmaquillado', 'Exfoliación', 'Aparatología', 'Activos a medida', 'Mascarilla', 'Bloqueador solar'].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-rose-200">
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Bloque precio */}
                <div className="bg-rose-950/70 border border-rose-500/40 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="text-[10px] text-dark-400 mb-0.5">Precio normal</p>
                      <p className="text-base sm:text-lg font-bold text-dark-400 line-through decoration-rose-400">₡60.000</p>
                      <p className="text-[10px] text-dark-500">3 × ₡20.000</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] sm:text-[11px] text-rose-300 font-bold tracking-wide">PRECIO APERTURA</p>
                      <p className="text-3xl sm:text-4xl font-black text-white leading-none">₡35.000</p>
                      <p className="text-[10px] sm:text-xs text-rose-400 mt-0.5">pack 3 sesiones</p>
                    </div>
                  </div>
                  <div className="bg-rose-500/20 border border-rose-500/50 rounded-xl px-3 py-2 flex items-center gap-2">
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-300 flex-shrink-0" />
                    <p className="text-[11px] sm:text-xs text-rose-200 font-bold">Ahorrás ₡25.000 · Solo mientras dure la apertura</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <a
                    href="https://wa.me/50688083390?text=Hola!%20Me%20interesa%20la%20promo%20de%20apertura%20de%20Limpieza%20Facial%20Profunda%3A%203%20sesiones%20por%20%E2%82%A135.000.%20%C2%BFPodr%C3%ADan%20darme%20m%C3%A1s%20informaci%C3%B3n%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Quiero esta promo
                  </a>
                  <Link
                    to="/booking"
                    className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 border border-rose-500/40 hover:border-rose-500 hover:bg-rose-500/10 text-rose-300 font-semibold rounded-xl transition-all text-sm sm:text-base"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Agendar cita
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PROMO 2: Hidrolipoclasia */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative rounded-3xl overflow-hidden border-2 border-violet-500/60 bg-gradient-to-br from-violet-950/90 via-dark-900 to-purple-950/70 shadow-2xl shadow-violet-900/30">
            {/* Ribbon de apertura */}
            <div className="relative overflow-hidden bg-gradient-to-r from-violet-700 via-purple-500 to-violet-700 py-3 px-6 flex items-center justify-center gap-3">
              <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
              <Flame className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-white font-black text-xs sm:text-sm tracking-[0.2em] uppercase">
                PRECIO ESPECIAL DE APERTURA — TIEMPO LIMITADO
              </span>
              <Flame className="w-4 h-4 text-white flex-shrink-0" />
            </div>

            {/* Fondo decorativo */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-violet-500/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-0">
              {/* Imagen — derecha en desktop */}
              <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] bg-gradient-to-br from-violet-800 to-purple-900 overflow-hidden lg:order-2">
                <img
                  src="/assets/images/landing/hidrolipoclasia.JPG"
                  alt="Hidrolipoclasia"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                  <p className="text-sm font-black text-violet-600">4 sesiones</p>
                  <p className="text-xs text-gray-500 font-medium">90 min c/u</p>
                </div>
              </div>

              {/* Contenido — izquierda en desktop */}
              <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-center gap-4 lg:order-1">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-violet-400 mb-2">
                    CORPORAL · REDUCCIÓN DE MEDIDAS
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
                    Hidrolipoclasia <span className="text-violet-400">Tratamiento Corporal</span>
                  </h3>
                  <p className="text-dark-300 text-xs sm:text-sm leading-relaxed">
                    Tratamiento avanzado no invasivo para reducción de medidas y contorno corporal. <strong className="text-violet-300">4 sesiones × 90 min</strong> a precio único de apertura.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {['Cavitación', 'Exfoliación', 'Activos', 'Masaje reductor', 'Envoltura', 'Sellante'].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-violet-200">
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Bloque precio */}
                <div className="bg-violet-950/70 border border-violet-500/40 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="text-[10px] text-dark-400 mb-0.5">Precio normal</p>
                      <p className="text-base sm:text-lg font-bold text-dark-400 line-through decoration-violet-400">₡170.000</p>
                      <p className="text-[10px] text-dark-500">pack 4 sesiones</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] sm:text-[11px] text-violet-300 font-bold tracking-wide">PRECIO APERTURA</p>
                      <p className="text-3xl sm:text-4xl font-black text-white leading-none">₡130.000</p>
                      <p className="text-[10px] sm:text-xs text-violet-400 mt-0.5">pack 4 sesiones</p>
                    </div>
                  </div>
                  <div className="bg-violet-500/20 border border-violet-500/50 rounded-xl px-3 py-2 flex items-center gap-2">
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-300 flex-shrink-0" />
                    <p className="text-[11px] sm:text-xs text-violet-200 font-bold">Ahorrás ₡40.000 · Solo mientras dure la apertura</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <a
                    href="https://wa.me/50688083390?text=Hola!%20Me%20interesa%20la%20promo%20de%20apertura%20de%20Hidrolipoclasia%3A%204%20sesiones%20por%20%E2%82%A1130.000.%20%C2%BFPodr%C3%ADan%20darme%20m%C3%A1s%20informaci%C3%B3n%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Quiero esta promo
                  </a>
                  <Link
                    to="/booking"
                    className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 border border-violet-500/40 hover:border-violet-500 hover:bg-violet-500/10 text-violet-300 font-semibold rounded-xl transition-all text-sm sm:text-base"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Agendar cita
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Divisor: Colección Exclusiva */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-14"
        >
          <div className="relative flex items-center gap-6 py-4">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
            <div className="flex items-center gap-3 text-gold-400 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold tracking-[0.25em] text-xs uppercase">
                Colección Exclusiva · Germaine de Capuccini
              </span>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          </div>
          <div className="text-center mt-6">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Tratamientos <span className="text-gold-400">Super Premium</span>
            </h3>
            <p className="text-dark-300 max-w-2xl mx-auto text-sm leading-relaxed">
              Tecnología de vanguardia Germaine de Capuccini disponible en Costa Rica. Resultados visibles desde la primera sesión, con ingredientes activos exclusivos y protocolo profesional certificado.
            </p>
          </div>
        </motion.div>

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
              <div className="relative h-72 md:h-auto min-h-[420px] bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center overflow-hidden">
                <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-12 -left-6 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
                <img
                  src="/assets/images/landing/085c4b59-3ff1-497d-9722-602c99f96a9d.JPG"
                  alt="Glow Force Timexpert Radiance C+"
                  className="relative z-10 h-full w-full object-contain p-4 drop-shadow-2xl scale-105 hover:scale-110 transition-transform duration-500"
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
                    Piel perfecta en tiempo récord. En <strong className="text-amber-400">90 minutos</strong> una piel más luminosa, firme, tonificada y radiante. Ideal para ocasiones especiales o refuerzo semanal de juventud y energía.
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
                    <p className="text-2xl font-bold text-amber-400">90</p>
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
              {/* Columna imagen — orden inverso en desktop */}
              <div className="relative h-72 md:h-auto min-h-[420px] bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center overflow-hidden md:order-2">
                <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-12 -left-6 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
                <img
                  src="/assets/images/landing/56df7558-dc4a-4411-b45b-b95b993a8a01.JPG"
                  alt="Hydraluronic Timexpert Extra-Hidratante"
                  className="relative z-10 h-full w-full object-contain p-4 drop-shadow-2xl scale-105 hover:scale-110 transition-transform duration-500"
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

              {/* Columna contenido — orden inverso en desktop */}
              <div className="p-8 md:p-10 flex flex-col justify-center gap-5 md:order-1">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-sky-400 mb-2">
                    GERMAINE DE CAPUCCINI · TIMEXPERT HYDRALURONIC
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                    Hydraluronic<br />
                    <span className="text-sky-400">Máscara Extra-Hidratante</span>
                  </h3>
                  <p className="text-dark-300 text-sm leading-relaxed">
                    Hidratación suprema en <strong className="text-sky-400">90 minutos</strong>. Textura rica y cremosa que se transforma en aceite nutritivo. Con Ácido Hialurónico triple peso molecular y nanopolímero HLG patentado, la piel queda jugosa, radiante y profundamente reconfortada.
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
                    <p className="text-2xl font-bold text-sky-400">90</p>
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
              <div className="relative h-72 md:h-auto min-h-[420px] bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center overflow-hidden">
                <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-12 -left-6 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
                <img
                  src="/assets/images/landing/expert-lab-flash-peel.jpg"
                  alt="Expert Lab Flash Peel Germaine de Capuccini"
                  className="relative z-10 h-full w-full object-contain p-4 drop-shadow-2xl scale-105 hover:scale-110 transition-transform duration-500"
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
                    <p className="text-2xl font-bold text-emerald-400">90</p>
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

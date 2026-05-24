import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, CheckCircle2, Zap } from 'lucide-react';

interface Case {
  id: string;
  title: string;
  service: string;
  description: string;
  beforeImg?: string;
  afterImg?: string;
  price?: string;
  sessions?: number;
  highlights?: string[];
  waMessage?: string;
}

const CASES: Case[] = [
  {
    id: '1',
    title: 'Tratamiento WowShape',
    service: 'Remodelación Corporal',
    description: 'Reduce volumen, redefine tu silueta y mejora la piel de naranja en solo 5 sesiones. Resultados reales, visibles desde la primera sesión.',
    beforeImg: '/assets/images/landing/antes-wowshape.jpg',
    afterImg: '/assets/images/landing/despues-wowshape.jpg',
    price: '₡180.000',
    sessions: 5,
    highlights: ['Aparatología Cavitación', 'Exfoliación', 'Activo', 'Masaje', 'Sellante', 'Envoltura'],
    waMessage: 'Hola!%20Me%20interesa%20el%20Tratamiento%20WowShape%20(5%20sesiones).%20%C2%BFPodr%C3%ADan%20darme%20m%C3%A1s%20informaci%C3%B3n%3F',
  },
  {
    id: '2',
    title: 'Limpieza Profunda',
    service: 'Purificación',
    description: 'Piel libre de impurezas y con luminosidad renovada tras el tratamiento.',
  },
  {
    id: '3',
    title: 'Hydracure Facial',
    service: 'Hidratación',
    description: 'Hidratación profunda que transforma la textura de la piel.',
  },
];

function SliderComparison({
  label,
  beforeImg,
  afterImg,
}: {
  label: string;
  beforeImg?: string;
  afterImg?: string;
}) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  const onMouseDown = () => { dragging.current = true; };
  const onMouseUp = () => { dragging.current = false; };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePos(e.clientX); };
  const onTouchStart = () => { dragging.current = true; };
  const onTouchEnd = () => { dragging.current = false; };
  const onTouchMove = (e: React.TouchEvent) => { if (dragging.current) updatePos(e.touches[0].clientX); };

  const hasImages = Boolean(beforeImg && afterImg);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      {/* DESPUÉS */}
      {hasImages ? (
        <img
          src={afterImg}
          alt="Después"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gold-900/40 via-dark-800 to-dark-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gold-500/30 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <p className="text-gold-400 font-bold text-lg">Después</p>
            <p className="text-dark-400 text-sm mt-1">{label}</p>
          </div>
        </div>
      )}

      {/* Label DESPUÉS */}
      <div className="absolute top-3 right-4 z-10 px-3 py-1 bg-gold-500 rounded-full text-xs font-bold text-dark-900 shadow">
        DESPUÉS
      </div>

      {/* ANTES (clip izquierdo) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {hasImages ? (
          <img
            src={beforeImg}
            alt="Antes"
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-dark-600/60 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">💆</span>
              </div>
              <p className="text-dark-300 font-bold text-lg">Antes</p>
              <p className="text-dark-500 text-sm mt-1">{label}</p>
            </div>
          </div>
        )}
      </div>

      {/* Label ANTES */}
      <div className="absolute top-3 left-4 z-10 px-3 py-1 bg-dark-900/80 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow">
        ANTES
      </div>

      {/* Línea divisoria */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-20"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gold-400">
          <ChevronLeft className="w-3 h-3 text-dark-900 absolute left-1" />
          <ChevronRight className="w-3 h-3 text-dark-900 absolute right-1" />
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white bg-dark-900/70 backdrop-blur-sm px-3 py-1 rounded-full pointer-events-none z-10">
        Arrastrá para comparar
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const [active, setActive] = useState(0);
  const c = CASES[active];

  return (
    <section className="py-20 bg-dark-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-gold-400 text-sm font-semibold tracking-widest uppercase mb-3">Resultados</p>
          <h2 className="text-4xl font-bold text-white mb-4">Transformaciones Reales</h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Resultados visibles con tratamientos personalizados. Arrastrá el slider para ver la diferencia.
          </p>
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <SliderComparison
            label={c.service}
            beforeImg={c.beforeImg}
            afterImg={c.afterImg}
          />

          {/* Info del tratamiento */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-white">{c.title}</h3>
            <p className="text-dark-400 text-sm mt-1 max-w-xl mx-auto">{c.description}</p>
          </div>

          {/* Detalles WowShape */}
          {c.highlights && (
            <div className="mt-6 bg-dark-800 border border-dark-700 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Sesiones */}
                {c.sessions && (
                  <>
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gold-400">{c.sessions}</p>
                        <p className="text-xs text-dark-400 mt-0.5">sesiones</p>
                      </div>
                    </div>
                    {/* Separador */}
                    <div className="hidden sm:block w-px self-stretch bg-dark-700" />
                  </>
                )}

                {/* Highlights */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 flex-1">
                  {c.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-900/30 border border-gold-700/40 rounded-full text-xs text-gold-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              {c.waMessage && (
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <a
                    href={`https://wa.me/50688083390?text=${c.waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Consultar por WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Tabs de casos */}
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          {CASES.map((cs, i) => (
            <button
              key={cs.id}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                i === active
                  ? 'bg-gold-500 text-dark-900'
                  : 'bg-dark-800 text-dark-400 hover:bg-dark-700 border border-dark-700'
              }`}
            >
              {cs.price && <Zap className="w-3.5 h-3.5" />}
              {cs.service}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

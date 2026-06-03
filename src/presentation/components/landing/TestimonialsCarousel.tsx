import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  service: string;
  rating: number;
  text: string;
  date: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'María González',
    service: 'Tratamiento Facial Timexpert',
    rating: 5,
    text: 'Increíble experiencia. Mi piel luce renovada y el servicio fue impecable. La Lic. Grettel es una profesional excepcional.',
    date: 'Abril 2026',
  },
  {
    id: '2',
    name: 'Ana Rodríguez',
    service: 'Masaje Relajante',
    rating: 5,
    text: 'El mejor spa de San José. Ambiente tranquilo, productos de primera calidad y una atención personalizada que no encuentras en ningún otro lugar.',
    date: 'Marzo 2026',
  },
  {
    id: '3',
    name: 'Laura Fernández',
    service: 'Limpieza Profunda',
    rating: 5,
    text: 'Profesionalismo y calidez humana. Los resultados son visibles desde la primera sesión. Ya agendé mi próxima cita.',
    date: 'Febrero 2026',
  },
  {
    id: '4',
    name: 'Carolina Vargas',
    service: 'Hydracure Facial',
    rating: 5,
    text: 'Me encanta la atención personalizada. Grettel estudia tu piel y recomienda exactamente lo que necesitas. 100% recomendado.',
    date: 'Diciembre 2025',
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const go = (dir: 1 | -1) => {
    setAutoplay(false);
    setCurrent(prev => (prev + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const t = TESTIMONIALS[current];

  return (
    <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-gold-400 text-sm font-semibold tracking-widest uppercase mb-3">Testimonios</p>
          <h2 className="text-4xl font-bold text-white mb-4">Lo Que Dicen Nuestras Clientas</h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Nuestros primeros 5 clientes satisfechos ya confían en SUNANDA para su cuidado personal
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-dark-800 rounded-2xl border border-dark-700 p-8 md:p-12"
            >
              <Quote className="w-10 h-10 text-gold-500 mb-6 opacity-80" />

              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                ))}
              </div>

              <p className="text-xl text-white leading-relaxed mb-8">"{t.text}"</p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-dark-900">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-dark-400">{t.service}</p>
                  <p className="text-xs text-dark-500 mt-0.5">{t.date}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controles */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => go(-1)}
              className="p-3 bg-dark-700 hover:bg-dark-600 rounded-full transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex gap-2 items-center">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setAutoplay(false); setCurrent(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-gold-500 w-8' : 'bg-dark-600 hover:bg-dark-500 w-2'
                  }`}
                  aria-label={`Testimonio ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="p-3 bg-dark-700 hover:bg-dark-600 rounded-full transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

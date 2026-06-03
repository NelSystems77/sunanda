import { Award, Star, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const STATS = [
  { icon: Users, value: '5', label: 'Clientes satisfechos' },
  { icon: Star, value: '5⭐', label: 'Calificación' },
  { icon: Calendar, value: '10+', label: 'Años de experiencia' },
  { icon: Award, value: '21+', label: 'Tratamientos especializados' },
];

const BADGES = [
  { text: 'Germaine de Capuccini', sub: 'Distribuidora oficial' },
  { text: 'Colegio de Enfermeras', sub: 'Colegiada' },
  { text: 'IFPA', sub: 'Certificación internacional' },
  { text: 'Cruelty Free', sub: 'Productos éticos' },
];

export function SocialProof() {
  return (
    <section className="py-16 bg-dark-800 border-y border-dark-700">
      <div className="container mx-auto px-4">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14" data-aos="fade-up">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="w-12 h-12 bg-gold-500/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-gold-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{value}</p>
              <p className="text-sm text-dark-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-dark-700 mb-12" />

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6" data-aos="fade-up" data-aos-delay="100">
          {BADGES.map(({ text, sub }) => (
            <motion.div
              key={text}
              whileHover={{ y: -2 }}
              className="flex flex-col items-center gap-1 px-6 py-4 bg-dark-900 rounded-xl border border-dark-700"
            >
              <div className="w-8 h-8 bg-gold-500/20 rounded-full flex items-center justify-center mb-1">
                <Award className="w-4 h-4 text-gold-400" />
              </div>
              <span className="text-sm font-semibold text-white text-center">{text}</span>
              <span className="text-xs text-dark-500 text-center">{sub}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

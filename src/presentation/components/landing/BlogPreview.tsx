import { ArrowRight, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  date: string;
  emoji: string;
}

const POSTS: Post[] = [
  {
    id: '1',
    title: '5 hábitos diarios para una piel radiante todo el año',
    excerpt: 'Los pequeños rituales de cuidado que marcan la diferencia. Desde la hidratación correcta hasta la protección solar diaria.',
    category: 'Cuidado de Piel',
    author: 'Lic. Grettel',
    readTime: '4 min',
    date: 'Abril 2026',
    emoji: '✨',
  },
  {
    id: '2',
    title: 'Qué esperar de tu primera visita al spa',
    excerpt: 'Guía completa para aprovechar al máximo tu primera experiencia en SUNANDA. Qué llevar, qué preguntar y cómo prepararte.',
    category: 'Guías',
    author: 'Lic. Grettel',
    readTime: '3 min',
    date: 'Marzo 2026',
    emoji: '🌸',
  },
  {
    id: '3',
    title: 'Germaine de Capuccini: la ciencia detrás de los resultados',
    excerpt: 'Descubrí por qué elegimos exclusivamente productos Germaine de Capuccini y qué los hace diferentes al resto del mercado.',
    category: 'Productos',
    author: 'Lic. Grettel',
    readTime: '5 min',
    date: 'Febrero 2026',
    emoji: '💎',
  },
];

export function BlogPreview() {
  return (
    <section className="py-20 bg-dark-900">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12" data-aos="fade-up">
          <div>
            <p className="text-gold-400 text-sm font-semibold tracking-widest uppercase mb-3">Blog</p>
            <h2 className="text-4xl font-bold text-white">Consejos de Belleza</h2>
          </div>
          <a
            href="/blog"
            className="hidden sm:flex items-center gap-1 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="100">
          {POSTS.map((post) => (
            <motion.article
              key={post.id}
              whileHover={{ y: -4 }}
              className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden cursor-pointer hover:border-gold-500/40 transition-all"
            >
              {/* Imagen placeholder */}
              <div className="h-44 bg-gradient-to-br from-dark-700 to-dark-900 flex items-center justify-center relative">
                <span className="text-5xl">{post.emoji}</span>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-gold-500/20 text-gold-400 text-xs font-semibold rounded-full border border-gold-500/30">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-white mb-2 leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-dark-400 mb-4 line-clamp-2">{post.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-dark-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <span>{post.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden" data-aos="fade-up">
          <a
            href="/blog"
            className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 text-sm font-medium"
          >
            Ver todos los artículos
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

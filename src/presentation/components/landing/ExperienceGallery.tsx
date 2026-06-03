import { Star, Users, Award, TrendingUp } from 'lucide-react';

export const ExperienceGallery = () => {
  const stats = [
    {
      icon: Star,
      value: '100%',
      label: 'Satisfacción'
    },
    {
      icon: Users,
      value: '5',
      label: 'Clientes Felices'
    },
    {
      icon: Award,
      value: '5⭐',
      label: 'Calificación'
    }
  ];

  // Placeholders de alta calidad - Listos para reemplazar con fotos reales
  const experiences = [
    {
      image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80',
      title: 'Tratamientos Faciales',
      description: 'Innovación y resultados'
    },
    {
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      title: 'Masajes Corporales',
      description: 'Relajación profunda'
    },
    {
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
      title: 'Productos Premium',
      description: 'Germaine de Capuccini'
    },
    {
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
      title: 'Ambiente Exclusivo',
      description: 'Tu espacio de paz'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-dark-900">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Experiencias</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Vive la Experiencia{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                SUNANDA
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Un viaje sensorial hacia tu mejor versión
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16" data-aos="fade-up" data-aos-delay="100">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className="p-6 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl border border-purple-100 dark:border-purple-900/30 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {experiences.map((exp, idx) => (
              <div 
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={exp.image} 
                    alt={exp.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-gray-200 text-sm md:text-base">
                    {exp.description}
                  </p>
                </div>
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="max-w-4xl mx-auto" data-aos="fade-up">
            <div className="relative p-10 md:p-12 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20 rounded-3xl border border-purple-100 dark:border-purple-900/30 shadow-xl overflow-hidden">
              {/* Decorative Quote */}
              <div className="absolute top-6 left-6 text-8xl text-purple-200 dark:text-purple-900/30 font-serif leading-none">"</div>
              
              <div className="relative z-10">
                <blockquote className="text-xl md:text-2xl font-serif italic text-gray-900 dark:text-white text-center leading-relaxed mb-6">
                  Más que un tratamiento, una transformación. Cada visita a SUNANDA es una experiencia única diseñada para renovar no solo tu piel, sino también tu espíritu.
                </blockquote>
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    — Filosofía SUNANDA
                  </p>
                  <div className="flex justify-center gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-gold fill-gold" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

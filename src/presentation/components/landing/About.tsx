import { Award, Users, Heart, Sparkles, Shield, Clock } from 'lucide-react';

export const About = () => {
  const features = [
    {
      icon: Award,
      title: 'Profesionales Certificados',
      description: 'Equipo con certificaciones internacionales y experiencia comprobada'
    },
    {
      icon: Sparkles,
      title: 'Productos Premium',
      description: 'Germaine de Capuccini y las mejores marcas del mercado'
    },
    {
      icon: Users,
      title: 'Atención Personalizada',
      description: 'Cada tratamiento diseñado específicamente para ti'
    },
    {
      icon: Heart,
      title: 'Ambiente Relajante',
      description: 'Espacios diseñados para tu comodidad y bienestar'
    },
    {
      icon: Shield,
      title: 'Protocolos de Calidad',
      description: 'Estándares internacionales en higiene y seguridad'
    },
    {
      icon: Clock,
      title: 'Horarios Flexibles',
      description: 'Disponibilidad 7 días a la semana de 9 AM a 9 PM'
    }
  ];

  const stats = [
    { value: '95%', label: 'Satisfacción' },
    { value: '500+', label: 'Clientas Felices' },
    { value: '5⭐', label: 'Calificación' },
    { value: '10+', label: 'Años de Experiencia' }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              <span>Nuestra Esencia</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              ¿Por qué elegir{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-600">
                SUNANDA?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Somos un centro de estética dedicado a ofrecer los mejores tratamientos faciales y corporales, combinando experiencia profesional con productos de alta gama.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16" data-aos="fade-up" data-aos-delay="100">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className="p-6 bg-white dark:bg-dark-700 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-600 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 50}
                className="group"
              >
                <div className="h-full p-8 bg-white dark:bg-dark-700 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-dark-600 transform hover:-translate-y-1">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-amber-100/20 dark:from-gold/30 dark:to-amber-900/30 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-gold" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="mt-16" data-aos="fade-up">
            <div className="relative p-10 md:p-12 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 rounded-3xl border border-gold/20 overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.05),transparent_50%)]"></div>
              
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-gold" />
                </div>
                <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-900 dark:text-white leading-relaxed mb-6">
                  "Nuestra misión es transformar no solo tu piel, sino también tu bienestar integral, ofreciendo experiencias únicas que resaltan tu belleza natural."
                </blockquote>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  — Equipo SUNANDA Spa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

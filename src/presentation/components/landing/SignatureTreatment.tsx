import { ArrowRight, Sparkles, Heart, TrendingUp } from 'lucide-react';

export const SignatureTreatment = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Firmeza Global',
      description: 'Rostro, cuello, escote y busto'
    },
    {
      icon: TrendingUp,
      title: 'Resultados Visibles',
      description: 'Desde la primera sesión'
    },
    {
      icon: Heart,
      title: 'Tecnología Premium',
      description: 'Germaine de Capuccini'
    }
  ];

  return (
    <section id="tratamiento-signature" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Editorial Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Image */}
            <div className="relative" data-aos="fade-right">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/assets/images/landing/timexpert-liftin-promo.jpg" 
                  alt="Timexpert Lift_IN Treatment" 
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                
                {/* Overlay Badge */}
                <div className="absolute top-6 left-6 bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Tratamiento Exclusivo
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-8 -right-8 w-64 h-64 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -bottom-8 -left-8 w-72 h-72 bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-3xl"></div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8" data-aos="fade-left">
              {/* Header */}
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                  Timexpert
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    Lift_IN
                  </span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light italic">
                  Descubre una nueva era de firmeza
                </p>
              </div>

              {/* Description */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  El revolucionario tratamiento facial que redefine los contornos del rostro. Una experiencia sensorial única que combina <strong>tecnología avanzada</strong> con ingredientes activos de máxima eficacia para lograr una piel visiblemente más firme, lisa y luminosa.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid gap-6">
                {features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-600/50 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-4">
                <a 
                  href="https://wa.me/50688083390?text=Hola!%20Me%20interesa%20el%20tratamiento%20Timexpert%20Lift_IN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span>Agendar Tratamiento</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white dark:border-dark-800"></div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">5</strong> clientes satisfechos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

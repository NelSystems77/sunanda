import { Star, Award, Sparkles } from 'lucide-react';

export const BrandPartnership = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-dark-800 dark:via-dark-900 dark:to-dark-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium">
              <Award className="w-4 h-4" />
              <span>Cosmética Profesional</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Brand Logo & Info */}
            <div className="text-center md:text-left" data-aos="fade-right">
              <div className="mb-8">
                <img 
                  src="/assets/images/landing/germaine-logo.png" 
                  alt="Germaine de Capuccini" 
                  className="h-16 md:h-20 mx-auto md:mx-0 object-contain"
                />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                Alianza con{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
                  Excelencia Mundial
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Trabajamos con <strong>Germaine de Capuccini</strong>, marca líder en cosmética profesional con más de 50 años de innovación y resultados comprobados. Sus productos premium son utilizados en los spas más prestigiosos del mundo.
              </p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: Star, text: 'Productos científicamente probados' },
                  { icon: Sparkles, text: 'Ingredientes activos de alta concentración' },
                  { icon: Award, text: 'Reconocimiento internacional' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visual Stats */}
            <div className="relative" data-aos="fade-left">
              <div className="bg-white dark:bg-dark-700 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-dark-600">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '50+', label: 'Años de experiencia' },
                    { value: '100+', label: 'Países presentes' },
                    { value: '#1', label: 'En cosmética profesional' },
                    { value: '95%', label: 'Ingredientes naturales' }
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center p-4 bg-gradient-to-br from-amber-50 to-white dark:from-dark-600 dark:to-dark-700 rounded-2xl">
                      <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-600">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic">
                    "La calidad que tu piel merece"
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 -top-4 -right-4 w-32 h-32 bg-amber-200/30 dark:bg-amber-900/20 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -bottom-4 -left-4 w-40 h-40 bg-amber-300/20 dark:bg-amber-800/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

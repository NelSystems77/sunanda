import { useEffect } from 'react';
import { Sparkles, Heart, Gift, ArrowRight, Check } from 'lucide-react';
import { useServiceStore } from '../../context/ServiceStore';
import { ServiceCategory } from '@/core/domain/enums/serviceCategory';

// Fallbacks por si Firestore aún no cargó
const FALLBACK_FACIALES  = ['Limpieza Profunda', 'Hidratación Intensiva', 'Anti-aging', 'Timexpert Lift_IN'];
const FALLBACK_CORPORALES = ['Masajes Relajantes', 'Reductores', 'Drenaje Linfático', 'Post Operatorio'];
const FALLBACK_PAQUETES  = ['Paquete Novia', 'Paquete Bienestar', 'Paquete Premium', 'Paquetes Personalizados'];

export const ServicesSection = () => {
  const { services, fetchActiveServices } = useServiceStore();

  useEffect(() => {
    fetchActiveServices();
  }, [fetchActiveServices]);

  // Nombres reales por categoría (máx. 4 para no alargar la card)
  const faciales  = services.filter(s => s.isActive && s.category === ServiceCategory.FACIAL).map(s => s.name).slice(0, 4);
  const corporales = services.filter(s => s.isActive && s.category === ServiceCategory.CORPORAL).map(s => s.name).slice(0, 4);
  const paquetes  = services.filter(s => s.isActive && s.category === ServiceCategory.PAQUETE).map(s => s.name).slice(0, 4);

  const categories = [
    {
      icon: Sparkles,
      title: 'Tratamientos Faciales',
      description: 'Limpiezas profundas, hidratación y rejuvenecimiento facial con productos premium',
      features: faciales.length > 0 ? faciales : FALLBACK_FACIALES,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      waText: 'Tratamientos Faciales',
    },
    {
      icon: Heart,
      title: 'Tratamientos Corporales',
      description: 'Masajes terapéuticos, reductores y relajantes para tu cuerpo',
      features: corporales.length > 0 ? corporales : FALLBACK_CORPORALES,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      waText: 'Tratamientos Corporales',
    },
    {
      icon: Gift,
      title: 'Paquetes Especiales',
      description: 'Combina varios tratamientos y ahorra con nuestros paquetes',
      features: paquetes.length > 0 ? paquetes : FALLBACK_PAQUETES,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-amber-900/20',
      waText: 'Paquetes Especiales',
    },
  ];

  return (
    <section id="servicios" className="py-16 md:py-24 bg-white dark:bg-dark-900">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Nuestros Servicios</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Tratamientos Personalizados
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Descubre la experiencia perfecta para tu bienestar y belleza
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {categories.map((service, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                className="group relative"
              >
                <div
                  className={`h-full p-8 rounded-3xl bg-gradient-to-br ${service.bgGradient} border border-gray-200 dark:border-dark-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}
                >
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/50688083390?text=Hola!%20Me%20interesa%20información%20sobre%20${encodeURIComponent(service.waText)}`,
                        '_blank'
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300 group-hover:shadow-lg"
                  >
                    <span>Consultar</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Decorative Glow */}
                <div
                  className={`absolute -z-10 inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-3xl`}
                />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center" data-aos="fade-up">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center p-8 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 rounded-3xl border border-gold/20">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  ¿No encuentras lo que buscas?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Contáctanos para crear un tratamiento personalizado
                </p>
              </div>
              <a
                href="https://wa.me/50688083390?text=Hola!%20Necesito%20un%20tratamiento%20personalizado"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                <span>Hablar con Grettel</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

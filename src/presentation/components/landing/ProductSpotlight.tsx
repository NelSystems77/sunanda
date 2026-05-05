import { MessageCircle, Sparkles, Droplets, Sun, Shield, Star } from 'lucide-react';

const WHATSAPP_BASE = 'https://wa.me/50688083390?text=';

const products = [
  {
    id: 'radiance',
    brand: 'GERMAINE DE CAPUCCINI',
    name: 'TIMEXPERT RADIANCE C+',
    tagline: '100% LUMINOSA CON TIMEXPERT RADIANCE C+',
    headline: 'El mejor antioxidante con Vitamina C Pura.',
    description:
      'El estímulo antiedad para las pieles que se ven apagadas o estresadas. Timexpert Radiance C+ crea un tratamiento hasta 6 veces más eficaz. Al poder antioxidante de la vitamina C pura se suma el nanopolímero patentado HLG, proporcionando hidratación intensa y un efecto antiedad completo.',
    benefits: [
      { icon: Sun, text: 'Vitamina C Pura antioxidante' },
      { icon: Sparkles, text: 'Nanopolímero HLG patentado' },
      { icon: Star, text: 'Tratamiento 6 veces más eficaz' },
    ],
    image: '/assets/images/landing/timexpert-radiance.jpg',
    gradient: 'from-amber-500 to-orange-600',
    lightGradient: 'from-amber-50 to-orange-50',
    darkGradient: 'from-amber-900/30 to-orange-900/30',
    accent: 'text-amber-600 dark:text-amber-400',
    accentBg: 'bg-amber-100 dark:bg-amber-900/30',
    accentBorder: 'border-amber-200 dark:border-amber-800/50',
    badgeBg: 'bg-amber-500',
    btnClass: 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    waMessage: 'Hola!%20Me%20interesa%20el%20Timexpert%20Radiance%20C%2B.%20%C2%BFPodr%C3%ADan%20darme%20informaci%C3%B3n%20sobre%20precio%20y%20disponibilidad%3F',
  },
  {
    id: 'hydraluronic',
    brand: 'GERMAINE DE CAPUCCINI',
    name: 'TIMEXPERT HYDRALURONIC',
    tagline: 'HIDRATA Y RELLENA CON TIMEXPERT HYDRALURONIC',
    headline: 'Descubre un concepto de hidratación revolucionario.',
    description:
      'Experimenta una hidratación avanzada con resultados clínicamente probados y dermatológicamente testada en pieles sensibles y en pacientes oncológicos. A la eficacia del ácido hialurónico – de 3 pesos moleculares – se añade la potencia del exclusivo nanopolímero HLG patentado, logrando una piel visiblemente más hidratada, jugosa y con un aspecto más denso.',
    benefits: [
      { icon: Droplets, text: 'Ácido hialurónico 3 pesos moleculares' },
      { icon: Shield, text: 'Testada en pieles sensibles' },
      { icon: Sparkles, text: '48H de hidratación sostenida' },
    ],
    image: '/assets/images/landing/timexpert-hydraluronic.png',
    gradient: 'from-sky-500 to-blue-600',
    lightGradient: 'from-sky-50 to-blue-50',
    darkGradient: 'from-sky-900/30 to-blue-900/30',
    accent: 'text-sky-600 dark:text-sky-400',
    accentBg: 'bg-sky-100 dark:bg-sky-900/30',
    accentBorder: 'border-sky-200 dark:border-sky-800/50',
    badgeBg: 'bg-sky-500',
    btnClass: 'from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700',
    waMessage: 'Hola!%20Me%20interesa%20el%20Timexpert%20Hydraluronic.%20%C2%BFPodr%C3%ADan%20darme%20informaci%C3%B3n%20sobre%20precio%20y%20disponibilidad%3F',
  },
];

export const ProductSpotlight = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-14" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Germaine de Capuccini · HLG Patented</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Productos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                Premium
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Cosmética profesional de alta tecnología disponible en SUNANDA SPA.
              Consulta disponibilidad y precio directamente por WhatsApp.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {products.map((product, idx) => (
              <div
                key={product.id}
                data-aos="fade-up"
                data-aos-delay={idx * 150}
                className={`rounded-3xl overflow-hidden shadow-xl border ${product.accentBorder} bg-white dark:bg-dark-800 flex flex-col`}
              >
                {/* Product Image */}
                <div className={`relative h-64 md:h-72 bg-gradient-to-br ${product.gradient} overflow-hidden`}>
                  {/* Decorative circles */}
                  <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10" />
                  <div className="absolute -bottom-12 -left-6 w-56 h-56 rounded-full bg-white/10" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-white/10" />

                  {/* Real product photo (shows when file exists) */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-6 drop-shadow-2xl z-10"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />

                  {/* HLG Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
                    <p className="text-xs font-bold text-gray-900 tracking-widest">HLG</p>
                    <p className="text-[10px] text-gray-500">Patented</p>
                  </div>

                  {/* Brand + name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 to-transparent p-5">
                    <p className="text-[10px] font-bold text-white/60 tracking-widest uppercase mb-1">{product.brand}</p>
                    <p className="text-lg font-bold text-white leading-tight">{product.name}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 md:p-8 space-y-5">
                  {/* Tagline */}
                  <p className={`text-xs font-bold tracking-widest uppercase ${product.accent}`}>
                    {product.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {product.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {product.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${product.accentBg} flex items-center justify-center`}>
                          <benefit.icon className={`w-4 h-4 ${product.accent}`} />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {benefit.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Headline */}
                  <p className={`text-sm font-semibold italic ${product.accent}`}>
                    "{product.headline}"
                  </p>

                  {/* CTA */}
                  <div className="pt-2 mt-auto">
                    <a
                      href={`${WHATSAPP_BASE}${product.waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r ${product.btnClass} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5`}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Consultar precio por WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10" data-aos="fade-up">
            Precios en colones costarricenses · Confirma disponibilidad antes de tu compra
          </p>
        </div>
      </div>
    </section>
  );
};

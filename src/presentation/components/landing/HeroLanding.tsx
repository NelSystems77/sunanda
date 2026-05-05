import { ArrowRight, Sparkles, Calendar } from 'lucide-react';

export const HeroLanding = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/assets/images/landing/timexpert-liftin-promo.jpg"
        >
          <source src="/assets/video/promocional.mp4" type="video/mp4" />
        </video>
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full mb-8 shadow-2xl" data-aos="fade-up">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="text-sm font-semibold">Productos de Alta Calidad</span>
            <span className="text-gray-300">—</span>
            <span className="text-sm font-semibold text-gold">Germaine de Capuccini</span>
          </div>

          {/* Main Title */}
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Descubre una experiencia única de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold">
              bienestar y belleza
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Tratamientos especializados faciales y corporales con los mejores productos del mercado
          </p>

          {/* CTAs */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <a 
              href="https://wa.me/50688083390?text=Hola!%20Quiero%20reservar%20una%20cita"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gold hover:bg-gold-dark text-white font-bold rounded-full shadow-2xl hover:shadow-gold/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              <span>Reservar Cita</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            <a 
              href="#tratamiento-signature"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white font-bold rounded-full shadow-xl transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              <span>Descubre Más</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div
            className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            {[
              { value: '95%', label: 'Satisfacción' },
              { value: '500+', label: 'Clientas Felices' },
              { value: '5⭐', label: 'Calificación' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="mt-12 flex flex-col items-center gap-2 text-white/70" data-aos="fade-up" data-aos-delay="500">
            <span className="text-sm font-medium">Desliza para descubrir</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
              <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};

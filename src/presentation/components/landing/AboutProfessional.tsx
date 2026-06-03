import { Award, Heart, Star, Users } from 'lucide-react';

export const AboutProfessional = () => {
  const credentials = [
    {
      icon: Award,
      title: 'Enfermera Colegiada',
      value: 'Código 14374'
    },
    {
      icon: Star,
      title: 'Certificación Germaine',
      value: 'Especialista Autorizada'
    },
    {
      icon: Heart,
      title: 'Experiencia',
      value: '10+ años'
    },
    {
      icon: Users,
      title: 'Clientes Atendidos',
      value: '5 satisfechos'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-dark-900">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              <span>Conoce a tu especialista</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Lic. Grettel Bolaños González
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Pasión, profesionalismo y dedicación al servicio de tu bienestar
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Images Collage */}
            <div className="relative" data-aos="fade-right">
              <div className="grid grid-cols-2 gap-4">
                {/* Large Image */}
                <div className="col-span-2 relative rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="/assets/images/landing/grettel-professional-1.png" 
                    alt="Lic. Grettel Bolaños - Profesional"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-sm font-medium mb-1">Especialista en</p>
                    <p className="text-lg font-bold">Tratamientos Faciales y Corporales</p>
                  </div>
                </div>

                {/* Small Image */}
                <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="/assets/images/landing/grettel-professional-2.jpg" 
                    alt="Lic. Grettel Bolaños - Certificaciones"
                    className="w-full h-[250px] object-cover"
                  />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-8 -left-8 w-64 h-64 bg-gold/20 dark:bg-gold/10 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -bottom-8 -right-8 w-72 h-72 bg-gold/10 dark:bg-gold/5 rounded-full blur-3xl"></div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8" data-aos="fade-left">
              {/* Bio */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Como <strong>enfermera colegiada</strong> y especialista certificada en estética profesional, mi compromiso es brindarte tratamientos de la más alta calidad, combinando conocimiento médico con las últimas técnicas en cuidado de la piel.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Cada tratamiento es personalizado según tus necesidades específicas, utilizando productos premium de <strong>Germaine de Capuccini</strong> para garantizar resultados visibles y duraderos.
                </p>
              </div>

              {/* Credentials Grid */}
              <div className="grid grid-cols-2 gap-4">
                {credentials.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-5 bg-gradient-to-br from-gray-50 to-white dark:from-dark-800 dark:to-dark-700 rounded-2xl border border-gray-200 dark:border-dark-600 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold/10 dark:bg-gold/20 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">
                      {item.title}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Philosophy */}
              <div className="p-6 bg-gradient-to-r from-gold/5 to-gold/10 dark:from-gold/10 dark:to-gold/5 rounded-2xl border-l-4 border-gold">
                <p className="text-gray-800 dark:text-gray-200 italic leading-relaxed">
                  "Mi filosofía es simple: <strong>cada clienta es única</strong> y merece una atención personalizada que resalte su belleza natural. No solo transformo la piel, busco que cada persona se sienta renovada y confiada."
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">
                  — Grettel Bolaños
                </p>
              </div>

              {/* Contact CTA */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href="https://wa.me/50688083390?text=Hola%20Grettel!%20Me%20gustaría%20agendar%20una%20cita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span>Agenda tu Cita</span>
                </a>
                <a 
                  href="mailto:greje00@hotmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-gray-900 dark:text-white font-semibold rounded-full transition-all duration-300"
                >
                  <span>Enviar Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

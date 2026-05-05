import { Mail, Phone, MapPin, Clock, MessageCircle, Facebook } from 'lucide-react';

export const Contact = () => {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+506 8808-3390',
      href: 'https://wa.me/50688083390',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      action: 'Enviar mensaje'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      value: '+506 8808-3390',
      href: 'tel:+50688083390',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      action: 'Llamar ahora'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'greje00@hotmail.com',
      href: 'mailto:greje00@hotmail.com',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      action: 'Enviar email'
    }
  ];

  const info = [
    {
      icon: MapPin,
      label: 'Ubicación',
      value: 'San José, Guadalupe, Costa Rica'
    },
    {
      icon: Clock,
      label: 'Horario',
      value: 'Lunes - Domingo: 9:00 AM - 9:00 PM'
    },
    {
      icon: Facebook,
      label: 'Facebook',
      value: 'Sunanda Spa Estética',
      link: 'https://www.facebook.com/people/Sunanda-Spa-Estética/61581631049645/'
    }
  ];

  return (
    <section id="contacto" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4" />
              <span>Contáctanos</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Estamos aquí para{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-600">
                atenderte
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Agenda tu cita o consulta cualquier duda. Respuesta inmediata garantizada.
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactMethods.map((method, idx) => (
              <a
                key={idx}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                className="group"
              >
                <div className={`h-full p-8 bg-gradient-to-br ${method.bgColor} border border-gray-200 dark:border-dark-700 rounded-3xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                    {method.value}
                  </p>

                  {/* CTA */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${method.color} text-white font-semibold rounded-full text-sm group-hover:shadow-lg transition-shadow duration-300`}>
                    <span>{method.action}</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-6" data-aos="fade-up">
            {info.map((item, idx) => (
              <div 
                key={idx}
                className="p-6 bg-white dark:bg-dark-700 rounded-2xl shadow-md border border-gray-100 dark:border-dark-600 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold/10 dark:bg-gold/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                      {item.label}
                    </p>
                    {item.link ? (
                      <a 
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 dark:text-white font-semibold hover:text-gold transition-colors duration-300"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map CTA */}
          <div className="mt-12 text-center" data-aos="fade-up">
            <div className="inline-block p-8 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 rounded-3xl border border-gold/20">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                ¿Prefieres visitarnos en persona?
              </p>
              <a 
                href="https://maps.google.com/?q=San+José+Guadalupe+Costa+Rica"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <MapPin className="w-5 h-5" />
                <span>Ver en Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

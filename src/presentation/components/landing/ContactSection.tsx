import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.14 8.14 0 0 0 4.78 1.52V6.7a4.85 4.85 0 0 1-1.01-.01z"/>
  </svg>
);
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export function ContactSection() {
  const { t } = useTranslation(['landing', 'common']);

  const contactInfo = [
    {
      icon: Phone,
      label: t('common:contact.whatsapp'),
      value: '+506 8808-3390',
      link: 'https://wa.me/50688083390',
      color: 'text-green-400',
    },
    {
      icon: Mail,
      label: t('common:contact.email'),
      value: 'greje00@hotmail.com',
      link: 'mailto:greje00@hotmail.com',
      color: 'text-primary-400',
    },
    {
      icon: MapPin,
      label: t('common:contact.address'),
      value: t('landing:contact.address.line1'),
      link: 'https://maps.google.com/?q=San+José+Guadalupe+Costa+Rica',
      color: 'text-red-400',
    },
    {
      icon: Clock,
      label: t('common:contact.schedule'),
      value: t('landing:contact.schedule.weekdays') + ', ' + t('landing:contact.schedule.hours'),
      link: null,
      color: 'text-blue-400',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t('landing:contact.title')}
            </h2>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto">
              {t('landing:contact.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-start gap-4 p-6 bg-dark-900/80 border border-dark-700 rounded-xl hover:border-primary-500/30 transition-all duration-300">
                  <div className={`${item.color} mt-1`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-dark-400 mb-1">
                      {item.label}
                    </div>
                    <div className="text-white font-medium">
                      {item.value}
                    </div>
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:scale-105 transition-transform"
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </motion.div>
              );
            })}

            {/* Facebook */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a
                href="https://www.facebook.com/people/Sunanda-Spa-Est%C3%A9tica/61581631049645/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-blue-400 mt-1">
                    <Facebook className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-dark-400 mb-1">
                      {t('common:contact.followUs')}
                    </div>
                    <div className="text-white font-medium">
                      Sunanda-Spa Estética
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>

            {/* Instagram */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href="https://www.instagram.com/sunanda_spa_y_estetica?utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/30 rounded-xl hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-pink-400 mt-1">
                    <Instagram className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-dark-400 mb-1">
                      {t('common:contact.followUs')}
                    </div>
                    <div className="text-white font-medium">
                      @sunanda_spa_y_estetica
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>

            {/* TikTok */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href="https://www.tiktok.com/@sunanda.spa_estetica2?_r=1&_t=ZS-96c5N2tma2B"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-slate-500/10 to-slate-600/10 border border-slate-500/30 rounded-xl hover:border-slate-400/50 transition-all duration-300 hover:scale-105">
                  <div className="text-slate-300 mt-1">
                    <TikTokIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-dark-400 mb-1">
                      {t('common:contact.followUs')}
                    </div>
                    <div className="text-white font-medium">
                      @sunanda.spa_estetica2
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          </motion.div>

          {/* CTA grande */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 rounded-2xl p-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                {t('landing:cta.title')}
              </h3>
              <p className="text-dark-300 text-lg mb-8">
                {t('landing:cta.subtitle')}
              </p>
              
              <div className="space-y-4">
                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/50688083390"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    size="lg"
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    {t('landing:contact.sendWhatsApp')}
                  </Button>
                </a>

                {/* Email CTA */}
                <a
                  href="mailto:greje00@hotmail.com"
                  className="block"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-primary-500/30 hover:border-primary-500"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    {t('landing:contact.emailUs')}
                  </Button>
                </a>
              </div>

              {/* Horario destacado */}
              <div className="mt-8 pt-8 border-t border-dark-700">
                <div className="flex items-center justify-center gap-2 text-dark-300">
                  <Clock className="h-5 w-5 text-primary-400" />
                  <span className="font-medium">
                    {t('landing:contact.schedule.weekdays')}
                  </span>
                </div>
                <div className="text-primary-400 font-bold text-xl mt-2">
                  {t('landing:contact.schedule.hours')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

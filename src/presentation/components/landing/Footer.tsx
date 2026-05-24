import { Facebook, Instagram, Mail, MapPin, Phone, Clock, Heart } from 'lucide-react';
import { APP_CONFIG } from '@/shared/constants';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.14 8.14 0 0 0 4.78 1.52V6.7a4.85 4.85 0 0 1-1.01-.01z"/>
  </svg>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: APP_CONFIG.FACEBOOK_URL, label: 'Facebook' },
    { icon: Instagram, href: APP_CONFIG.INSTAGRAM_URL, label: 'Instagram' },
    { icon: TikTokIcon, href: APP_CONFIG.TIKTOK_URL, label: 'TikTok' },
  ];

  const quickLinks = [
    { label: 'Inicio', href: '#' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Tratamientos', href: '#tratamiento-signature' },
    { label: 'Contacto', href: '#contacto' }
  ];

  const legalLinks = [
    { label: 'Términos y Condiciones', href: '#' },
    { label: 'Política de Privacidad', href: '#' },
    { label: 'Política de Cancelación', href: '#' }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/logo.png" 
                  alt="SUNANDA Logo" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">SUNANDA</h3>
                  <p className="text-sm text-gray-400">Estética y Spa</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Centro de estética premium especializado en tratamientos faciales y corporales con productos Germaine de Capuccini.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gold flex items-center justify-center transition-colors duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <a 
                      href={link.href}
                      className="text-sm hover:text-gold transition-colors duration-300 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-gold"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold mb-4">Contacto</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-white mb-1">Ubicación</p>
                    <p className="text-gray-400">San José, Guadalupe<br />Costa Rica</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-white mb-1">Teléfono</p>
                    <a href={`tel:${APP_CONFIG.PHONE_E164}`} className="text-gray-400 hover:text-gold transition-colors">
                      {APP_CONFIG.PHONE}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-white mb-1">Email</p>
                    <a href={`mailto:${APP_CONFIG.EMAIL}`} className="text-gray-400 hover:text-gold transition-colors">
                      {APP_CONFIG.EMAIL}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Schedule */}
            <div>
              <h4 className="text-white font-bold mb-4">Horario</h4>
              <div className="flex items-start gap-3 mb-4">
                <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-gray-400">
                    Lunes - Domingo<br />
                    <span className="text-white font-medium">9:00 AM - 9:00 PM</span>
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-800 rounded-2xl border border-gray-700">
                <p className="text-sm text-gray-400 mb-3">
                  ¿Listo para tu transformación?
                </p>
                <a 
                  href="https://wa.me/50688083390?text=Hola!%20Quiero%20agendar%20una%20cita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2.5 bg-gold hover:bg-gold-dark text-center text-white font-semibold rounded-full transition-colors duration-300 text-sm"
                >
                  Reservar Ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-sm text-gray-400 text-center md:text-left">
                © {currentYear} SUNANDA Spa. Todos los derechos reservados.
              </p>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {legalLinks.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Credits */}
            <div className="mt-6 pt-6 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500" /> por NelSystems
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

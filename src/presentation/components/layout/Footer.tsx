import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin, Heart, Clock } from 'lucide-react';
import { Logo } from './Logo';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.14 8.14 0 0 0 4.78 1.52V6.7a4.85 4.85 0 0 1-1.01-.01z"/>
  </svg>
);

export function Footer() {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About / Logo */}
          <div className="md:col-span-1">
            <Logo size="sm" className="mb-4" />
            <p className="text-dark-400 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-dark-400 hover:text-primary-400 transition-colors"
                >
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-dark-400 hover:text-primary-400 transition-colors"
                >
                  {t('navigation.services')}
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-dark-400 hover:text-primary-400 transition-colors"
                >
                  {t('navigation.bookNow')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('contact.title')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-dark-400">
                <Phone className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <a
                  href="https://wa.me/50688083390"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  +506 8808-3390
                </a>
              </li>
              <li className="flex items-start gap-2 text-dark-400">
                <Mail className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:greje00@hotmail.com"
                  className="hover:text-primary-400 transition-colors"
                >
                  greje00@hotmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-dark-400">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span>San José, Guadalupe<br />Costa Rica</span>
              </li>
              <li className="flex items-start gap-2 text-dark-400">
                <Clock className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span>{t('contact.scheduleText')}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('footer.socialMedia')}</h4>
            <p className="text-dark-400 text-sm mb-4">
              {t('contact.followUs')}
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://www.facebook.com/people/Sunanda-Spa-Est%C3%A9tica/61581631049645/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-500/40 transition-all"
                title="Facebook"
              >
                <Facebook className="w-5 h-5 text-blue-400" />
              </a>
              <a
                href="https://www.instagram.com/sunanda_spa_y_estetica?utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center hover:bg-pink-500/20 hover:border-pink-500/40 transition-all"
                title="Instagram"
              >
                <Instagram className="w-5 h-5 text-pink-400" />
              </a>
              <a
                href="https://www.tiktok.com/@sunanda.spa_estetica2?_r=1&_t=ZS-96c5N2tma2B"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-500/10 border border-slate-500/20 flex items-center justify-center hover:bg-slate-500/20 hover:border-slate-500/40 transition-all"
                title="TikTok"
              >
                <TikTokIcon className="w-5 h-5 text-slate-300" />
              </a>
              <a
                href="https://wa.me/50688083390"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center hover:bg-green-500/20 hover:border-green-500/40 transition-all"
                title="WhatsApp"
              >
                <Phone className="w-5 h-5 text-green-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-dark-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-dark-400">
          <p>
            {t('footer.copyright', { year: currentYear })}
          </p>
          <p className="flex items-center gap-1">
            {t('footer.madeWith')} <Heart className="w-4 h-4 text-red-500 fill-red-500" /> {t('footer.in')} {t('footer.location')}
          </p>
        </div>
      </div>
    </footer>
  );
}

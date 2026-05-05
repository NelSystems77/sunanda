/**
 * LanguageToggle Component
 * 
 * Toggle para cambiar entre Español e Inglés
 * Similar al ThemeToggle, persiste preferencia en localStorage
 */

import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="relative"
      title={currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <Languages className="h-5 w-5" />
      
      {/* Badge con idioma actual */}
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        key={currentLang}
        className="absolute -top-1 -right-1 bg-primary-500 text-dark-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase"
      >
        {currentLang}
      </motion.span>
    </Button>
  );
}

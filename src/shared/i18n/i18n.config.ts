/**
 * i18n Configuration
 * 
 * Sistema de internacionalización para SUNANDA Spa
 * - Idiomas soportados: Español (ES) y Inglés (EN)
 * - Detección automática de idioma del navegador
 * - Persistencia de preferencia en localStorage
 * - Fallback a español si no hay traducción
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones - Español
import commonES from './locales/es/common.json';
import landingES from './locales/es/landing.json';
import servicesES from './locales/es/services.json';
import bookingES from './locales/es/booking.json';
import validationES from './locales/es/validation.json';

// Importar traducciones - Inglés
import commonEN from './locales/en/common.json';
import landingEN from './locales/en/landing.json';
import servicesEN from './locales/en/services.json';
import bookingEN from './locales/en/booking.json';
import validationEN from './locales/en/validation.json';

// Recursos de traducción
const resources = {
  es: {
    common: commonES,
    landing: landingES,
    services: servicesES,
    booking: bookingES,
    validation: validationES,
  },
  en: {
    common: commonEN,
    landing: landingEN,
    services: servicesEN,
    booking: bookingEN,
    validation: validationEN,
  },
};

// Configuración de i18next
i18n
  .use(LanguageDetector) // Detecta idioma del navegador
  .use(initReactI18next)  // Integración con React
  .init({
    resources,
    
    // Idioma por defecto
    fallbackLng: 'es',
    
    // Idiomas soportados
    supportedLngs: ['es', 'en'],
    
    // Namespace por defecto
    defaultNS: 'common',
    
    // Namespaces disponibles
    ns: ['common', 'landing', 'services', 'booking', 'validation'],
    
    // Configuración de detección
    detection: {
      // Orden de detección:
      // 1. localStorage
      // 2. Parámetro de URL (?lng=en)
      // 3. Idioma del navegador
      order: ['localStorage', 'querystring', 'navigator'],
      
      // Key para localStorage
      lookupLocalStorage: 'sunanda-language',
      lookupQuerystring: 'lng',
      
      // Cache del idioma seleccionado
      caches: ['localStorage'],
    },
    
    // Interpolación
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
    
    // Modo de desarrollo
    debug: import.meta.env.DEV,
    
    // Reaccionar a cambios de idioma
    react: {
      useSuspense: false,
    },
  });

export default i18n;

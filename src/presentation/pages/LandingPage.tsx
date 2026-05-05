/**
 * LandingPage
 * 
 * Página principal pública del sitio - VERSIÓN FUSIONADA
 * Landing HTML completa integrada como componente React
 */

import { useTranslation } from 'react-i18next';
import { LandingPage as LandingComponent } from '../components/landing';
import { SEOHead } from '../../shared/seo';
import { localBusinessSchema } from '../../shared/seo/schemas';

export function LandingPage() {
  const { i18n } = useTranslation('common');
  const currentLang = i18n.language;

  // SEO Meta tags
  const pageTitle = currentLang === 'es'
    ? 'SUNANDA Spa - Cuidado Profesional para tu piel y tu cuerpo | San José, Costa Rica'
    : 'SUNANDA Spa - Professional Care for your skin and body | San José, Costa Rica';

  const pageDescription = currentLang === 'es'
    ? 'Spa profesional en San José, Costa Rica. Tratamientos faciales y corporales con productos Germaine de Capuccini. Timexpert Lift_IN. Agende su cita: +506 8808-3390'
    : 'Professional spa in San José, Costa Rica. Facial and body treatments with Germaine de Capuccini products. Timexpert Lift_IN. Book now: +506 8808-3390';

  const keywords = currentLang === 'es'
    ? 'spa san josé, estética costa rica, limpieza facial, tratamientos corporales, germaine de capuccini, spa guadalupe, belleza costa rica, tratamientos faciales, timexpert lift in, firmeza facial'
    : 'spa san jose, costa rica aesthetics, facial cleansing, body treatments, germaine de capuccini, guadalupe spa, costa rica beauty, facial treatments, timexpert lift in, facial firming';

  return (
    <>
      {/* SEO Head con Schema.org */}
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={keywords}
        canonical="https://sunanda-spa.vercel.app/"
        ogUrl="https://sunanda-spa.vercel.app/"
        ogType="business.business"
        lang={currentLang}
        hreflangUrls={[
          { lang: 'es', href: 'https://sunanda-spa.vercel.app/' },
          { lang: 'en', href: 'https://sunanda-spa.vercel.app/' },
          { lang: 'x-default', href: 'https://sunanda-spa.vercel.app/' },
        ]}
        schema={localBusinessSchema}
      />

      {/* Landing Fusionada Completa */}
      <LandingComponent />
    </>
  );
}
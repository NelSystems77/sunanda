/**
 * BookingRequestPage
 * 
 * Página pública para solicitar citas
 * Accesible sin login
 * Multi-idioma (ES/EN)
 */

import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { BookingRequestForm } from '../components/features/BookingRequestForm';

export function BookingRequestPage() {
  const { t, i18n } = useTranslation(['booking', 'common']);
  const currentLang = i18n.language;

  // SEO
  const pageTitle = currentLang === 'es'
    ? 'Solicitar Cita - SUNANDA Spa'
    : 'Request Appointment - SUNANDA Spa';

  const pageDescription = currentLang === 'es'
    ? 'Solicita tu cita en SUNANDA Spa. Te contactaremos para confirmar tu reserva.'
    : 'Request your appointment at SUNANDA Spa. We will contact you to confirm your booking.';

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <html lang={currentLang} />
      </Helmet>

      <div className="min-h-screen bg-dark-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('booking:title')}
            </h1>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto">
              {t('booking:subtitle')}
            </p>
          </div>

          {/* Formulario */}
          <BookingRequestForm />
        </div>
      </div>
    </>
  );
}

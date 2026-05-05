/**
 * BookingSuccessPage
 * 
 * Página de confirmación después de enviar solicitud de cita
 * - Mensaje de éxito
 * - Información sobre próximos pasos
 * - Links a WhatsApp y home
 */

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CheckCircle2, Phone, Home, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/presentation/components/ui/Button';
import { SEOHead } from '../../shared/seo';

export function BookingSuccessPage() {
  const { t, i18n } = useTranslation(['booking', 'common']);
  const currentLang = i18n.language;

  // SEO
  const pageTitle = currentLang === 'es'
    ? 'Solicitud Enviada - SUNANDA Spa'
    : 'Request Sent - SUNANDA Spa';

  return (
    <>
      <SEOHead
        title={pageTitle}
        description="Tu solicitud de cita ha sido enviada exitosamente"
        noindex={true}
        lang={currentLang}
      />

      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full"
        >
          {/* Success Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-xl shadow-green-500/30"
            >
              <CheckCircle2 className="h-12 w-12 text-white" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('booking:messages.success.title')}
            </h1>
            
            <p className="text-lg text-dark-300">
              {t('booking:messages.success.description')}
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-4 mb-8">
            {/* Response Time */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-dark-800 border border-dark-700 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    {currentLang === 'es' ? 'Tiempo de Respuesta' : 'Response Time'}
                  </h3>
                  <p className="text-dark-300 text-sm">
                    {t('booking:info.responseTime')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Email Confirmation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-dark-800 border border-dark-700 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    {currentLang === 'es' ? 'Revisa tu Email' : 'Check Your Email'}
                  </h3>
                  <p className="text-dark-300 text-sm">
                    {currentLang === 'es' 
                      ? 'Te enviaremos una confirmación a tu correo electrónico con los detalles de tu solicitud.'
                      : 'We will send you a confirmation email with the details of your request.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-4"
          >
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/50688083390?text=¡Hola!%20Acabo%20de%20enviar%20una%20solicitud%20de%20cita"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Phone className="h-5 w-5 mr-2" />
                {t('booking:messages.success.whatsapp')}
              </Button>
            </a>

            {/* Back to Home */}
            <Link to="/">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 border-dark-700 hover:border-primary-500"
              >
                <Home className="h-5 w-5 mr-2" />
                {t('booking:messages.success.backToHome')}
              </Button>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-dark-400">
              {t('booking:info.whatsappFaster')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

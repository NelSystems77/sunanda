/**
 * PublicServicesPage
 * 
 * Catálogo público de servicios (sin login requerido)
 * - Filtrado por categoría
 * - Búsqueda
 * - Solo servicios activos
 * - Traducido a ES/EN
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Sparkles, Calendar, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/shared/seo';
import { serviceRepository } from '@/core/infrastructure/repositories/ServiceRepository';
import { Service } from '@/core/domain/interfaces/Service';
import { ServiceCategory } from '@/core/domain/enums/serviceCategory';
import { PublicServiceCard } from '@/presentation/components/features/PublicServiceCard';
import { Input } from '@/presentation/components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '@/presentation/components/ui/Tabs';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { EmptyState } from '@/presentation/components/layout/EmptyState';

const WA = import.meta.env.VITE_WHATSAPP_NUMBER ?? '50688083390';

export function PublicServicesPage() {
  const { t, i18n } = useTranslation(['services', 'common']);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>('all');

  const currentLang = i18n.language;

  // Cargar servicios activos
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const allServices = await serviceRepository.getAll();
      // Solo mostrar servicios activos al público
      const activeServices = allServices.filter(s => s.isActive);
      setServices(activeServices);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar servicios
  const filteredServices = services.filter(service => {
    // Filtro de categoría
    if (selectedCategory !== 'all' && service.category !== selectedCategory) {
      return false;
    }

    // Filtro de búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Tabs de categorías
  const categoryTabs = [
    { id: 'all', label: t('services:categories.all') },
    { id: 'facial', label: t('services:categories.facial') },
    { id: 'corporal', label: t('services:categories.corporal') },
    { id: 'paquete', label: t('services:categories.paquete') },
  ];

  // SEO
  const pageTitle = currentLang === 'es'
    ? 'Servicios - SUNANDA Spa'
    : 'Services - SUNANDA Spa';

  const pageDescription = currentLang === 'es'
    ? 'Descubre nuestros tratamientos faciales y corporales. Productos Germaine de Capuccini. Promociones especiales.'
    : 'Discover our facial and body treatments. Germaine de Capuccini products. Special promotions.';

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonical="https://sunanda-spa.vercel.app/services"
        ogUrl="https://sunanda-spa.vercel.app/services"
        lang={currentLang}
        hreflangUrls={[
          { lang: 'es', href: 'https://sunanda-spa.vercel.app/services' },
          { lang: 'en', href: 'https://sunanda-spa.vercel.app/services' },
          { lang: 'x-default', href: 'https://sunanda-spa.vercel.app/services' },
        ]}
      />

      <div className="min-h-screen bg-dark-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">
                {t('services:categories.all')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('services:title')}
            </h1>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto">
              {t('services:subtitle')}
            </p>
          </div>

          {/* Búsqueda */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
              <Input
                type="text"
                placeholder={t('services:filters.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-dark-800 border-dark-700 text-white"
              />
            </div>
          </div>

          {/* Tabs de categorías */}
          <div className="mb-12 flex justify-center">
            <Tabs
              defaultValue={selectedCategory}
              onChange={(id) => setSelectedCategory(id as typeof selectedCategory)}
            >
              <TabsList>
                {categoryTabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Grid de servicios */}
          {filteredServices.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title={t('services:empty.title')}
              description={t('services:empty.description')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <PublicServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          {/* Estadísticas */}
          <div className="mt-12 text-center">
            <p className="text-dark-400">
              {t('services:stats.total')}: <span className="text-white font-semibold">{filteredServices.length}</span>
            </p>
          </div>

          {/* Sección informativa: inversión personalizada */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="relative bg-gradient-to-br from-dark-800 via-dark-800 to-gold-900/20 border border-gold-500/30 rounded-2xl p-8 md:p-10 text-center shadow-xl">
              {/* Ícono decorativo */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-500/15 border border-gold-500/30 mb-6">
                <Sparkles className="h-7 w-7 text-gold-400" />
              </div>

              {/* Texto principal */}
              <p className="text-dark-200 text-base md:text-lg leading-relaxed mb-6">
                Entendemos que cada cuerpo es único; por ello, nuestros protocolos son tan exclusivos como usted.
                El plan de tratamiento e inversión se definen tras un <span className="text-gold-400 font-semibold">diagnóstico biométrico detallado</span>,
                alineado totalmente con sus objetivos personales.
              </p>

              <p className="text-dark-300 text-sm md:text-base leading-relaxed mb-6">
                Agende una cita de valoración y permítanos acompañarle en la conquista de sus metas.
              </p>

              {/* Cuota de reserva */}
              <div className="bg-dark-900/60 border border-gold-500/20 rounded-xl px-6 py-5 mb-8 text-left">
                <p className="text-dark-200 text-sm md:text-base leading-relaxed">
                  Para brindarle una atención puntual y personalizada, con apertura de expediente clínico y diagnóstico
                  en nuestra sede <span className="text-white font-semibold">Sunanda Guadalupe</span>, manejamos una{' '}
                  <span className="text-gold-400 font-semibold">cuota de reserva de ₡10,000</span>.
                </p>
                <p className="text-dark-300 text-sm md:text-base leading-relaxed mt-3">
                  Este monto no es un costo adicional, sino un <span className="text-white font-medium">pago inicial a su favor</span>,
                  ya que se acreditará al 100% en el tratamiento o paquete que usted elija posterior a la valoración y análisis de sus objetivos.
                </p>
              </div>

              {/* Botones CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold text-base rounded-xl shadow-lg shadow-gold-500/25 transition-all hover:scale-105 w-full sm:w-auto"
                >
                  <Calendar className="h-5 w-5" />
                  Agendar Cita de Valoración
                </Link>

                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola! Quiero agendar una cita de valoración en SUNANDA Spa 🌸')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-dark-700 hover:bg-dark-600 text-white font-bold text-base rounded-xl border border-dark-600 transition-all w-full sm:w-auto"
                >
                  <MessageCircle className="h-5 w-5 text-green-400" />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

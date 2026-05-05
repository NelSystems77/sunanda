import { Helmet } from 'react-helmet-async';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const DEFAULTS = {
  siteName: 'SUNANDA Estética y Spa',
  title: 'SUNANDA Estética y Spa | San José, Costa Rica',
  description: 'Spa profesional en San José con tratamientos Germaine de Capuccini. Faciales, masajes y estética avanzada de la mano de la Lic. Grettel. Agenda tu cita hoy.',
  image: '/og-image.jpg',
  url: import.meta.env.VITE_APP_URL ?? 'https://sunanda-spa.com',
};

export function SEOMetadata({
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  image = DEFAULTS.image,
  url = DEFAULTS.url,
  type = 'website',
}: SEOMetadataProps) {
  const fullTitle = title === DEFAULTS.title ? title : `${title} | SUNANDA Spa`;
  const absoluteImage = image.startsWith('http') ? image : `${DEFAULTS.url}${image}`;

  return (
    <Helmet>
      {/* Básico */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={DEFAULTS.siteName} />
      <meta property="og:locale" content="es_CR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Geo / Local Business */}
      <meta name="geo.region" content="CR" />
      <meta name="geo.placename" content="San José, Costa Rica" />

      {/* Schema.org Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BeautySalon',
          name: DEFAULTS.siteName,
          description: DEFAULTS.description,
          url: DEFAULTS.url,
          telephone: `+${import.meta.env.VITE_WHATSAPP_NUMBER ?? '50688083390'}`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'San José',
            addressCountry: 'CR',
          },
          priceRange: '₡₡₡',
          openingHours: ['Mo-Fr 09:00-18:00', 'Sa 09:00-14:00'],
          sameAs: [
            import.meta.env.VITE_FACEBOOK_URL ?? 'https://www.facebook.com/Sunanda-Spa',
          ],
        })}
      </script>
    </Helmet>
  );
}

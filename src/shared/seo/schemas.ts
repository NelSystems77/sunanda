/**
 * Schema.org Structured Data
 *
 * Schemas para SEO estructurado
 * - LocalBusiness (Spa)
 * - Service
 * - Review
 * - Organization
 */
import { APP_CONFIG } from '@/shared/constants';

/**
 * Schema para el negocio local (SUNANDA Spa)
 */
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  '@id': 'https://sunanda-spa.vercel.app/#business',
  name: 'SUNANDA Estética y Spa',
  alternateName: 'SUNANDA Spa',
  description: 'Spa profesional especializado en tratamientos faciales y corporales en San José, Costa Rica. Productos Germaine de Capuccini.',
  url: 'https://sunanda-spa.vercel.app',
  telephone: '+50688083390',
  email: 'greje00@hotmail.com',

  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Guadalupe',
    addressLocality: 'San José',
    addressRegion: 'San José',
    addressCountry: 'CR',
  },

  // Coordenadas aproximadas — actualizar con ubicación exacta del local
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 9.9281,
    longitude: -84.0907,
  },

  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '21:00',
    },
  ],

  priceRange: '₡₡',

  sameAs: [
    APP_CONFIG.FACEBOOK_URL,
    // Instagram se agrega automáticamente cuando se configure INSTAGRAM_URL
    ...(APP_CONFIG.INSTAGRAM_URL ? [APP_CONFIG.INSTAGRAM_URL] : []),
  ],

  logo: 'https://sunanda-spa.vercel.app/icons/icon-512.png',
  image: 'https://sunanda-spa.vercel.app/icons/icon-512.png',

  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de Spa',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Tratamientos Faciales',
          description: 'Limpiezas faciales profundas y tratamientos especializados',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Tratamientos Corporales',
          description: 'Hidrolipoclasia, drenaje linfático y tratamientos reductivos',
        },
      },
    ],
  },

  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '4',
    bestRating: '5',
    worstRating: '5',
  },

  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'María Rodríguez' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'La limpieza facial profunda superó todas mis expectativas. Mi piel nunca se había sentido tan suave y radiante.',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Marco Jiménez' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'El tratamiento de hidrolipoclasia es increíble. Noté resultados desde la primera sesión.',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Juan Mora' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Personal altamente profesional y productos de primera calidad. Me encanta que utilizan Germaine de Capuccini.',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Andrea Vargas' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Mi piel nunca se había sentido tan bien. Los tratamientos son personalizados y realmente efectivos.',
    },
  ],
};

/**
 * Schema para un servicio específico
 */
export function createServiceSchema(service: {
  name: string;
  description: string;
  priceCRC: number;
  duration: number;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.category,
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'BeautySalon',
      name: 'SUNANDA Spa',
      url: 'https://sunanda-spa.vercel.app',
    },
    offers: {
      '@type': 'Offer',
      price: service.priceCRC,
      priceCurrency: 'CRC',
      availability: 'https://schema.org/InStock',
    },
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'Duration',
      value: `${service.duration} minutes`,
    },
  };
}

/**
 * Schema para reviews/testimonios
 */
export const reviewsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'María Rodríguez',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody: 'La limpieza facial profunda superó todas mis expectativas. Mi piel nunca se había sentido tan suave y radiante.',
      itemReviewed: {
        '@type': 'Service',
        name: 'Limpieza Facial Profunda',
      },
    },
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Marco Jiménez',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody: 'El tratamiento de hidrolipoclasia es increíble. Noté resultados desde la primera sesión.',
      itemReviewed: {
        '@type': 'Service',
        name: 'Hidrolipoclasia',
      },
    },
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Juan Mora',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody: 'Personal altamente profesional y productos de primera calidad. Me encanta que utilizan Germaine de Capuccini.',
      itemReviewed: {
        '@type': 'Service',
        name: 'Tratamientos Corporales',
      },
    },
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Andrea Vargas',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody: 'Mi piel nunca se había sentido tan bien. Los tratamientos son personalizados y realmente efectivos.',
      itemReviewed: {
        '@type': 'Service',
        name: 'Tratamiento Facial Personalizado',
      },
    },
  ],
};

/**
 * Schema para la organización
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SUNANDA Spa',
  url: 'https://sunanda-spa.vercel.app',
  logo: 'https://sunanda-spa.vercel.app/icons/icon-512.png',
  description: 'Spa profesional en San José, Costa Rica',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: APP_CONFIG.PHONE_E164,
    contactType: 'Customer Service',
    email: APP_CONFIG.EMAIL,
    availableLanguage: ['Spanish', 'English'],
  },
  sameAs: [
    APP_CONFIG.FACEBOOK_URL,
    ...(APP_CONFIG.INSTAGRAM_URL ? [APP_CONFIG.INSTAGRAM_URL] : []),
  ],
};

/**
 * Schema para breadcrumbs (migajas de pan)
 */
export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

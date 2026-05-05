/**
 * SEOHead Component
 * 
 * Componente reutilizable para meta tags SEO
 * - Title y description dinámicos
 * - Open Graph (Facebook, WhatsApp)
 * - Twitter Cards
 * - Schema.org JSON-LD
 * - Canonical URL
 */

import { Helmet } from 'react-helmet-async';

export interface HreflangEntry {
  lang: string;
  href: string;
}

export interface SEOHeadProps {
  // Básicos
  title: string;
  description: string;
  keywords?: string;

  // URLs
  canonical?: string;
  ogUrl?: string;

  // Imágenes
  ogImage?: string;
  ogImageAlt?: string;

  // Open Graph específicos
  ogType?: 'website' | 'article' | 'business.business';
  ogSiteName?: string;

  // Twitter
  twitterCard?: 'summary' | 'summary_large_image';
  twitterSite?: string;

  // Otros
  lang?: string;
  noindex?: boolean;

  // hreflang para sitios multiidioma
  hreflangUrls?: HreflangEntry[];

  // Schema.org
  schema?: object;
}

export function SEOHead({
  title,
  description,
  keywords = 'spa, estética, facial, corporal, tratamientos, belleza, San José, Costa Rica, Germaine de Capuccini',
  canonical = 'https://sunanda-spa.vercel.app',
  ogUrl,
  ogImage = 'https://sunanda-spa.vercel.app/assets/images/og-image.jpg',
  ogImageAlt = 'SUNANDA Spa - Estética y Spa en San José, Costa Rica',
  ogType = 'website',
  ogSiteName = 'SUNANDA Spa',
  twitterCard = 'summary_large_image',
  twitterSite = '@SunandaSpa',
  lang = 'es',
  noindex = false,
  hreflangUrls,
  schema,
}: SEOHeadProps) {
  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <link rel="canonical" href={canonical} />

      {/* hreflang para versiones de idioma (mismo URL sirve ES y EN) */}
      {hreflangUrls?.map(({ lang: hLang, href }) => (
        <link key={hLang} rel="alternate" hrefLang={hLang} href={href} />
      ))}

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl || canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content={ogSiteName} />
      <meta property="og:locale" content={lang === 'es' ? 'es_CR' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={ogUrl || canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#eab308" />

      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icons/icon-192.png" />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

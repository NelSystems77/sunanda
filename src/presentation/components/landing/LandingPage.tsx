import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Secciones existentes
import { HeroLanding } from './HeroLanding';
import { BrandPartnership } from './BrandPartnership';
import { SignatureTreatment } from './SignatureTreatment';
import { AboutProfessional } from './AboutProfessional';
import { ServicesSection } from './ServicesSection';
import { ProductSpotlight } from './ProductSpotlight';
import { About } from './About';
import { ExperienceGallery } from './ExperienceGallery';
import { Contact } from './Contact';
import { WhatsAppFloat } from './WhatsAppFloat';

// Nuevos componentes CHAT-06
import { SEOMetadata } from './SEOMetadata';
import { PromosBanner } from './PromosBanner';
import { SocialProof } from './SocialProof';
import { TreatmentDetails } from './TreatmentDetails';
import { BeforeAfter } from './BeforeAfter';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { BookingCTA } from './BookingCTA';
import { BlogPreview } from './BlogPreview';
import { FAQSection } from './FAQSection';
import { NewsletterSignup } from './NewsletterSignup';
import { LiveChat } from './LiveChat';
import { CookieConsent } from './CookieConsent';

export const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      disable: 'mobile',
    });
    AOS.refresh();
    return () => { AOS.refresh(); };
  }, []);

  return (
    <>
      {/* SEO */}
      <SEOMetadata />

      <div className="landing-page">
        {/* Banner promo — encima del hero */}
        <PromosBanner />

        {/* Hero Section */}
        <HeroLanding />

        {/* Prueba social: cifras + certificaciones */}
        <SocialProof />

        {/* Sección 1: Alianza Germaine de Capuccini */}
        <BrandPartnership />

        {/* Sección 2: Tratamiento Signature */}
        <SignatureTreatment />

        {/* Sección 3: Catálogo de tratamientos con modal */}
        <TreatmentDetails />

        {/* Sección 4: Antes / Después */}
        <BeforeAfter />

        {/* Sección 5: Sobre la Profesional */}
        <AboutProfessional />

        {/* Sección 6: Servicios Completos */}
        <ServicesSection />

        {/* Sección 7: Producto Destacado */}
        <ProductSpotlight />

        {/* Sección 8: Testimonios en carrusel */}
        <TestimonialsCarousel />

        {/* CTA principal de reserva */}
        <BookingCTA />

        {/* Sección 9: ¿Por qué SUNANDA? */}
        <About />

        {/* Sección 10: Galería de Experiencias */}
        <ExperienceGallery />

        {/* Blog / Consejos */}
        <BlogPreview />

        {/* FAQ */}
        <FAQSection />

        {/* Newsletter */}
        <NewsletterSignup />

        {/* Sección Contacto */}
        <Contact />

        {/* Flotantes */}
        <WhatsAppFloat />
        <LiveChat />
        <CookieConsent />
      </div>
    </>
  );
};

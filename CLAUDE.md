# SUNANDA SPA — Contexto del Proyecto para Claude

## Descripción general

SPA web para **SUNANDA Estética y Spa** (San José, Costa Rica). React + TypeScript + Vite + Firebase/Firestore. La app tiene dos grandes áreas:

- **Landing pública** (`/`) — marketing, servicios, testimonios, antes/después
- **Dashboard privado** (`/dashboard/*`) — gestión de citas, clientes, pagos, inventario

---

## Stack técnico

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** Tailwind CSS con paleta custom (`dark-*`, `gold-*`, `primary-*`)
- **Animaciones:** Framer Motion
- **Routing:** React Router v6
- **Backend:** Firebase / Firestore
- **Internacionalización:** react-i18next (ES/EN)
- **SEO:** react-helmet-async + Schema.org
- **WhatsApp:** `VITE_WHATSAPP_NUMBER=50688083390`
- **SINPE Móvil:** `VITE_SINPE_PHONE=88083390`

---

## Reglas críticas establecidas

### Precios NO se muestran públicamente
Los precios NO deben aparecer en la landing ni en páginas públicas de servicios. Solo se muestran en el panel admin. La excepción son los servicios designados como "super premium" en FeaturedServices (Glow Force). Si el cliente pide agregar precio a un servicio en la landing, confirmar primero.

### WhatsApp es el canal de ventas principal
Todos los CTAs de la landing deben apuntar a WhatsApp (`wa.me/50688083390`) o a `/booking`. No usar formularios de contacto como canal principal.

### Actualizar siempre en sincronía (4 archivos)
Cuando se agrega o modifica un servicio, se deben actualizar **todos** estos archivos para mantener consistencia:
1. `src/presentation/components/landing/TreatmentDetails.tsx` — modal de detalles
2. `src/presentation/components/landing/FeaturedServices.tsx` — tarjetas destacadas
3. `src/presentation/pages/SetupPage.tsx` — seed de base de datos
4. `src/scripts/crearServicios.ts` — script de creación

### Commits siempre al terminar
Hacer commit + push al finalizar cada cambio. El usuario lo pide explícitamente o se hace proactivamente al final de cada tarea.

---

## Estructura de componentes landing

```
src/presentation/components/landing/
├── LandingPage.tsx          — orquestador principal
├── HeroLanding.tsx
├── FeaturedServices.tsx     — servicios destacados + tarjeta Glow Force premium
├── ProductSpotlight.tsx     — productos Germaine de Capuccini (2 tarjetas: Radiance C+ y Hydraluronic)
├── TreatmentDetails.tsx     — modal con tabs por tratamiento
├── BeforeAfter.tsx          — slider antes/después (WowShape)
├── SignatureTreatment.tsx
├── TestimonialsCarousel.tsx
├── FAQSection.tsx
├── InvestmentInfo.tsx       — sección de inversión personalizada (reemplaza precios)
└── ...
```

---

## Catálogo de servicios actual

### Faciales

| Servicio | Precio | Duración | Notas |
|---|---|---|---|
| **Glow Force Máscara Iluminadora** | ₡55.000 | 15 min | Germaine de Capuccini · Timexpert Radiance C+ · Super Premium |
| **Timexpert Lift_IN** | ₡65.000 | 90 min | Tratamiento Signature |
| **Hydracure Facial** | ₡45.000 | 75 min | |
| **Limpieza Facial Profunda** | ₡20.000 | 60 min | 10 pasos: protocolo completo con aparatología |
| **Limpieza Facial Básica** | ₡25.000 | 60 min | |

### Corporales

| Servicio | Precio | Duración | Notas |
|---|---|---|---|
| **Tratamiento WowShape** | ₡180.000 | — | 5 sesiones · Cavitación, Exfoliación, Activo, Masaje, Sellante, Envoltura |
| **Masaje Relajante** | ₡40.000 | 60 min | |
| **Hidrolipoclasia** | ₡100.000 | 90 min | Promo apertura |

---

## Protocolo Limpieza Facial Profunda (10 pasos)

1. Protocolo de inicio
2. Desmaquillado
3. Exfoliar
4. Tónico
5. Aparatología (según condición)
6. Activo (según condición)
7. Masaje (según condición)
8. Mascarilla (según condición)
9. Sellante
10. Bloqueador

---

## Imágenes de la landing

Ubicadas en `public/assets/images/landing/`:

| Archivo | Uso |
|---|---|
| `timexpert-radiance.jpg` | Glow Force + ProductSpotlight Radiance C+ |
| `timexpert-hydraluronic.png` | ProductSpotlight Hydraluronic |
| `timexpert-liftin-promo.jpg` | Timexpert Lift_IN |
| `antes-wowshape.jpg` / `despues-wowshape.jpg` | BeforeAfter WowShape |
| `germaine-logo.png` | Logo marca |
| `grettel-professional-1.png` / `grettel-professional-2.jpg` | Fotos profesional |
| `producto-germaine.jpg` | Producto genérico |

---

## Estado de sprints (CHATs)

| Sprint | Estado | Descripción |
|---|---|---|
| CHAT-01 | Completado | Stats reales Dashboard, SetupPage protegida, PaymentsPage conectada |
| CHAT-02 | Completado | Dashboard avanzado con recharts (gráficos, widgets, top clientes) |
| CHAT-03 | Completado | Fotos en expedientes, PaymentForm con SINPE Móvil, botón Cobrar |
| CHAT-04 | Completado | QR SINPE Móvil con deep link `sinpemovil://`, env var `VITE_SINPE_PHONE` |
| CHAT-05 | Pendiente (Pro) | Notificaciones automáticas — Twilio + SendGrid + Cloud Functions |
| CHAT-06 | Completado | 12 nuevos componentes landing, SEO, TestimonialsCarousel, BeforeAfter |
| CHAT-07 | Pendiente | Reportes y analytics |
| CHAT-08 | Completado | Inventario completo, ProductSpotlight Germaine de Capuccini |
| CHAT-09 | Pendiente | Testing y performance |

Los briefs están en `c:\spa\SUNANDA-BRIEFS-DESARROLLO-FINAL\`.

---

## Actualizaciones de contenido (sesión 2026-05-23)

- **WowShape** — Highlights actualizados con los 6 componentes reales del tratamiento
- **Limpieza Facial Profunda** — Precio actualizado a ₡20.000, protocolo de 10 pasos completo
- **Glow Force Máscara Iluminadora** — Nuevo servicio super premium integrado:
  - Tarjeta full-width en `FeaturedServices.tsx` con imagen, badge SUPER PREMIUM, precio visible ₡55.000
  - Pestaña nueva en `TreatmentDetails.tsx`
  - Registrado en `SetupPage.tsx` y `crearServicios.ts`

---

## Convenciones de código

- Sin comentarios innecesarios — solo cuando el WHY no es obvio
- Tailwind para todo el estilo — sin CSS externo
- Paleta de colores: `dark-*` para fondos, `gold-*` para acentos premium, `primary-*` para CTAs
- Todos los textos orientados al mercado costarricense (español)
- Precios siempre en colones (₡) con punto de miles: `₡55.000`

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
- **Instagram:** `https://www.instagram.com/sunanda_spa_y_estetica`
- **TikTok:** `https://www.tiktok.com/@sunanda.spa_estetica2`

---

## Reglas críticas establecidas

### Precios NO se muestran públicamente
Los precios NO deben aparecer en la landing ni en páginas públicas de servicios. Solo se muestran en el panel admin. Las excepciones son: los servicios "super premium" en FeaturedServices (Glow Force, Hydraluronic, Expert Lab Peeling) y las dos **promos de apertura** (Limpieza Facial Profunda y Hidrolipoclasia). Si el cliente pide agregar precio a otro servicio en la landing, confirmar primero.

### WhatsApp es el canal de ventas principal
Todos los CTAs de la landing deben apuntar a WhatsApp (`wa.me/50688083390`) o a `/booking`. No usar formularios de contacto como canal principal.

### Gestión de servicios — dónde vive cada cosa

**`TreatmentDetails.tsx` y `ServicesSection.tsx` son dinámicos** (sesión 2026-05-26): cargan desde Firestore via `useServiceStore` → `fetchActiveServices()`. Ya NO tienen arrays hardcodeados. Cualquier servicio activo en Firestore aparece automáticamente en la landing.

Para agregar o editar un servicio en la landing basta con usar el panel admin (`/dashboard/services`).

**`FeaturedServices.tsx` sigue siendo hardcodeado** — las promos de apertura y los 3 super premium Germaine de Capuccini están en código. Si se quiere cambiar esas tarjetas hay que editar el archivo directamente.

Cuando se agrega un servicio que deba aparecer también en `FeaturedServices`, actualizar:
1. `src/presentation/components/landing/FeaturedServices.tsx` — tarjetas destacadas (hardcodeado)
2. `src/presentation/pages/SetupPage.tsx` — seed de base de datos (para ambientes nuevos)
3. `src/scripts/crearServicios.ts` — script de creación batch

### Commits siempre al terminar
Hacer commit + push al finalizar cada cambio. El usuario lo pide explícitamente o se hace proactivamente al final de cada tarea.

---

## Estructura de componentes landing

```
src/presentation/components/landing/
├── LandingPage.tsx          — orquestador principal
├── HeroLanding.tsx
├── FeaturedServices.tsx     — servicios destacados + 3 tarjetas super premium (Glow Force, Hydraluronic, Expert Lab Peeling)
├── ProductSpotlight.tsx     — productos Germaine de Capuccini (2 tarjetas: Radiance C+ y Hydraluronic)
├── TreatmentDetails.tsx     — catálogo de servicios: cards con imagen thumbnail + modal de detalle (dinámico Firestore)
├── BeforeAfter.tsx          — slider antes/después (WowShape)
├── SignatureTreatment.tsx
├── TestimonialsCarousel.tsx
├── FAQSection.tsx
├── InvestmentInfo.tsx       — sección de inversión personalizada (reemplaza precios)
└── ...
```

### Orden de secciones en LandingPage (flujo actual)

1. `PromosBanner` — banner superior
2. `HeroLanding`
3. `SocialProof` — cifras y certificaciones
4. `BrandPartnership` — alianza Germaine de Capuccini
5. **`FeaturedServices`** — 2 promos apertura ultra-premium (Limpieza Facial, Hidrolipoclasia) + divisor dorado + 3 tarjetas super premium Germaine de Capuccini
6. `SignatureTreatment` — Timexpert Lift_IN
7. `TreatmentDetails` — catálogo de servicios: cards con imagen thumbnail al scrollear + modal de detalle al hacer click
8. `BeforeAfter` — slider WowShape
9. `AboutProfessional`
10. `ServicesSection`
11. `InvestmentInfo`
12. `ProductSpotlight`
13. `TestimonialsCarousel`
14. `BookingCTA`
15. `About`, `ExperienceGallery`, `BlogPreview`, `FAQSection`, `NewsletterSignup`, `Contact`

---

## Catálogo de servicios actual

### Faciales

| Servicio | Precio | Duración | Notas |
|---|---|---|---|
| **Glow Force Máscara Iluminadora** | ₡55.000 | 90 min | Germaine de Capuccini · Timexpert Radiance C+ · Super Premium |
| **Hydraluronic Máscara Extra-Hidratante** | ₡55.000 | 90 min | Germaine de Capuccini · Timexpert Hydraluronic · Super Premium |
| **Expert Lab Peeling Químico** | ₡55.000 | 90 min | Germaine de Capuccini · Expert Lab · 3 variantes · Super Premium |
| **Timexpert Lift_IN** | ₡65.000 | 90 min | Tratamiento Signature |
| **Hydracure Facial** | ₡45.000 | 75 min | |
| **Limpieza Facial Profunda** | ₡20.000/sesión · **Promo apertura: ₡35.000 pack 3 sesiones** | 90 min | 10 pasos · protocolo completo con aparatología · normal ₡60.000 las 3 |
| **Limpieza Facial Básica** | ₡25.000 | 60 min | |

### Corporales

| Servicio | Precio | Duración | Notas |
|---|---|---|---|
| **Tratamiento WowShape** | ₡180.000 | — | 5 sesiones · Cavitación, Exfoliación, Activo, Masaje, Sellante, Envoltura |
| **Masaje Relajante** | ₡40.000 | 60 min | |
| **Hidrolipoclasia** | **Promo apertura: ₡130.000 pack 4 sesiones** (normal ₡170.000) | 90 min | Reducción de medidas · imagen: `hidrolipoclasia.JPG` |

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
| `085c4b59-3ff1-497d-9722-602c99f96a9d.JPG` | Glow Force (FeaturedServices) — imagen real del producto |
| `timexpert-radiance.jpg` | ProductSpotlight Radiance C+ (obsoleta para Glow Force) |
| `56df7558-dc4a-4411-b45b-b95b993a8a01.JPG` | Hydraluronic (FeaturedServices) — imagen real del producto |
| `timexpert-hydraluronic.png` | ProductSpotlight Hydraluronic (obsoleta para tarjeta super premium) |
| `expert-lab-flash-peel.jpg` | Expert Lab Peeling Químico (Flash Peel) |
| `timexpert-liftin-promo.jpg` | Timexpert Lift_IN |
| `antes-wowshape.jpg` / `despues-wowshape.jpg` | BeforeAfter WowShape |
| `germaine-logo.png` | Logo marca |
| `grettel-professional-1.png` / `grettel-professional-2.jpg` | Fotos profesional |
| `producto-germaine.jpg` | Producto genérico |
| `limpieza-facial.JPG` | Promo apertura — Limpieza Facial Profunda (FeaturedServices) |
| `hidrolipoclasia.JPG` | Promo apertura — Hidrolipoclasia (FeaturedServices) |

---

## Estado de sprints (CHATs)

| Sprint | Estado | Descripción |
|---|---|---|
| CHAT-01 | Completado | Stats reales Dashboard, SetupPage protegida, PaymentsPage conectada |
| CHAT-02 | Completado | Dashboard avanzado con recharts (gráficos, widgets, top clientes) |
| CHAT-03 | Completado | Fotos en expedientes, PaymentForm con SINPE Móvil, botón Cobrar |
| CHAT-04 | Completado | QR SINPE Móvil con deep link `sinpemovil://`, env var `VITE_SINPE_PHONE` |
| CHAT-05 | Completado | Recordatorios manuales WhatsApp + notificaciones push FCM (Windows y móvil) con Cloud Functions desplegadas |
| CHAT-06 | Completado | 12 nuevos componentes landing, SEO, TestimonialsCarousel, BeforeAfter |
| CHAT-07 | Pendiente | Reportes y analytics |
| CHAT-08 | Completado | Inventario completo, ProductSpotlight Germaine de Capuccini |
| CHAT-09 | Pendiente | Testing y performance |

Los briefs están en `c:\spa\SUNANDA-BRIEFS-DESARROLLO-FINAL\`.

---

## Sistema de Notificaciones (sesión 2026-05-24)

### Estado actual — push FCM + recordatorios WhatsApp

Dos capas de notificaciones activas:

1. **Push nativas FCM** — admin y esteticistas reciben notificaciones en Windows y celular (aunque el navegador esté cerrado). Usa Firebase Cloud Messaging + Cloud Functions desplegadas en `us-central1`.
2. **Recordatorios manuales WhatsApp** — el admin envía recordatorios al cliente desde el modal en `AppointmentsPage`.

### Archivos clave — notificaciones push

| Archivo | Rol |
|---|---|
| `src/core/infrastructure/services/FCMNotificationService.ts` | Gestión de permisos, tokens y mensajes en primer plano |
| `src/presentation/hooks/useAdminNotifications.ts` | Hook: escucha mensajes FCM en primer plano, muestra toasts |
| `src/presentation/components/pwa/NotificationPermission.tsx` | Banner dorado post-login (4s delay) para pedir permiso |
| `src/presentation/components/pwa/AdminNotificationsProvider.tsx` | Provider en `App.tsx` que activa el hook y el banner |
| `public/firebase-messaging-sw.js` | Service Worker FCM — **auto-generado** por plugin Vite en cada build |
| `functions/src/index.ts` | 3 Cloud Functions (triggers y cron) |

### Cloud Functions desplegadas

| Función | Tipo | Trigger |
|---|---|---|
| `onAppointmentCreated` | Firestore trigger | Nueva cita → push inmediato a todos los devices registrados |
| `onAppointmentCancelled` | Firestore trigger | Estado cambia a `cancelled` → push de cancelación |
| `checkAppointmentReminders` | Cron `0 * * * *` (cada hora, CR timezone) | Busca citas a ~24h y ~1h, envía push si aún no enviado |

### Tokens FCM en Firestore

Los tokens se guardan en `users/{userId}.fcmTokens: string[]`. El servicio usa `arrayUnion` al registrar y `arrayRemove` al desloguear. Las Cloud Functions leen todos los tokens de usuarios con `role in ['ADMIN', 'SUPER_ADMIN', 'ESTHETICIAN']` y envían multicast (máx 500 tokens por batch). Los tokens inválidos se limpian automáticamente tras cada envío.

### firebase-messaging-sw.js — generación automática

**NO editar manualmente** — el archivo `public/firebase-messaging-sw.js` lo genera un plugin de Vite en `vite.config.ts` (`generateFCMServiceWorker`) cada vez que se corre `vite build` o `vite dev`. Inyecta el Firebase config desde las variables de entorno. El archivo usa Firebase compat SDK via CDN (`importScripts`) porque los service workers no soportan ES modules en todos los navegadores.

### Env vars requeridas para FCM

```
VITE_FIREBASE_VAPID_KEY=<VAPID key desde Firebase Console > Cloud Messaging > Web Push certificates>
```

### Activar notificaciones en un dispositivo nuevo

1. Loguear como admin/esteticista en el dashboard
2. A los 4 segundos aparece el banner dorado "Activar notificaciones"
3. Clic "Activar" → aceptar el permiso del navegador
4. El token FCM queda guardado en Firestore — ese dispositivo recibe push a partir de ese momento

### Campos de Firestore en `appointments`

| Campo | Tipo | Descripción |
|---|---|---|
| `reminderSent` | `boolean` | `false` por defecto — recordatorio WhatsApp manual al cliente |
| `reminderSentAt` | `Timestamp` | Timestamp del envío manual WhatsApp |
| `reminder24hSent` | `boolean` | `true` tras enviar push de recordatorio 24h al staff |
| `reminder1hSent` | `boolean` | `true` tras enviar push de recordatorio 1h al staff |

### Archivos clave — recordatorios manuales WhatsApp (al cliente)

| Archivo | Rol |
|---|---|
| `src/presentation/pages/AppointmentsPage.tsx` | Modal de recordatorios + helpers de WhatsApp |
| `src/presentation/components/features/ReminderSettings.tsx` | Modal de configuración (UI funcional, persistencia pendiente) |
| `src/presentation/components/features/ReminderPanel.tsx` | Componente alternativo (tema claro, no integrado — lógica vive en modal inline de AppointmentsPage) |
| `src/core/infrastructure/repositories/AppointmentRepository.ts` | `markReminderSent(id)` — actualiza `reminderSent: true` en Firestore |
| `src/core/application/use-cases/appointments/AppointmentUseCases.ts` | `markReminderSent(id)` — proxy al repositorio |

### Flujo de recordatorio manual WhatsApp (actualizado sesión 2026-06-01)

1. Al cargar `AppointmentsPage`, se consultan **todas las citas CONFIRMED de los próximos 30 días** (sin filtrar por `reminderSent`)
2. El badge rojo del botón "Recordatorios" muestra solo el conteo de citas **sin** recordatorio enviado
3. El modal tiene un **toggle de filtro**: "Sin recordatorio (X)" / "Todas las confirmadas (Y)"
   - Por defecto muestra solo las pendientes de recordatorio
   - "Todas las confirmadas" permite re-enviar a cualquier cita
4. Citas que ya tuvieron recordatorio muestran un badge verde "Enviado · día mes" y botón "Re-enviar"
5. Al hacer clic en WhatsApp, se abre `wa.me/506XXXXXXXX` con mensaje personalizado
6. Se llama `markReminderSent()` — la cita **permanece en la lista** con badge "Enviado" actualizado

### Parseo de datos del cliente desde `appointment.notes`

```typescript
const nameMatch = notes.match(/Nombre:\s*([^|]+)/);
const phoneMatch = notes.match(/Tel:\s*([^|]+)/);
```

Formato esperado en `notes`: `Nombre: X | Tel: Y | Emergencia: Z | Tel Emergencia: W`

### Pendiente

- Stats reales en `ReminderSettings` (actualmente hardcodeadas en 156/142/91%)
- Persistencia de configuración de recordatorios en colección `reminderConfig`
- Integración Twilio/SendGrid si se quiere SMS y email al cliente (actualmente solo WhatsApp manual)

---

## Autenticación y gestión de usuarios (sesión 2026-05-24)

### Reglas de Firestore — patrón correcto para colección `users`

La regla `allow read: if isAdmin()` en `/users` causaba que `updateLastLogin` fallara para usuarios con rol `ADMIN` (solo pasaba `SUPER_ADMIN`), rompiendo el login completo. La regla correcta es:

```javascript
match /users/{userId} {
  allow read: if isAdmin() || request.auth.uid == userId;
  allow create: if isSuperAdmin();
  allow update: if isSuperAdmin() ||
    (isAuthenticated() && request.auth.uid == userId &&
     !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'isActive']));
  allow delete: if isSuperAdmin();
}
```

- Cualquier usuario autenticado lee su propio documento (necesario para `LoginUseCase`)
- El propio usuario puede actualizar campos no sensibles (`lastLogin`, foto, teléfono) pero NO `role` ni `isActive`
- Solo `SUPER_ADMIN` puede crear/eliminar usuarios

### Crear usuarios sin cerrar sesión del admin actual

`createUserWithEmailAndPassword` del SDK cliente cierra la sesión actual. Para crear usuarios desde el panel admin usar **instancia secundaria de Firebase**:

```typescript
const secondaryApp = initializeApp(firebaseConfig, `create-user-${Date.now()}`);
const secondaryAuth = getAuth(secondaryApp);
const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
await deleteApp(secondaryApp); // limpiar siempre en finally
```

`firebaseConfig` debe estar exportado desde `src/core/infrastructure/firebase/config.ts`.

### Páginas de autenticación disponibles

| Ruta | Componente | Descripción |
|---|---|---|
| `/login` | `LoginPage.tsx` | Login principal |
| `/forgot-password` | `ForgotPasswordPage.tsx` | Envía email de recuperación vía Firebase Auth |
| `/admin-bootstrap` | `AdminBootstrapPage.tsx` | Página temporal de emergencia — crear primer admin sin acceso al email |

> `AdminBootstrapPage` usa clave `sunanda2026` como gate. Eliminar del router (`App.tsx`) cuando no sea necesaria.

### Modal de creación de usuarios

`src/presentation/components/features/CreateUserModal.tsx` — crea usuario en Firebase Auth + Firestore en un solo paso. Accesible desde `UsersPage` con el botón "Nuevo Usuario" (visible para `SUPER_ADMIN` y `ADMIN`).

---

## Firebase Storage — Reglas y estructura de archivos

### Gotcha: `user.id` vs `user.uid` en componentes

El tipo `User` del dominio (`src/core/domain/interfaces/User.ts`) usa **`id`**, no `uid`. Usar `user?.uid` siempre devuelve `undefined` y rompe cualquier guard de autenticación silenciosamente.

```typescript
// ✅ Correcto
if (!user?.id) { toast.error('Usuario no autenticado'); return; }

// ❌ Incorrecto — uid no existe en User del dominio, siempre undefined
if (!user?.uid) { toast.error('Usuario no autenticado'); return; }
```

> Historial: este bug bloqueaba la subida de fotos en `MedicalRecordModal` para todos los usuarios. El error "Usuario no autenticado" venía del guard en el componente, no de Firebase Storage.



Archivo: `storage.rules` (raíz del proyecto). Referenciado en `firebase.json` → `"storage": { "rules": "storage.rules" }`.

> **Nota histórica:** el archivo no existía hasta la sesión 2026-05-24. Sin reglas publicadas, Firebase Storage deniega toda escritura con un error de permisos que el SDK reporta como "usuario no autenticado". Si vuelve a aparecer ese error, lo primero es verificar que las reglas estén desplegadas: `firebase deploy --only storage`.

### Reglas actuales

```
match /expedientes/{clientId}/{allPaths=**}
  read:  request.auth != null
  write: request.auth != null
         && request.resource.size < 5 MB
         && request.resource.contentType.matches('image/.*')

match /services/{serviceId}/{allPaths=**}
  read:  true                         ← público para la landing
  write: request.auth != null
         && request.resource.size < 5 MB
         && request.resource.contentType.matches('image/.*')

Todo lo demás: denegado
```

### Estructura de paths en Storage

| Path | Contenido |
|---|---|
| `expedientes/{clientId}/{sessionId}/antes/{fileName}` | Foto "antes" de sesión |
| `expedientes/{clientId}/{sessionId}/despues/{fileName}` | Foto "después" de sesión |
| `expedientes/{clientId}/firmas/{fileName}` | Firma digital del consentimiento |
| `services/{serviceId}/main.jpg` | Imagen del servicio — subida desde el dashboard |

### Servicios de subida

`src/core/infrastructure/services/MedicalRecordService.ts`:
- `uploadImage(file, clientId, sessionId, type)` — comprime a máx 500 KB / 1920px antes de subir
- `uploadSignature(dataUrl, clientId)` — convierte dataURL a Blob y sube como PNG

`src/core/infrastructure/services/ServiceImageUploadService.ts` (sesión 2026-05-28):
- `uploadServiceImage(file, serviceId, fileName?)` — sube imagen de servicio a `services/{id}/main.jpg`, retorna URL pública
- `migrateServiceImagesToStorage(onProgress?)` — migra batch todas las imágenes base64 que existan en Firestore a Storage, actualiza `imageURL` en cada documento

### Despliegue de reglas

```bash
firebase deploy --only storage   # solo Storage
firebase deploy --only firestore  # solo Firestore
firebase deploy                   # todo (hosting + firestore + storage)
```

---

## Actualizaciones de arquitectura (sesión 2026-05-26)

### Landing conectada a Firestore — servicios dinámicos

`TreatmentDetails.tsx` y `ServicesSection.tsx` ya no tienen datos hardcodeados. Ahora leen de Firestore.

**`TreatmentDetails.tsx`**
- Eliminado: array estático `TREATMENTS` con 6 tratamientos fijos
- Nuevo: `useServiceStore` → `fetchActiveServices()` al montar
- Muestra todos los servicios con `isActive: true` de Firestore
- **Cards muestran imagen real del servicio** (thumbnail `h-44`, `object-cover`) directamente al scrollear — no solo en el modal
- Hover zoom en imagen (`scale-105 transition-500`) + badge categoría/marca sobre la imagen con `backdrop-blur`
- Fallback sin imagen: emoji grande o ✨ sobre `bg-dark-600`
- Modal adaptado al schema real (`name`, `description`, `benefits`, `priceCRC`, `duration`, `imageURL`, `hasPromotion`, `promotionDescription`, `sessions`)
- `hasRealImage` = `imageURL.startsWith('http') || imageURL.startsWith('/')` → muestra thumbnail `h-44`. Los base64 (`data:`) quedaban excluidos — resuelto en sesión 2026-05-28 migrando a Storage.
- **Contraste correcto (sesión 2026-05-27):** Fondo de sección `bg-dark-900` (negro puro) → Tarjetas `bg-dark-700` (#1f1f1f) — diferencia de 31 RGB puntos, claramente visible · Borde: `border-gold-500/30` → hover `border-gold-500/70`
  - ⚠️ Lección: `dark-800` vs `dark-700` solo difiere 11 puntos RGB — demasiado sutil para ser visible. Usar `dark-900` como base cuando se necesite contraste real en fondos oscuros.

**`ServicesSection.tsx`**
- Conectada a `useServiceStore` — popula las features de cada card con nombres reales por categoría (máx. 4)
- Fallback a nombres genéricos si Firestore aún no cargó

**`index.ts` del landing**
- Eliminado re-export de `TreatmentDetailsModal` (ya no existe como export separado)

### AOS + Firestore — gotcha elementos invisibles

**Nunca usar `data-aos` en elementos que se renderizan condicionalmente después de una carga asíncrona** (Firestore, fetch, etc.).

AOS escanea el DOM una sola vez al inicializar. Si un elemento con `data-aos="fade-up"` aparece *después* de ese escaneo (porque Firestore aún no había cargado), AOS nunca dispara su animación y el elemento queda en `opacity: 0` permanentemente — clickeable pero invisible.

**Regla:** usar `data-aos` solo en elementos que se renderizan inmediatamente (headers estáticos, secciones que no dependen de datos async). Para contenido dinámico post-carga, usar **Framer Motion** con `initial/animate`:

```tsx
// ✅ Correcto — anima siempre, independiente de cuándo se monte
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>

// ❌ Incorrecto — si se monta después de AOS.init(), queda invisible
<div data-aos="fade-up">
```

Este bug ocurrió en `TreatmentDetails.tsx` (sesión 2026-05-27): el grid con `data-aos` se renderizaba después de que Firestore cargaba los servicios, por lo que AOS nunca lo veía.

### PWA Manifest — gotcha screenshots

`public/manifest.json` tenía una sección `screenshots` referenciando `/screenshots/dashboard.png` y `/screenshots/mobile.png` que **no existen** (carpeta nunca creada). Causaba error 404 en consola. **Esa sección fue eliminada** (2026-05-27) — es opcional y solo sirve para preview en instalación tipo app store. Si en el futuro se quieren agregar capturas, crear primero la carpeta `public/screenshots/` con las imágenes reales antes de añadirlas al manifest.

### Imágenes de servicios — flujo correcto (sesión 2026-05-28)

Las imágenes de servicios van a **Firebase Storage**, no a Firestore como base64.

**Flujo actual (después de la migración):**
1. Admin sube imagen en `/dashboard/services` → formulario llama `uploadServiceImage()` → imagen va a `services/{id}/main.jpg` → Firestore guarda solo la URL `https://...`
2. Landing (`TreatmentDetails.tsx`) muestra la imagen porque `imageURL.startsWith('http')` → `hasRealImage = true`

**Migración base64 → Storage (ya ejecutada, 2026-05-28):**
- Se usó `migrateServiceImagesToStorage()` para convertir todos los `data:` existentes en Firestore a URLs reales de Storage
- El botón "Migrar imágenes" fue eliminado del dashboard después de la migración (ya no es necesario)
- La función sigue disponible en `ServiceImageUploadService.ts` por si se necesita invocar desde consola en el futuro

**⚠️ Historial:** antes de la sesión 2026-05-28, `handleImageFileChange` en `ServicesPage.tsx` guardaba la imagen como base64 directamente en `formData.imageURL` y `TreatmentDetails.tsx` excluía esas URLs (`!startsWith('data:')`) haciendo que las cards mostraran solo ✨. Ya corregido.

---

## AppointmentCard — rediseño paleta dark + datos reales (sesión 2026-05-29)

`src/presentation/components/features/AppointmentCard.tsx`

### Problemas corregidos

| Antes | Después |
|---|---|
| Fondo blanco (`bg-white`) — fuera de la paleta del dashboard | `bg-dark-800` con borde izquierdo de color por estado |
| `Cliente ID: 702040975` — cédula cruda | Nombre real parseado de `appointment.notes` |
| `Servicio ID: lblnYXH3IY19XJHHXTje` — ID de Firestore crudo | Nombre real del servicio via `useServiceStore` |
| `onOpenRecord(clientId, clientId)` — nombre incorrecto | `onOpenRecord(clientId, clientName)` — nombre real |

### Parseo del nombre de cliente

```typescript
function parseClientName(notes?: string): string {
  if (!notes) return '';
  const match = notes.match(/Nombre:\s*([^|]+)/);
  return match ? match[1].trim() : '';
}
```
Fallback: si no hay match muestra `Cédula: {appointment.clientId}`.

### Resolución del nombre de servicio

```typescript
const { services } = useServiceStore();
const serviceName = services.find(s => s.id === appointment.serviceId)?.name ?? appointment.serviceId;
```
Fallback: si el store aún no cargó, muestra el ID crudo.

### Paleta de estados (dark)

| Estado | Badge | Borde izquierdo |
|---|---|---|
| Pendiente | `bg-gold-500/20 text-gold-300` | `border-l-gold-500` |
| Confirmada | `bg-blue-500/20 text-blue-300` | `border-l-blue-400` |
| Completada | `bg-purple-500/20 text-purple-300` | `border-l-purple-400` |
| Cancelada | `bg-red-500/20 text-red-400` | `border-l-red-500` |
| En atención | `bg-blue-500/20 text-blue-300` | `border-l-blue-400` |
| No asistió | `bg-dark-500/40 text-dark-300` | `border-l-dark-500` |

El menú desplegable y el diálogo de cancelación también siguen la paleta dark (`dark-700`, `dark-600`).

### Gotcha: menú tres puntos — stacking context anidado → solución Portal (sesión 2026-05-29)

**Síntoma:** el dropdown emergía (`showMenu = true`) pero era invisible — tapado por la card siguiente o por el row del timeline.

**Causa raíz:** hay **dos niveles de stacking context** creados por Framer Motion:
1. El `motion.div` de cada time slot en `CalendarDayView` (animación `x: -20 → 0`)
2. El `motion.div` de cada `AppointmentCard` (animación `y: 12 → 0`)

Subir `z-index` al dropdown o a la card no sirve: esos valores son relativos al stacking context del padre (`motion.div` del time slot), que no tiene z-index explícito y queda por debajo del siguiente slot en orden de paint.

**Fix definitivo — `createPortal` (sesión 2026-05-29):**

```tsx
import { createPortal } from 'react-dom';

const menuBtnRef = useRef<HTMLButtonElement>(null);
const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

const openMenu = (e: React.MouseEvent) => {
  e.stopPropagation();
  const rect = menuBtnRef.current!.getBoundingClientRect();
  setMenuPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
  setShowMenu(v => !v);
};

// Dropdown en document.body — escapa todos los stacking contexts
const dropdown = showMenu && createPortal(
  <motion.div
    style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, zIndex: 9999 }}
    className="w-48 bg-dark-700 rounded-lg shadow-2xl border border-dark-600"
    onMouseDown={(e) => e.stopPropagation()}
  >
    {/* opciones */}
  </motion.div>,
  document.body
);

// Cerrar al click fuera y al scroll
useEffect(() => {
  if (!showMenu) return;
  const close = () => setShowMenu(false);
  document.addEventListener('mousedown', close);
  document.addEventListener('scroll', close, true);
  return () => {
    document.removeEventListener('mousedown', close);
    document.removeEventListener('scroll', close, true);
  };
}, [showMenu]);
```

**Regla:** cualquier dropdown/popover dentro de componentes animados con Framer Motion (listas en loop) debe usar **`createPortal` + `position: fixed` + `getBoundingClientRect()`**. Nunca solo `z-index` — es insuficiente cuando hay múltiples stacking contexts anidados.

### Menú tres puntos — acciones disponibles por estado (sesión 2026-05-29)

El botón `MoreVertical` se muestra para **todos los estados** (incluido `CANCELLED`). Props: `onConfirm`, `onCancel`, `onComplete`, `onNoShow`, `onReopen`, `onDelete`.

| Estado | Opciones del menú |
|---|---|
| `PENDING` | Confirmar · Marcar completada · No asistió · — · Cancelar · Borrar |
| `CONFIRMED` | Marcar completada · No asistió · — · Cancelar · Borrar |
| `IN_PROGRESS` | Marcar completada · No asistió · — · Cancelar · Borrar |
| `COMPLETED` | Reabrir cita · — · Borrar |
| `NO_SHOW` | Reabrir cita · — · Cancelar · Borrar |
| `CANCELLED` | Reabrir cita · — · Borrar |

- **Reabrir** → `status: PENDING`, limpia campos de cancelación
- **Borrar** → hard delete real en Firestore (`deleteDoc`), con diálogo de confirmación que muestra nombre del cliente y hora
- La cadena completa: `repo.reopen()` / `repo.delete()` → `AppointmentUseCases` → `AppointmentStore` → `useAppointments` hook → `CalendarDayView` → `AppointmentCard`

---

## Flujo de Solicitudes de Citas — BookingRequests (sesión 2026-05-31)

### Flujo completo

```
Landing /booking (público)
  → BookingRequestPage.tsx + BookingRequestForm.tsx
  → Firestore colección bookingRequests (status: PENDING)
  → /booking-success

Dashboard /dashboard/booking-requests (admin/staff)
  → BookingRequestsPage.tsx
  → Lista de solicitudes pendientes
  → Acciones: Confirmar / Rechazar / WhatsApp directo al cliente
```

### Dos colecciones separadas

| Colección | Propósito | Quién escribe |
|---|---|---|
| `bookingRequests` | Solicitudes públicas — clientes desde la landing | `BookingRequestForm` |
| `appointments` | Citas confirmadas — agenda del spa | Admin desde el dashboard |

Cuando el admin confirma una `bookingRequest`, **aún no se crea automáticamente un `Appointment`** — hay un TODO en `BookingRequestCard.tsx`. El flujo manual actual: admin ve la solicitud → confirma → WhatsApp se abre con mensaje prellenado → crea la cita manualmente en `/dashboard/appointments`.

### Mensaje de confirmación automático por WhatsApp (sesión 2026-06-04)

Al hacer clic en **Confirmar** en `BookingRequestCard.tsx`, tras actualizar el estado en Firestore se abre automáticamente WhatsApp Web con este mensaje prellenado:

```
Estimado/a [clientName],

Reciba un cordial saludo de parte del equipo de SUNANDA. Nos complace confirmar su asistencia para su próxima cita:
📅 Fecha: [día de semana d de mes de año]
⏰ Hora: [requestedTime]

Agradecemos su preferencia y le esperamos puntualmente. ¡Feliz día!
```

- La fecha se formatea en español con `date-fns` (`EEEE d 'de' MMMM 'de' yyyy`, locale `es`), primera letra en mayúscula.
- El teléfono se limpia de caracteres no numéricos y se antepone `506` si no lo tiene.
- El admin solo debe presionar Enviar en WhatsApp Web — el mensaje ya está escrito.

### Bug corregido (sesión 2026-05-31) — página inaccesible

`BookingRequestsPage` era completamente inaccesible por tres problemas simultáneos:

1. **Ruta fuera del dashboard** — estaba en `/admin/booking-requests`, fuera del prefijo `/dashboard/*`. Movida a `/dashboard/booking-requests` y registrada en `ROUTES.BOOKING_REQUESTS`.
2. **Sin enlace en el sidebar** — ningún ítem del menú apuntaba a la página. Agregado ítem "Solicitudes" con ícono `BellRing` en `Sidebar.tsx`, entre "Agenda" y "Servicios".
3. **Sin `DashboardLayout`** — la página renderizaba sin header, sidebar ni estructura. Agregado `DashboardLayout` como wrapper en `BookingRequestsPage.tsx`.

### Notificaciones push para nuevas solicitudes

**Implementado (sesión 2026-06-01):** `onBookingRequestCreated` — trigger Firestore en `bookingRequests/{requestId}` que envía push inmediato al staff cuando un cliente hace una solicitud desde la landing. Cuerpo: `${clientName} · ${serviceName} · ${fecha} ${hora}`. Si `flexibleTime: true`, muestra "(horario flexible)". Enlace a `/dashboard/booking-requests`. `requireInteraction: true` igual que las citas nuevas. Desplegada en `us-central1`.

### Badge de solicitudes pendientes en el dashboard (sesión 2026-06-01)

**Dónde aparece:**
- **Campana del header** (desktop) — numerito rojo con el conteo de solicitudes `PENDING`
- **Ítem "Solicitudes" del sidebar** — badge al lado del label en modo expandido, sobre el ícono en modo rail (tablet)

**Cómo funciona:**
- `DashboardLayout.tsx` llama `bookingRequestRepository.getAll()` al montar y alimenta `useBookingRequestStore`
- El Header recibe `notifications={stats.pending}` — si es 0 no muestra badge
- El Sidebar lee `useBookingRequestStore(s => s.stats.pending)` y lo inyecta como `badge` en el ítem `/dashboard/booking-requests` mediante `.map()` sobre `filteredItems`
- Cuando el admin confirma o rechaza una solicitud en `BookingRequestsPage`, el store se actualiza y los badges se actualizan solos

**Archivos clave:**
| Archivo | Cambio |
|---|---|
| `DashboardLayout.tsx` | Carga solicitudes al montar, pasa `stats.pending` al Header |
| `Sidebar.tsx` | Lee store y aplica badge al ítem "Solicitudes" |

---

## PWA — Caché y MIME type error (sesión 2026-05-29)

### Síntoma

```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html".
```

Ocurre **ocasionalmente al refrescar**, especialmente justo después de un deploy nuevo.

### Causa raíz

Flujo del problema:
1. Se hace deploy → Vite genera chunks con nuevos hashes (`main-XYZ.js`). El build anterior (`main-ABC.js`) ya no existe en Firebase Hosting.
2. El browser tiene el `index.html` **viejo** en caché (o el SW lo sirvió stale). Ese HTML referencia `main-ABC.js`.
3. El browser pide `main-ABC.js` → Firebase no lo encuentra → aplica el rewrite `**` → devuelve `index.html` con `Content-Type: text/html`.
4. El browser esperaba `application/javascript` → 💥 MIME type error.

Es **ocasional** porque solo afecta a usuarios que tienen el `index.html` viejo cacheado, en la ventana entre deploy y actualización del SW/browser.

### Fix aplicado (2026-05-29)

**`firebase.json` — `no-cache` para `index.html`, `immutable` para assets hasheados:**

```json
{ "source": "/index.html",
  "headers": [{ "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
               { "key": "Pragma",        "value": "no-cache" }] },
{ "source": "**/*.@(js|css)",
  "headers": [{ "key": "Cache-Control", "value": "max-age=31536000, immutable" }] }
```

**`vite.config.ts` — eliminado el `runtimeCaching` duplicado para `*.js/*.css`:**

Workbox precaching ya gestiona los chunks de Vite con revisión de contenido hash. El `runtimeCaching` con `StaleWhileRevalidate` para `*.js` era redundante y podía entrar en conflicto, sirviendo versiones stale de chunks obsoletos.

### Regla de oro para SPAs con Vite

| Recurso | Cache-Control | Razón |
|---|---|---|
| `index.html` | `no-cache, no-store` | Siempre debe ser fresco — apunta a los chunks actuales |
| `*.js`, `*.css` con hash | `max-age=31536000, immutable` | El hash cambia con el contenido → nombre nuevo = archivo nuevo |
| Imágenes/fuentes con hash | `max-age=31536000, immutable` | Mismo principio |

### También eliminado: `runtimeCaching` para `.js/.css` en workbox

Los chunks de Vite ya tienen hash en el nombre (`main-[hash].js`). Workbox precaching los gestiona correctamente vía revisión. El runtime cache para `*.js` creaba una segunda capa de gestión que podía devolver versiones viejas de chunks que ya no existen en el servidor.

---

## Firestore — Gotcha índices compuestos en queries con rango (sesión 2026-05-29)

### Síntoma

```
Uncaught (in promise) Error: No se pudieron obtener las citas del día
Uncaught (in promise) Error: No se pudieron obtener las citas del rango de fechas
```

Errores en `AppointmentRepository.getByDate` y `getByDateRange`. Los errores son re-lanzados genéricamente desde el `catch`, ocultando el error real de Firestore.

### Causa raíz

Las queries usaban `orderBy('date', 'asc') + orderBy('startTime', 'asc')` simultáneamente con un filtro de rango (`where('date', '>=', ...) + where('date', '<=', ...)')`). Firestore requiere un **índice compuesto** `(date ASC, startTime ASC)` para ese patrón. El índice estaba definido en `firestore.indexes.json` pero **nunca fue desplegado** a Firestore con `firebase deploy --only firestore:indexes`.

**Flujo de la cadena de errores:**
- `AppointmentsPage` → `getDayOccupancy` → `AppointmentUseCases` → `AvailabilityService` → `AppointmentRepository.getByDate` → 💥
- `AppointmentsPage.loadUpcomingReminders` → `AppointmentRepository.getByDateRange` → 💥
- `getWeekOccupancy` llama `getDayOccupancy` 7 veces — también afectado

### Fix aplicado (2026-05-29) — `AppointmentRepository.ts`

Eliminado el segundo `orderBy` del query Firestore; el ordenamiento por `startTime` se hace **client-side**:

```typescript
// ✅ Correcto — solo un campo en orderBy, sort client-side
const q = query(
  collection(db, this.collectionName),
  where('date', '>=', Timestamp.fromDate(startOfDay)),
  where('date', '<=', Timestamp.fromDate(endOfDay)),
  orderBy('date', 'asc')
  // ← NO orderBy('startTime') aquí
);
const results = querySnapshot.docs.map(doc => this.mapDocToAppointment(doc.id, doc.data()));
return results.sort((a, b) => a.startTime.localeCompare(b.startTime));

// ❌ Incorrecto — requiere índice compuesto que puede no estar desplegado
const q = query(
  ...,
  orderBy('date', 'asc'),
  orderBy('startTime', 'asc')   // ← causa error si el índice no está en Firestore
);
```

### Regla

**Nunca usar `orderBy` en dos campos distintos sobre una query de rango** sin antes haber desplegado el índice compuesto correspondiente en Firestore. Para conjuntos pequeños (citas de un día o de una semana), el sort client-side es perfectamente aceptable y elimina la dependencia del índice.

Si se necesita `orderBy` compuesto en producción, desplegar primero:
```bash
firebase deploy --only firestore:indexes
```

### Nota sobre `isActive` y el error en estadísticas del dashboard

Si el dashboard muestra "Error cargando estadísticas" y NO está relacionado con el índice (los `getAll()` usan `orderBy` de un solo campo), la causa probable es la función `isActive()` en las reglas de Firestore:

```javascript
function isActive() {
  return isAuthenticated() &&
         get(/databases/.../users/$(request.auth.uid)).data.isActive == true;
}
```

Todos los reads de `appointments`, `clients` y `payments` requieren `isActive == true`. Si el documento del usuario en Firestore no tiene ese campo en `true`, **todos los reads protegidos fallan silenciosamente**. Verificar en Firebase Console → Firestore → colección `users` → documento del admin → campo `isActive: true`.

---

## Actualizaciones de contenido (sesión 2026-05-23)

- **WowShape** — Highlights actualizados con los 6 componentes reales del tratamiento
- **Limpieza Facial Profunda** — Precio actualizado a ₡20.000, protocolo de 10 pasos completo
- **Glow Force Máscara Iluminadora** — Nuevo servicio super premium integrado:
  - Tarjeta full-width en `FeaturedServices.tsx` con imagen, badge SUPER PREMIUM, precio visible ₡55.000
  - Imagen: `085c4b59-3ff1-497d-9722-602c99f96a9d.JPG` (imagen real del producto — máscara naranja Timexpert Radiance C+)
  - Pestaña nueva en `TreatmentDetails.tsx`
  - Registrado en `SetupPage.tsx` y `crearServicios.ts`
- **Hydraluronic Máscara Extra-Hidratante** — Segundo super premium integrado (tarjeta sky/azul):
  - Imagen: `56df7558-dc4a-4411-b45b-b95b993a8a01.JPG` (imagen real del producto) · HA triple peso molecular + HLG Patented
- **Expert Lab Peeling Químico** — Tercer super premium integrado (tarjeta emerald):
  - 3 variantes: Equilibrante (grasa/acné), Antiedad (colágeno/firmeza), Flash (luminosidad inmediata)
  - 5% Mandelic Acid + 5% Lactobionic Acid · Imagen: `expert-lab-flash-peel.jpg`
- **FeaturedServices en LandingPage** — Corregido: el componente no estaba importado ni renderizado (los 3 super premium eran invisibles para visitantes). Ahora se posiciona entre `BrandPartnership` y `SignatureTreatment`.
  - Divisor dorado "Colección Exclusiva · Germaine de Capuccini" separa promos regulares de super premium
  - Encabezado "Tratamientos Super Premium" con acento `gold-400`
  - Imágenes: altura aumentada a `min-h-[420px]`, padding reducido a `p-4`, hover `scale-110`
  - Tarjeta Hydraluronic con layout espejo (imagen a la derecha) para ritmo visual izq→der→izq
- **Promos de apertura rediseñadas** — Limpieza Facial Profunda e Hidrolipoclasia reemplazaron las tarjetas simples con cards ultra-premium:
  - Ribbon animado "PRECIO ESPECIAL DE APERTURA — TIEMPO LIMITADO" con llamas
  - Banner global de urgencia naranja/rojo sobre ambas promos
  - Limpieza Facial: 3 sesiones × 90 min · ₡35.000 (normal ₡60.000) · paleta rose/pink · `limpieza-facial.JPG`
  - Hidrolipoclasia: 4 sesiones × 90 min · ₡130.000 (normal ₡170.000) · paleta violet/purple · `hidrolipoclasia.JPG`
  - Cada card: imagen full-height, badge sesiones, bloque precio con tachado, badge "Ahorrás X", CTA WhatsApp pre-llenado

---

## Formulario de Citas (AppointmentForm)

`src/presentation/components/features/AppointmentForm.tsx`

### Campos del cliente

| Campo | Binding | Destino |
|---|---|---|
| **Número de Cédula** | `register('clientId')` | `clientId` en Firestore — identificador único del cliente |
| **Nombre Completo** | estado local `clientName` | Se prepone automáticamente a las notas al guardar |
| **Teléfono** | estado local `clientPhone` | Se prepone automáticamente a las notas al guardar |

### Contacto de emergencia

| Campo | Binding | Destino |
|---|---|---|
| **Nombre** | estado local `emergencyContactName` | Se prepone automáticamente a las notas al guardar |
| **Teléfono** | estado local `emergencyContactPhone` | Se prepone automáticamente a las notas al guardar |

El prefijo generado en notas tiene el formato: `Nombre: X | Tel: Y | Emergencia: Z | Tel Emergencia: W`

### Validación — campos requeridos

- `clientId` (cédula): requerido, mínimo 1 caracter
- `estheticianId`: **opcional** (default `''`) — permite crear citas sin asignar esteticista
- `serviceId`: requerido
- `date`, `startTime`, `endTime`: requeridos

Todos los campos del schema tienen `defaultValues` explícitos en `useForm` (`clientId: ''`, `estheticianId: ''`, `serviceId: ''`). Sin esto los valores son `undefined` y la validación de Zod falla silenciosamente al enviar.

### Manejo de errores en submit

`handleSubmit(onSubmit, onValidationError)` — el segundo argumento es el `onError` callback:

- **Si la validación falla** (campo requerido vacío, hora inválida, etc.): muestra toast `"Por favor completa todos los campos requeridos"`. Sin este callback el usuario no recibe ningún feedback.
- **Si `createAppointment` devuelve `null`** (sin lanzar excepción): muestra toast `"No se pudo crear la cita"`.
- **Si lanza una excepción inesperada**: muestra toast genérico de error.

### Selector de horario

El selector de hora **siempre es visible** (no está gateado por selección de esteticista):

- **Sin esteticista seleccionada:** se generan todos los slots del día (09:00–21:00, paso de 30 min) con `available: true` usando la función local `generateAllTimeSlots()`. El usuario puede elegir hora libremente.
- **Con esteticista seleccionada:** se carga disponibilidad real via `fetchAvailableSlots()` — los slots ocupados por esa esteticista se marcan como no disponibles.

La duración por defecto es **90 minutos** (duración real de los tratamientos). Excepciones: Limpieza Facial Básica (60 min) y Drenaje Linfático (60 min). Paquetes tienen duración propia (150–240 min).

### Lógica de slots

- `SPA_SCHEDULE` (en `AvailabilityService.ts`): horario 09:00–21:00, paso entre slots **90 min** (sesión 2026-06-04). Slots ofrecidos: 09:00, 10:30, 12:00, 13:30, 15:00, 16:30, 18:00, 19:30.
- `displaySlots` (useMemo): decide qué lista mostrar en `TimeSlotSelector`
- El botón "Crear Cita" permanece deshabilitado hasta que se seleccione un slot

### Gotcha: botones de slot sin `type="button"` (sesión 2026-06-04)

Los `<motion.button>` en `TimeSlotSelector.tsx` deben tener **`type="button"`** explícito. Sin él, el comportamiento HTML por defecto es `type="submit"`, lo que hace que al hacer clic en un horario se dispare el submit del formulario antes de que todos los campos estén listos → toast "Por favor completa todos los campos requeridos" aunque el formulario esté lleno.

### Gotcha: `endTime` vacío cuando se abre el formulario con `initialTime` (sesión 2026-06-04)

Cuando el usuario hace clic en un slot del calendario para crear una cita, `AppointmentsPage` pasa `initialTime` al `AppointmentForm`. El `startTime` se inicializa con ese valor en `defaultValues`, pero el `endTime` quedaba como `''` (vacío) porque `handleSlotSelect` nunca se llama si el usuario no re-selecciona el slot. La validación Zod fallaba con el campo `endTime` vacío.

**Fix:** calcular el `endTime` inicial en `defaultValues` cuando se recibe `initialTime`:

```typescript
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
}

// En defaultValues:
endTime: initialTime ? calculateEndTime(initialTime, 90) : '',
```

### Gotcha: `isCurrentTime` en `CalendarDayView` con slots de 90 min (sesión 2026-06-04)

La lógica original usaba `Math.floor(now.getMinutes() / 30) * 30 === slotMinutes`. Con slots de 90 min esto falla: a las 11:20 el slot activo es 10:30, pero `Math.floor(20/30)*30 = 0` → busca "11:00" que no existe.

**Fix:** verificar si la hora actual cae **dentro** del rango del slot:

```typescript
const isCurrentTime = (time: string): boolean => {
  if (now.toDateString() !== selectedDate.toDateString()) return false;
  const slotStart = slotH * 60 + slotM;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= slotStart && nowMinutes < slotStart + SPA_SCHEDULE.slotDuration;
};
```

**Regla:** `isCurrentTime` y `generateTimeSlots` en `CalendarDayView` siempre deben usar `SPA_SCHEDULE.slotDuration` — nunca hardcodear `30`.

---

## Esteticistas del equipo

Los selectores de esteticista en el dashboard usan IDs fijos (`esthetician-1`, `esthetician-2`, `esthetician-3`) como valores en Firestore. Los nombres visibles se configuran en:
- `src/presentation/components/features/AppointmentForm.tsx` — formulario de agendar cita
- `src/presentation/components/features/AppointmentFilters.tsx` — filtro en vista de citas

| ID (Firestore) | Nombre visible |
|---|---|
| `esthetician-1` | Lic. Grettel Bolaños González |
| `esthetician-2` | Esteticista 2 |
| `esthetician-3` | Esteticista 3 |

> Si se asigna nombre real a Esteticista 2 o 3, actualizar ambos archivos y esta tabla.

---

## Gotcha: UTC vs hora local en date pickers (sesión 2026-06-04)

### Síntoma

El date picker del formulario de citas (`AppointmentForm.tsx`) bloqueaba seleccionar "hoy" con el tooltip del navegador: *"El valor debe ser DD/MM/YYYY o posterior"*, apuntando al día siguiente.

### Causa raíz

```typescript
// ❌ Incorrecto — .toISOString() devuelve UTC, no hora local
min={new Date().toISOString().split('T')[0]}
value={selectedDate.toISOString().split('T')[0]}
```

Costa Rica es **UTC-6**. Después de las **18:00 hora CR**, `new Date().toISOString()` ya devuelve la fecha del día siguiente en UTC (ej. 18:00 CR = 00:00 UTC del día+1). El atributo `min` quedaba en mañana, impidiendo seleccionar hoy.

### Fix aplicado (`AppointmentForm.tsx`)

```typescript
// ✅ Correcto — usar getFullYear/Month/Date que operan en hora local
function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Uso:
min={toLocalDateStr(new Date())}
value={toLocalDateStr(selectedDate)}
```

### Regla

**Nunca usar `.toISOString().split('T')[0]` para calcular fechas locales.** Usar siempre `getFullYear()`, `getMonth()`, `getDate()` que respetan la zona horaria del dispositivo. Esto aplica a cualquier `<input type="date">` en el proyecto.

---

## Convenciones de código

- Sin comentarios innecesarios — solo cuando el WHY no es obvio
- Tailwind para todo el estilo — sin CSS externo
- Paleta de colores: `dark-*` para fondos, `gold-*` para acentos premium, `primary-*` para CTAs
- Todos los textos orientados al mercado costarricense (español)
- Precios siempre en colones (₡) con punto de miles: `₡55.000`

### Patrón correcto para imágenes full-bleed en grid/flex

En cards de dos columnas (imagen + contenido), usar siempre `absolute inset-0` en el `img`, **no** `h-full w-full` sin posicionamiento absoluto. El contenedor de imagen necesita un color de fondo de fallback:

```tsx
// ✅ Correcto
<div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] bg-gradient-to-br from-X to-Y overflow-hidden">
  <img className="absolute inset-0 w-full h-full object-cover" />
</div>

// ❌ Incorrecto — imagen negra en grid con altura auto
<div className="relative h-72 md:h-auto min-h-[380px] overflow-hidden">
  <img className="h-full w-full object-cover" />
</div>
```

El error ocurre porque `h-full` en un hijo no-absoluto dentro de un contenedor `h-auto` genera una referencia circular → altura 0.

### Breakpoint para layout de 2 columnas (imagen + contenido)

Usar **`lg:grid-cols-2`** (1024px), nunca `md:grid-cols-2` (768px). En tablets de 768–1023px el contenido queda demasiado comprimido. Lo mismo aplica a `lg:order-1/2` y `lg:p-10`.

### Imágenes nuevas: siempre hacer git add explícito

Al agregar archivos a `public/assets/images/landing/`, ejecutar `git add <archivo>` de forma explícita antes del commit. Los archivos de imagen en `public/` no se auto-detectan como cambios de código y es fácil omitirlos. Si una imagen funciona localmente pero no en Vercel, lo primero a verificar es `git ls-files public/assets/images/landing/`.

### Paleta dark — valores reales y gotcha de contraste

Los valores hex de la paleta custom `dark-*` (definida en `tailwind.config.js`):

| Token | Hex | Descripción |
|---|---|---|
| `dark-900` | `#000000` | Negro puro — fondo más oscuro posible |
| `dark-800` | `#141414` | Casi negro — fondo principal del dashboard |
| `dark-700` | `#1f1f1f` | Gris muy oscuro — bordes y separadores |
| `dark-600` | `#2d2d2d` | Gris oscuro — elementos secundarios |
| `dark-500` | `#4a4a4a` | Gris medio |
| `dark-400` | `#717171` | Gris claro — texto secundario |
| `dark-300` | `#a4a4a4` | Gris más claro — texto descriptivo |

**Gotcha crítico**: `dark-900` (`#000000`) sobre `dark-800` (`#141414`) es prácticamente invisible. Las tarjetas deben ser **al menos un tono más claro** que su contenedor:
- Sección `bg-dark-800` → cards `bg-dark-700` ✅  
- Sección `bg-dark-700` → cards `bg-dark-600` ✅  
- Sección `bg-dark-800` → cards `bg-dark-900` ❌ (negro sobre casi-negro)

Para reforzar visibilidad en dark: usar `border-gold-500/20` como borde por defecto (sutil dorado visible) y `hover:border-gold-500/60` en hover. Evitar `border-dark-700` como único diferenciador visual.

**Gotcha íconos y texto sobre fondos oscuros**: `text-dark-400` (#717171) sobre `bg-dark-800` (#141414) da ~3.9:1 de contraste — insuficiente para íconos pequeños (16px). Regla:
- Íconos secundarios (acciones, decorativos): mínimo `text-dark-300` (#a4a4a4) → contraste ~6.4:1 ✅
- `text-dark-400` solo es aceptable sobre `bg-dark-600` o más claro
- En hover de botones con ícono: usar clase `group` en el botón y `group-hover:text-white` en el ícono

### Layout móvil del dashboard — gotchas conocidos

#### `PageHeader` — botón de acción siempre en la misma fila

`src/presentation/components/layout/PageHeader.tsx` usa `flex items-center justify-between`. **No usar** `flex-col sm:flex-row` — en móvil el botón quedaría debajo del título y puede no verse sin scrollear. El patrón correcto es siempre fila horizontal: título truncado a la izquierda (`min-w-0 truncate`), botón con `flex-shrink-0` a la derecha. La descripción se oculta en móvil con `hidden sm:block` para ahorrar espacio.

#### `DashboardLayout` sidebar — altura en móvil

El `aside` del sidebar en móvil tiene `top-16` (header) y **`h-[calc(100vh-8rem)]`** (no `h-full`). Si se usa `h-full`, el sidebar sobrepasa el viewport (`top-16 + 100vh`) y el botón "Cerrar Sesión" (al fondo del `flex col`) queda tapado por el `MobileBottomNav` (`fixed bottom-0 h-16 z-50`). La fórmula es: `100vh − 4rem (header) − 4rem (bottom nav) = calc(100vh-8rem)`.

#### `useSidebar` — comportamiento por dispositivo (sesión 2026-06-05)

| Dispositivo | Modo | Hamburger |
|---|---|---|
| Mobile (< 768px) | Overlay — se abre/cierra sobre el contenido | Abre/cierra el drawer |
| Tablet (768–1279px) | Rail siempre visible — solo íconos (`w-16`) | — |
| Desktop (≥ 1280px) | Expandido con labels (`w-64`) por defecto | **Alterna entre `w-64` y rail `w-16`** |

**Estado por defecto en desktop: rail (`desktopCollapsed = true`).** El hamburger lo expande; al hacer clic en cualquier ítem del menú vuelve automáticamente al rail. Mismo comportamiento que el overlay mobile (cerrar tras navegar).

**Gotcha:** en desktop, `isCollapsed = isTablet || (isDesktop && desktopCollapsed)`. No usar `isCollapsed = isTablet` solamente — en esa versión el hamburger del header en desktop no tenía efecto sobre el ancho del sidebar (solo movía `ml-64` → `ml-0` en el main, dejando el sidebar superpuesto encima del contenido).

**`closeSidebar`** es polimórfico: en desktop pone `desktopCollapsed = true` (vuelve a rail); en mobile pone `isOpen = false` (cierra overlay). Esto permite pasar `closeSidebar` como `onNavigate` tanto en mobile como en desktop sin lógica extra en `DashboardLayout`.

**Márgenes del main content:**
- Desktop expandido: `ml-64`
- Desktop colapsado (rail): `ml-16` — **nunca `ml-0`** en desktop, el sidebar siempre ocupa espacio
- Tablet: `ml-16` (rail fijo)
- Mobile: `ml-0` (overlay, no ocupa espacio)

---

## Expediente Médico — MedicalRecordModal

`src/presentation/components/features/MedicalRecordModal.tsx`

### Layout: sidebar en desktop, tabs en mobile

El modal usa un contenedor `flex` con dos variantes:
- **Desktop (`!isMobile`):** `h-[min(85vh,720px)]` — sidebar fija a la izquierda (`w-52`), contenido scrollable a la derecha (`flex-1 overflow-y-auto`)
- **Mobile (`isMobile`):** `flex-col h-full` — barra de tabs compacta sticky arriba, contenido scrollable abajo

No hay header flotante en desktop — la navegación está integrada en el sidebar y nunca "cruza" el formulario.

### Sidebar (desktop)

Ubicación: `<aside className="w-52 flex-shrink-0 bg-dark-800 border-r border-dark-700 flex flex-col">`:

- **Encabezado:** label "EXPEDIENTE" pequeño, nombre del cliente (`{clientName}`) en bold, ID de cédula (`{clientId}`) en gris abajo
- **Nav:** 4 botones de step con badge numérico (1–4) que se convierte en `✓` dorado cuando el paso está completo
- **Footer del sidebar:** barra de progreso `h-1` + texto "X/3 completados" + botones PDF y Cerrar

### Progreso — lógica de pasos

Función `isStepComplete(tabId)`:
1. `anamnesis` → `!!record.anamnesis`
2. `consentimiento` → `!!(record.consentimiento?.firmaUrl || record.consentimiento?.procedimiento)`
3. `atencion` / `historial` → `!!(record.sesiones?.length)`

### Mobile

Barra de tabs sticky compacta (sin colapso dinámico — se eliminó `headerCollapsed`). Íconos PDF + X siempre visibles a la derecha de los tabs. Barra de progreso gold (`h-0.5`) bajo los tabs.

### Botón PDF

Siempre llama `generateMedicalRecordPDF(record)`:
- Desktop: botón pequeño en el footer del sidebar
- Mobile: ícono `FileText` en la barra de tabs

### Navegación por pasos

4 pasos: **Anamnesis** → **Consentimiento** → **Atención** → **Historial**. Los botones "Continuar a X" avanzan automáticamente al guardar. El usuario puede saltar libremente entre pasos en cualquier momento.

### Anamnesis — preguntas condicionales por género (sesión 2026-06-07)

`MedicalRecordModal` acepta el prop opcional `clientGender?: Gender`. Cuando el valor es `Gender.MALE`, los campos clínicamente irrelevantes para hombres se ocultan:

| Campo oculto | Condición |
|---|---|
| ¿Embarazo o Lactancia? (`embarazoLactancia`) | `clientGender === Gender.MALE` |

El título de la sección también cambia: "Embarazo y Cirugías" → "Cirugías Recientes" para hombres.

**Implementación:**

```tsx
const isMale = clientGender === Gender.MALE;

// En el formulario:
{!isMale && (
  <div>
    <label>¿Embarazo o Lactancia?</label>
    <select value={anamnesis.embarazoLactancia} ...>...</select>
  </div>
)}
```

**Comportamiento por defecto:** cuando `clientGender` es `undefined` (páginas donde el género no está disponible fácilmente — `AppointmentsPage`, `RecordsPage`), `isMale = false` y el campo sigue visible. Es el comportamiento clínicamente seguro: mejor preguntar de más que omitir.

**Quién pasa el género:**
- `ClientDetailPage` → pasa `clientGender={client.gender}` (tiene el objeto cliente completo)
- `AppointmentsPage` y `RecordsPage` → no pasan género (campo visible para todos)

**Para agregar más campos condicionales en el futuro**, usar el mismo patrón `{!isMale && (...)}` o crear variantes `{isMale && (...)}` para campos exclusivos de hombres. Los candidatos obvios: ciclo menstrual, anticonceptivos.

---

## Clientes y Expedientes — Flujo completo (sesión 2026-06-06)

### Auto-creación de expediente al crear cliente

`ClientsPage.tsx` → `handleCreateClient()`: tras `createClient()` exitoso, se llama `medicalRecordService.create(newClient.id, fullName)` en background (`.catch(() => {})`) sin bloquear el flujo ni mostrar toast adicional.

```typescript
const newClient = await createClient(data);
// Expediente en background — no bloquea ni muestra toast extra
medicalRecordService.create(newClient.id, fullName).catch(() => {});
```

**Consecuencia:** todo cliente nuevo tiene expediente creado automáticamente en Firestore (`medicalRecords/{clientId}`) con `sesiones: []`. El `MedicalRecordModal` ya no necesita crear el expediente al abrirse por primera vez para clientes nuevos.

### ClientDetailPage — Acciones Rápidas (actualizado sesión 2026-06-06)

Los 3 botones de "Acciones Rápidas" ahora son funcionales:

| Botón | Acción |
|---|---|
| **Nueva Cita** | `navigate('/dashboard/appointments')` |
| **Ver Expedientes** | `navigate('/dashboard/records')` |
| **Abrir Expediente** (primary) | Abre `MedicalRecordModal` para ese cliente directamente |

**Fix incluido:** breadcrumb `href: '/clients'` y `navigate('/clients')` al eliminar cliente → corregido a `/dashboard/clients`.

### deleteRecord — eliminar expediente completo

`MedicalRecordService.deleteRecord(clientId)` usa `deleteDoc` de Firestore para borrar el documento completo.  
`useMedicalRecords` expone `deleteRecord(clientId)` con toast de éxito y actualización de lista en estado local.

**Nota:** las imágenes en Firebase Storage (`expedientes/{clientId}/...`) **no** se eliminan automáticamente — solo se borra el documento en Firestore. Si se quiere limpiar Storage habría que iterar los paths y llamar `deleteObject` manualmente.

### RecordsPage — eliminar expediente (sesión 2026-06-06)

Cada fila de la tabla tiene un ícono `Trash2` (botón independiente, usa `e.stopPropagation()` para no activar el click de la fila). Al hacer clic abre un `Modal` de confirmación que:
- Muestra el nombre del cliente
- Advierte que la acción no se puede deshacer y que Storage no se limpia
- Botones: Cancelar / Eliminar (con loading state)

---

## Errores TypeScript pre-existentes — Backlog de corrección

Detectados con `npx tsc --noEmit` (sesión 2026-05-29). Todos pre-existentes; ninguno introducido por cambios recientes. Marcar con `[x]` al corregir.

### Prioridad alta — errores funcionales reales

- [x] **`BookingRequestCard.tsx:72,97`** — `BookingRequestRepository.updateStatus` no existe en el tipo → usar instancia singleton `bookingRequestRepository` (sesión 2026-05-29)
- [x] **`BookingRequestCard.tsx:74,99`** — `User.uid` no existe en el tipo de dominio → cambiado a `user.id` (sesión 2026-05-29)
- [x] **`BookingRequestCard.tsx:54`** — variante `"error"` no existe en Badge → cambiado a `"danger"` (sesión 2026-05-29)
- [x] **`PaymentsPage.tsx:187,203`** — prop `tabs` no existe en `TabsProps` → refactorizado a API compuesta `Tabs + TabsList + TabsTrigger` (sesión 2026-05-30)
- [x] **`PaymentsPage.tsx:92`** — variante `"error"` no existe en Badge → cambiado a `"danger"` (sesión 2026-05-30)
- [x] **`ServicesPage.tsx:111`** — `Service.productLines` no existe en el tipo de dominio → eliminado del formData (campo sin mapeo real en el dominio) (sesión 2026-05-30)
- [x] **`ServicesPage.tsx:113`** — tipo de descuento `"fixed"` no asignable a `"percentage" | "2x1"` → narrowing explícito al leer del servicio, fallback a `'percentage'` (sesión 2026-05-30)
- [x] **`ClientCard.tsx:98`** — `client.allergies.length` posiblemente `undefined` → `(client.allergies?.length ?? 0) > 0` (sesión 2026-05-30)
- [x] **`DashboardPage.tsx:154`** — formatter de recharts recibe `ValueType | undefined` pero tipado como `number` → `Number(v)` en lugar de anotación explícita `v: number` (sesión 2026-05-30)
- [x] **`ClientsPage.tsx:42`** — constraint `(...args: unknown[]) => unknown` en `debounce` no acepta funciones con parámetros tipados → cambiado a `any[]` en `shared/utils/index.ts` (sesión 2026-05-30)
- [x] **`AppointmentsPage.tsx:112,242-244,274,615,619,777-782,801,825,837,848`** — 13 comparaciones `AppointmentStatus` vs strings minúscula → corregidas al refactorizar panel de recordatorios (sesión 2026-06-01)
- [x] **`BookingRequestsPage.tsx:136`** — prop `tabs` no existe en `TabsProps` → refactorizado a API compuesta `Tabs + TabsList + TabsTrigger` (sesión 2026-05-31)
- [x] **`BookingRequestsPage.tsx:83`** — prop `subtitle` e `icon` no existen en `PageHeaderProps` → cambiados a `description` (sesión 2026-05-31)
- [x] **`Header.tsx:120,316`** — variante `"error"` no existe en Badge → cambiado a `"danger"` (sesión 2026-06-01)
- [x] **`BookingRequestsPage.tsx:111`** — variante `"error"` no existe en StatsCard → cambiado a `"danger"` (sesión 2026-06-01)

### Prioridad media — comparaciones de tipo sin overlap (`TS2367`)

Causa probable: `AppointmentStatus` es un enum o union con valores capitalizados (`PENDING`, `CONFIRMED`, etc.) pero se compara con strings en minúscula.

- [x] **`AIAgentService.ts:200`** — `AppointmentStatus` vs `'cancelled'` → usar `AppointmentStatus.CANCELLED` (sesión 2026-05-30)
- [x] **`CalendarMonthView.tsx:74-76`** — `AppointmentStatus` vs `'pending'`, `'confirmed'`, `'completed'` → usar `AppointmentStatus.PENDING/CONFIRMED/COMPLETED` (sesión 2026-05-30)
- [x] **`ReminderPanel.tsx:34`** — comparación con tipo incompatible → mismo patrón (sesión 2026-05-30)

### Prioridad media — exports / módulos rotos

- [x] **`features/index.ts:2`** — `ServiceCardProps` no existía como export → agregado `export` a la interfaz en `ServiceCard.tsx` (sesión 2026-05-30)
- [x] **`main.tsx:1-2`** — `allowSyntheticDefaultImports` requerido para React; `ReactDOM` sin default export → agregado flag en `tsconfig.json` + cambiado a `import { createRoot }` (sesión 2026-05-30)
- [x] **`i18n.config.ts:16-27`** — mismo problema de `allowSyntheticDefaultImports` para los 10 archivos de locales → resuelto con el flag en `tsconfig.json` (sesión 2026-05-30)

### Prioridad media — conflictos de tipo en componentes UI base

Causa: Framer Motion define `onDrag` como `(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void`, pero React lo define como `DragEventHandler<T>`. Al extender `HTMLMotionProps` en los wrappers de UI el tipo entra en conflicto.

- [ ] **`Alert.tsx:58`** — `onDrag` incompatible entre `HTMLMotionProps<"div">` y `HTMLAttributes<div>` → usar `Omit<HTMLMotionProps<'div'>, 'onDrag'>` en la firma del componente
- [ ] **`Button.tsx:47`** — mismo conflicto en `HTMLMotionProps<"button">` → `Omit<HTMLMotionProps<'button'>, 'onDrag'>`
- [ ] **`Card.tsx:43`** — mismo conflicto en `HTMLMotionProps<"div">` → `Omit<HTMLMotionProps<'div'>, 'onDrag'>`
- [ ] **`Switch.tsx:4`** — prop `size` tipo `"sm" | "md" | "lg"` choca con `HTMLInputElement.size: number` → renombrar prop a `sizeVariant` o usar `Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>`

### Prioridad baja — imports/variables no usadas (`TS6133`)

Limpieza cosmética — no afectan funcionalidad. Agrupar en una sola sesión de limpieza.

- [x] **`AppointmentRepository.ts:14,21`** — eliminados imports `Query`, `AppointmentWithDetails` (sesión 2026-05-30)
- [x] **`AIAgentService.ts:151-153,238`** — parámetros TODO sin usar → prefijo `_` (convención TS para params intencionalmente no usados) (sesión 2026-05-30)
- [x] **`MedicalRecordService.ts:10`** — eliminado import `where` (sesión 2026-05-30)
- [x] **`AppointmentForm.tsx:59`** — eliminado `user` de la desestructuración e import `useAuth` (sesión 2026-05-30)
- [ ] **`BookingRequestCard.tsx:17`** — eliminar import `User`
- [x] **`CalendarMonthView.tsx:2`** — eliminar import `Calendar` (sesión 2026-05-30)
- [x] **`ClientCard.tsx:2`** — eliminar import `User` (sesión 2026-05-30)
- [x] **`MedicalRecordModal.tsx:7,31,38-39`** — eliminados imports `MEDICAMENTOS_PIEL`, `ACTIVOS_COSMETICOS`, `TRATAMIENTOS_PREVIOS`, `FOTOTIPOS`, `TIPOS_PIEL` y vars `updateSession`, `setEditingSessionId`, `sessionToDelete`, `setSessionToDelete` (sesión 2026-05-30)
- [x] **`RecordsPage.tsx:7-8`** — eliminados imports `FileText`, `motion` (sesión 2026-05-30)
- [x] **`ClientDetailPage.tsx:39`** — eliminado `hasPermission` e import `useAuth` (sesión 2026-05-30)
- [x] **`ClientsPage.tsx:21,28`** — eliminados `hasPermission`, `deleteClient` e import `useAuth` (sesión 2026-05-30)
- [x] **`PaymentsPage.tsx:30`** — eliminar `payments` (sesión 2026-05-30)
- [x] **`UsersPage.tsx:8`** — eliminado `getManageableRoles` (sesión 2026-05-30)
- [x] **`service-worker.ts:19-20`** — eliminadas constantes `OFFLINE_PAGE`, `OFFLINE_IMAGE` (sesión 2026-05-30)
- [x] **`pdfGenerator.ts:2`** — eliminado import `autoTable` (sesión 2026-05-30)

---

## Dashboard — DashboardService (sesión 2026-06-06)

Archivo: `src/core/infrastructure/services/DashboardService.ts`

### Arquitectura

Carga 4 colecciones completas en paralelo al montar (`Promise.all`): `clients`, `appointments`, `payments`, `services`. Todos los cálculos son **client-side** — no hay aggregations en Firestore. Es aceptable para el volumen actual del spa.

### Bugs corregidos (sesión 2026-06-06)

| Stat | Antes | Después |
|---|---|---|
| **Ocupación %** | `/ 32` → siempre < 25% | `/ 8` — 8 slots de 90 min (09:00–21:00) |
| **Citas hoy / semana / mes** | Contaba canceladas | Excluye `CANCELLED` |
| **Semanas en `countAppointmentsThisWeek`** | Sin límite superior → contaba semanas futuras | Acotado a `start → start+7` |
| **Confirmación %** | Solo `CONFIRMED` | `CONFIRMED + COMPLETED + IN_PROGRESS` vs total no-canceladas |
| **Servicios populares** | Solo `COMPLETED` → vacío si el mes recién empieza | Incluye `CONFIRMED + IN_PROGRESS + COMPLETED` |
| **Próximas citas** | Desde mañana → hoy invisible | Desde hoy (`today`) + 3 días |
| **Gráfico citas/semana** | Contaba canceladas | Excluye `CANCELLED` |

### Enums de estado — dónde viven

**`AppointmentStatus`** — `src/core/domain/enums/index.ts`:
`PENDING · CONFIRMED · IN_PROGRESS · COMPLETED · CANCELLED · NO_SHOW`

**`PaymentStatus`** — `src/core/domain/interfaces/Payment.ts` ← el activo, usado en todo el proyecto:
`PENDING · PROCESSING · COMPLETED · FAILED · REFUNDED · CANCELLED`

> `PaymentStatus` duplicado en `enums/index.ts` (valores `PAID`, `PARTIAL`) fue eliminado en sesión 2026-06-06 — era código muerto que nunca coincidiría con datos en Firestore.

---

## Sistema de Pagos (sesión 2026-06-06)

### Flujo principal

```
Cita COMPLETED + botón "Cobrar" (AppointmentsPage)
  → PaymentForm (modal)
  → paymentRepository.create() → status PENDING
  → paymentRepository.updateStatus() → status COMPLETED
  → aparece en PaymentsPage y en DashboardService stats
```

### Cómo los pagos se reflejan en el dashboard

`DashboardService.getStats()` carga todos los pagos y calcula client-side:

| Stat del dashboard | Fuente |
|---|---|
| **Ingresos del Mes** (`revenueCRC`) | Pagos `COMPLETED` con `createdAt >= 1° del mes`, suma `amountCRC` |
| **Tendencia ingresos** | Diferencia revenue este mes vs mes anterior |
| **Gráfico Ingresos por mes** | Revenue `COMPLETED` agrupado por mes (últimos 6 meses) |
| **Alerta pagos pendientes** | Pagos `PENDING`, ordenados por días sin cobrar |
| **Clientes VIP** | Top clientes por `amountCRC` acumulado en pagos `COMPLETED` |

Pagos `REFUNDED` quedan **automáticamente excluidos** del revenue: cuando se reembolsa un pago su status cambia a `REFUNDED`, y los filtros solo cuentan `COMPLETED`.

### PaymentForm — restricciones de diseño

- **Solo muestra citas `COMPLETED`** — flujo intencional: primero se atiende y completa la cita, luego se cobra. Botón "Cobrar" solo aparece en estado `COMPLETED` en `AppointmentsPage`.
- **Solo SINPE Móvil activo** — Tarjeta y Efectivo aparecen en la UI como "Próximo" (disabled). No están implementados. Si se agrega un nuevo método de pago, actualizar `PaymentForm.handleSubmit()` y el selector de método.
- **Moneda hardcoded a CRC** — el spa opera en colones. El campo `amountUSD` se guarda desde `service.priceUSD` pero no se usa en cálculos del dashboard.

### Validación de duplicados — sin idempotencia fuerte

El filtro de "citas sin pago" en `PaymentForm.loadOptions()` es:
```typescript
const paidAptIds = new Set(allPayments.map(p => p.appointmentId));
const unpaid = allApts.filter(a =>
  a.status === AppointmentStatus.COMPLETED && !paidAptIds.has(a.id)
);
```
Si la cita ya tiene un pago registrado, desaparece del selector. Si alguien registra pago mientras otro admin también lo hace simultáneamente, pueden crearse duplicados. Aceptable para el volumen actual del spa (staff pequeño).

### Bugs corregidos (sesión 2026-06-06)

| Archivo | Bug | Fix |
|---|---|---|
| `PaymentsPage.tsx` | Spinner de carga renderizado fuera de `DashboardLayout` (sin sidebar/header) | Spinner ahora dentro del layout |
| `PaymentsPage.tsx` | `PaymentStatus.CANCELLED` sin badge ni tab de filtro | Badge "Cancelado" y tab agregados |
| `PaymentsPage.tsx` | Monto USD sin formatear: `$${amountUSD}` mostraba número crudo | `toLocaleString('en-US')`, oculto si `amountUSD === 0` |
| `PaymentForm.tsx` | Comparación muerta `(a.status as string) === 'completed'` (minúscula nunca coincide con enum uppercase) | Eliminada, filtro simplificado |

---

## Consolidación de Clientes por Cédula (sesión 2026-06-07)

### Modelo de identidad

El **número de cédula** es el identificador único de un cliente en todo el sistema:

| Colección | Document ID | Vínculo |
|---|---|---|
| `clients` | cédula (cuando se crea vía consolidación) | = `Appointment.clientId` |
| `medicalRecords` | cédula | = `Appointment.clientId` |
| `appointments` | auto-generated | `.clientId` = cédula |

**Backward compatibility:** `ClientRepository.create()` acepta `cedula` opcional en el DTO. Si no se provee, usa `generateId()` (clientes creados antes de esta sesión conservan su UUID).

### ClientConsolidationService

`src/core/application/services/ClientConsolidationService.ts`

Función central: `ensureClientExists(cedula, fullName, phoneNumber, email?, gender?)`.

**Lógica:**
- Llama `clientRepository.getById(cedula)` — busca por ID directo (O(1), sin query)
- **Cédula nueva** → `clientRepository.create({ cedula, ... })` + `medicalRecordService.create(cedula, fullName)` → expediente vacío listo para atención
- **Cédula existente** → `clientRepository.incrementVisits(cedula)` → actualiza `totalVisits` y `lastVisit`
- Retorna `{ client, clientCreated, recordCreated }`

**Notas de implementación:**
- `firstName` / `lastName` se derivan del `fullName` dividiéndolo por espacios. Si el cliente ya existe con datos completos, no se sobreescriben.
- `dateOfBirth` se inicializa como placeholder `2000-01-01` — el admin completa el expediente después.
- Si `medicalRecordService.create()` falla (el expediente ya existe), el error se atrapa silenciosamente para no bloquear el flujo.

### Puntos de disparo

**1. `AppointmentForm.tsx` — creación manual de cita**
```typescript
const id = await createAppointment(appointmentData);
if (id) {
  ensureClientExists(data.clientId, clientName, clientPhone).catch(() => {});
  onSuccess?.();
}
```
Se dispara en background al crear cualquier cita desde el dashboard.

**2. `ConfirmBookingModal.tsx` — confirmación de BookingRequest**

Modal nuevo en `src/presentation/components/features/ConfirmBookingModal.tsx`.

Flujo al confirmar una solicitud:
1. Admin ingresa la cédula del cliente
2. `ensureClientExists(cedula, name, phone, email)` — consolida cliente y expediente
3. `appointmentRepository.create(...)` — crea la cita en Firestore automáticamente (ya no es manual)
4. `bookingRequestRepository.updateStatus(CONFIRMED, appointmentId)` — vincula la solicitud con la cita
5. Abre WhatsApp con mensaje de confirmación prellenado

`BookingRequestCard` ya no tiene el TODO de "crear cita manualmente" — se hace todo en el modal.

### ClientForm — campo cédula

`ClientForm.tsx` tiene ahora un campo **Número de Cédula** al inicio del formulario:
- **Al crear:** opcional, pero si se ingresa se usa como document ID → cliente queda vinculado al sistema de citas
- **Al editar:** campo deshabilitado (la cédula no cambia)
- Prop `hint` explica al admin su propósito

### Datos iniciales del cliente auto-creado

Cuando `ensureClientExists` crea un cliente nuevo, los datos mínimos son:

| Campo | Valor |
|---|---|
| `id` | cédula (document ID) |
| `cedula` | cédula |
| `firstName` | primera palabra del nombre completo |
| `lastName` | resto del nombre (o "Sin apellido") |
| `phoneNumber` | teléfono del formulario de cita/booking |
| `email` | email del booking (o `''` si cita manual) |
| `dateOfBirth` | `2000-01-01` (placeholder — completar en expediente) |
| `gender` | `FEMALE` (default — actualizar en perfil) |
| `totalVisits` | `1` (se incrementa en visitas siguientes) |

El admin puede completar los datos faltantes en `/dashboard/clients/{cedula}`.

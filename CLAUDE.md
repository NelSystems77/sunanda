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
├── FeaturedServices.tsx     — servicios destacados + 3 tarjetas super premium (Glow Force, Hydraluronic, Expert Lab Peeling)
├── ProductSpotlight.tsx     — productos Germaine de Capuccini (2 tarjetas: Radiance C+ y Hydraluronic)
├── TreatmentDetails.tsx     — modal con tabs por tratamiento
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
7. `TreatmentDetails` — catálogo con modal tabs
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

### Flujo de recordatorio manual WhatsApp

1. Al cargar `AppointmentsPage`, se consultan citas de los **próximos 7 días** con `reminderSent: false` y estado `pending` o `confirmed`
2. El badge del botón "Recordatorios" muestra el conteo real
3. Al hacer clic en "WhatsApp" en el modal, se abre `wa.me/506XXXXXXXX` con mensaje personalizado
4. Luego se llama `markReminderSent()` — la cita desaparece de la lista

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

Todo lo demás: denegado
```

### Estructura de paths en Storage

| Path | Contenido |
|---|---|
| `expedientes/{clientId}/{sessionId}/antes/{fileName}` | Foto "antes" de sesión |
| `expedientes/{clientId}/{sessionId}/despues/{fileName}` | Foto "después" de sesión |
| `expedientes/{clientId}/firmas/{fileName}` | Firma digital del consentimiento |

### Servicio de subida

`src/core/infrastructure/services/MedicalRecordService.ts`:
- `uploadImage(file, clientId, sessionId, type)` — comprime a máx 500 KB / 1920px antes de subir
- `uploadSignature(dataUrl, clientId)` — convierte dataURL a Blob y sube como PNG

### Despliegue de reglas

```bash
firebase deploy --only storage   # solo Storage
firebase deploy --only firestore  # solo Firestore
firebase deploy                   # todo (hosting + firestore + storage)
```

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

- `SPA_SCHEDULE` (en `AvailabilityService.ts`): horario 09:00–21:00, paso entre slots 30 min
- `displaySlots` (useMemo): decide qué lista mostrar en `TimeSlotSelector`
- El botón "Crear Cita" permanece deshabilitado hasta que se seleccione un slot

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

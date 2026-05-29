/**
 * Constantes de la aplicación SUNANDA
 */
export const APP_CONFIG = {
  NAME: 'SUNANDA Estética y Spa',
  SHORT_NAME: 'SUNANDA Spa',
  DESCRIPTION: 'Cuidado profesional para tu piel y tu cuerpo',
  VERSION: '1.0.0',
  BASE_URL: 'https://sunanda-spa.vercel.app',
  WHATSAPP_NUMBER: '+50688083390',
  WHATSAPP_URL: 'https://wa.me/50688083390',
  FACEBOOK_URL: 'https://www.facebook.com/people/Sunanda-Spa-Est%C3%A9tica/61581631049645/',
  INSTAGRAM_URL: 'https://www.instagram.com/sunanda_spa_y_estetica?utm_source=qr',
  TIKTOK_URL: 'https://www.tiktok.com/@sunanda.spa_estetica2?_r=1&_t=ZS-96c5N2tma2B',
  EMAIL: 'greje00@hotmail.com',
  PHONE: '+506 8808-3390',
  PHONE_E164: '+50688083390',
  ADDRESS: 'Guadalupe, San José, Costa Rica',
  // Reemplazar con imagen real 1200×630px para compartir en redes sociales
  OG_IMAGE_URL: 'https://sunanda-spa.vercel.app/assets/images/og-image.jpg',
} as const;

/**
 * Configuración de horarios de atención
 */
export const BUSINESS_HOURS = {
  MONDAY: { start: '09:00', end: '18:00', enabled: true },
  TUESDAY: { start: '09:00', end: '18:00', enabled: true },
  WEDNESDAY: { start: '09:00', end: '18:00', enabled: true },
  THURSDAY: { start: '09:00', end: '18:00', enabled: true },
  FRIDAY: { start: '09:00', end: '18:00', enabled: true },
  SATURDAY: { start: '09:00', end: '14:00', enabled: true },
  SUNDAY: { start: '09:00', end: '14:00', enabled: false },
} as const;

/**
 * Configuración de citas
 */
export const APPOINTMENT_CONFIG = {
  MIN_DURATION: 30, // minutos
  SLOT_INTERVAL: 15, // minutos
  MAX_ADVANCE_BOOKING_DAYS: 90,
  MIN_ADVANCE_BOOKING_HOURS: 2,
  REMINDER_HOURS_BEFORE: 24,
} as const;

/**
 * Configuración de pagos
 */
export const PAYMENT_CONFIG = {
  DEFAULT_CURRENCY: 'CRC',
  ACCEPTED_CURRENCIES: ['CRC', 'USD'],
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
} as const;

/**
 * Límites de archivos
 */
export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ACCEPTED_DOCUMENT_TYPES: ['application/pdf'],
} as const;

/**
 * Rutas de la aplicación
 */
export const ROUTES = {
  // Rutas públicas
  HOME: '/',
  LOGIN: '/login',
  
  // Rutas protegidas (Dashboard Admin)
  DASHBOARD: '/dashboard',
  CLIENTS: '/dashboard/clients',
  APPOINTMENTS: '/dashboard/appointments',
  SERVICES: '/dashboard/services',
  MEDICAL_RECORDS: '/dashboard/records',
  INVENTORY: '/dashboard/inventory',
  PAYMENTS: '/dashboard/payments',
  REPORTS: '/dashboard/reports',
  USERS: '/dashboard/users',
  BOOKING_REQUESTS: '/dashboard/booking-requests',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
} as const;

/**
 * Roles del sistema (para referencia rápida)
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  RECEPCIONISTA: 'RECEPCIONISTA',
  ESTETICISTA: 'ESTETICISTA',
} as const;

/**
 * Colecciones de Firestore
 */
export const COLLECTIONS = {
  USERS: 'users',
  CLIENTS: 'clients',
  APPOINTMENTS: 'appointments',
  SERVICES: 'services',
  MEDICAL_RECORDS: 'medicalRecords',
  PAYMENTS: 'payments',
  PRODUCTS: 'products',
  INVENTORY_MOVEMENTS: 'inventoryMovements',
} as const;

/**
 * Mensajes de validación
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  INVALID_EMAIL: 'Correo electrónico inválido',
  INVALID_PHONE: 'Número de teléfono inválido',
  MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Máximo ${max} caracteres`,
  INVALID_DATE: 'Fecha inválida',
  INVALID_TIME: 'Hora inválida',
  MIN_VALUE: (min: number) => `Valor mínimo: ${min}`,
  MAX_VALUE: (max: number) => `Valor máximo: ${max}`,
} as const;

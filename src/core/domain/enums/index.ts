/**
 * Estados de citas
 */
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

/**
 * Tipo de servicios
 */
export enum ServiceType {
  FACIAL = 'FACIAL',
  CORPORAL = 'CORPORAL',
  COMBO = 'COMBO',
}

/**
 * Categorías de servicios faciales
 */
export enum FacialCategory {
  LIMPIEZA_BASICA = 'LIMPIEZA_BASICA',
  LIMPIEZA_PROFUNDA = 'LIMPIEZA_PROFUNDA',
  PIEL_GRASA = 'PIEL_GRASA',
  PIEL_SECA = 'PIEL_SECA',
  PIEL_DESHIDRATADA = 'PIEL_DESHIDRATADA',
  PIEL_SENSIBLE = 'PIEL_SENSIBLE',
}

/**
 * Categorías de servicios corporales
 */
export enum CorporalCategory {
  HIDROLIPOCLASIA = 'HIDROLIPOCLASIA',
  DRENAJE_LINFATICO = 'DRENAJE_LINFATICO',
  REDUCTIVO = 'REDUCTIVO',
  ADIPOSIDAD_LOCALIZADA = 'ADIPOSIDAD_LOCALIZADA',
  CELULITIS = 'CELULITIS',
  FLACIDEZ = 'FLACIDEZ',
}

/**
 * Métodos de pago
 */
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  SINPE = 'SINPE',
  TRANSFER = 'TRANSFER',
}

/**
 * Estados de pago
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

/**
 * Tipos de productos en inventario
 */
export enum ProductType {
  TREATMENT = 'TREATMENT',
  RETAIL = 'RETAIL',
  CONSUMABLE = 'CONSUMABLE',
}

/**
 * Género
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

// Export from separate files
export { ServiceCategory, getServiceCategoryText, getServiceCategoryIcon } from './serviceCategory';

/**
 * Categorías de servicios del spa
 */
export enum ServiceCategory {
  FACIAL = 'facial',
  CORPORAL = 'corporal',
  PAQUETE = 'paquete'
}

/**
 * Obtener texto de categoría
 */
export function getServiceCategoryText(category: ServiceCategory): string {
  switch (category) {
    case ServiceCategory.FACIAL:
      return 'Facial';
    case ServiceCategory.CORPORAL:
      return 'Corporal';
    case ServiceCategory.PAQUETE:
      return 'Paquete';
    default:
      return category;
  }
}

/**
 * Obtener icono de categoría
 */
export function getServiceCategoryIcon(category: ServiceCategory): string {
  switch (category) {
    case ServiceCategory.FACIAL:
      return '✨';
    case ServiceCategory.CORPORAL:
      return '💆';
    case ServiceCategory.PAQUETE:
      return '🎁';
    default:
      return '🌸';
  }
}

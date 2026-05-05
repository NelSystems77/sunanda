import { ServiceCategory } from '../enums/serviceCategory';

/**
 * Interfaz de Servicio
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  
  // Precio y duración
  priceCRC: number; // Precio en colones
  priceUSD: number; // Precio en dólares (calculado automáticamente)
  duration: number; // en minutos
  sessions: number; // número de sesiones
  
  // Promociones
  hasPromotion: boolean;
  promotionType?: 'percentage' | '2x1' | 'fixed'; // tipo de promoción
  promotionValue?: number; // valor del descuento
  promotionDescription?: string; // descripción de la promo
  promotionValidUntil?: Date; // fecha límite
  
  // Información adicional
  benefits?: string[];
  contraindications?: string[];
  recommendedFrequency?: string;
  brand?: string; // Marca (ej: Germaine de Capuccini)
  
  // Productos utilizados
  productsUsed?: string[]; // IDs de productos del inventario
  
  // Estado
  isActive: boolean;
  
  // Imágenes
  imageURL?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear servicio
 */
export interface CreateServiceDTO {
  name: string;
  description: string;
  category: ServiceCategory;
  priceCRC: number;
  duration: number;
  sessions?: number;
  hasPromotion?: boolean;
  promotionType?: 'percentage' | '2x1' | 'fixed';
  promotionValue?: number;
  promotionDescription?: string;
  promotionValidUntil?: Date;
  benefits?: string[];
  contraindications?: string[];
  recommendedFrequency?: string;
  brand?: string;
  productsUsed?: string[];
  imageURL?: string;
}

/**
 * DTO para actualizar servicio
 */
export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  category?: ServiceCategory;
  priceCRC?: number;
  duration?: number;
  sessions?: number;
  hasPromotion?: boolean;
  promotionType?: 'percentage' | '2x1' | 'fixed';
  promotionValue?: number;
  promotionDescription?: string;
  promotionValidUntil?: Date;
  benefits?: string[];
  contraindications?: string[];
  recommendedFrequency?: string;
  brand?: string;
  productsUsed?: string[];
  isActive?: boolean;
  imageURL?: string;
}

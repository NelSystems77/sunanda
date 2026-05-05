import { z } from 'zod';
import { ServiceCategory } from '../../domain/enums/serviceCategory';

/**
 * Schema para crear servicio
 */
export const createServiceSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  
  category: z.nativeEnum(ServiceCategory, {
    errorMap: () => ({ message: 'Categoría inválida' })
  }),
  
  priceCRC: z.number()
    .min(1000, 'El precio mínimo es ₡1,000')
    .max(1000000, 'El precio máximo es ₡1,000,000'),
  
  duration: z.number()
    .min(15, 'La duración mínima es 15 minutos')
    .max(480, 'La duración máxima es 8 horas'),
  
  sessions: z.number()
    .min(1, 'Debe haber al menos 1 sesión')
    .max(20, 'El máximo es 20 sesiones')
    .optional()
    .default(1),
  
  hasPromotion: z.boolean().optional().default(false),
  
  promotionType: z.enum(['percentage', '2x1', 'fixed']).optional(),
  
  promotionValue: z.number()
    .min(0)
    .max(100)
    .optional(),
  
  promotionDescription: z.string()
    .max(200, 'La descripción de promoción no puede exceder 200 caracteres')
    .optional(),
  
  promotionValidUntil: z.date().optional(),
  
  benefits: z.array(z.string()).optional(),
  
  contraindications: z.array(z.string()).optional(),
  
  recommendedFrequency: z.string()
    .max(100)
    .optional(),
  
  brand: z.string()
    .max(50)
    .optional(),
  
  productsUsed: z.array(z.string()).optional(),
  
  imageURL: z.string()
    .refine(
      (val) => {
        if (!val) return true; // opcional
        // Acepta URLs normales o Base64 (data:image/...)
        return val.startsWith('http') || val.startsWith('data:image/') || val.length <= 10; // emoticon
      },
      { message: 'Debe ser una URL válida, imagen Base64 o emoticon' }
    )
    .optional()
}).refine(
  (data) => {
    // Si tiene promoción, debe tener tipo y valor
    if (data.hasPromotion) {
      return data.promotionType && (data.promotionValue !== undefined || data.promotionType === '2x1');
    }
    return true;
  },
  {
    message: 'Si el servicio tiene promoción, debe especificar tipo y valor',
    path: ['hasPromotion']
  }
);

/**
 * Schema para actualizar servicio
 */
export const updateServiceSchema = z.object({
  name: z.string()
    .min(3)
    .max(100)
    .optional(),
  
  description: z.string()
    .min(10)
    .max(500)
    .optional(),
  
  category: z.nativeEnum(ServiceCategory).optional(),
  
  priceCRC: z.number()
    .min(1000)
    .max(1000000)
    .optional(),
  
  duration: z.number()
    .min(15)
    .max(480)
    .optional(),
  
  sessions: z.number()
    .min(1)
    .max(20)
    .optional(),
  
  hasPromotion: z.boolean().optional(),
  
  promotionType: z.enum(['percentage', '2x1', 'fixed']).optional(),
  
  promotionValue: z.number()
    .min(0)
    .max(100)
    .optional(),
  
  promotionDescription: z.string()
    .max(200)
    .optional(),
  
  promotionValidUntil: z.date().optional(),
  
  benefits: z.array(z.string()).optional(),
  
  contraindications: z.array(z.string()).optional(),
  
  recommendedFrequency: z.string()
    .max(100)
    .optional(),
  
  brand: z.string()
    .max(50)
    .optional(),
  
  productsUsed: z.array(z.string()).optional(),
  
  isActive: z.boolean().optional(),
  
  imageURL: z.string()
    .refine(
      (val) => {
        if (!val) return true;
        return val.startsWith('http') || val.startsWith('data:image/') || val.length <= 10;
      },
      { message: 'Debe ser una URL válida, imagen Base64 o emoticon' }
    )
    .optional()
});

/**
 * Schema para filtros de búsqueda
 */
export const serviceFiltersSchema = z.object({
  category: z.nativeEnum(ServiceCategory).optional(),
  isActive: z.boolean().optional(),
  hasPromotion: z.boolean().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  searchTerm: z.string().optional()
}).refine(
  (data) => {
    // Validar que minPrice <= maxPrice
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.minPrice <= data.maxPrice;
    }
    return true;
  },
  {
    message: 'El precio mínimo debe ser menor o igual al máximo',
    path: ['maxPrice']
  }
);

/**
 * Tipos inferidos de los schemas
 */
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ServiceFilters = z.infer<typeof serviceFiltersSchema>;

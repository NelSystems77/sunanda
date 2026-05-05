import { ProductType } from '../enums';

/**
 * Interfaz de Producto en Inventario
 */
export interface Product {
  id: string;
  
  // Información básica
  name: string;
  brand: string;
  description?: string;
  type: ProductType;
  
  // SKU e identificación
  sku?: string;
  barcode?: string;
  
  // Inventario
  quantity: number;
  minStock: number;
  maxStock?: number;
  unit: string; // 'ml', 'gr', 'unidad', etc.
  
  // Precios
  cost: number; // Costo de adquisición
  price?: number; // Precio de venta (si aplica)
  
  // Proveedor
  supplier?: string;
  supplierContact?: string;
  
  // Ubicación
  location?: string;
  
  // Fechas
  expirationDate?: Date;
  purchaseDate?: Date;
  
  // Estado
  isActive: boolean;
  
  // Imágenes
  imageURL?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastRestockDate?: Date;
}

/**
 * DTO para crear producto
 */
export interface CreateProductDTO {
  name: string;
  brand: string;
  description?: string;
  type: ProductType;
  sku?: string;
  barcode?: string;
  quantity: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  cost: number;
  price?: number;
  supplier?: string;
  supplierContact?: string;
  location?: string;
  expirationDate?: Date;
  purchaseDate?: Date;
  imageURL?: string;
}

/**
 * DTO para actualizar producto
 */
export interface UpdateProductDTO {
  name?: string;
  brand?: string;
  description?: string;
  type?: ProductType;
  sku?: string;
  barcode?: string;
  quantity?: number;
  minStock?: number;
  maxStock?: number;
  unit?: string;
  cost?: number;
  price?: number;
  supplier?: string;
  supplierContact?: string;
  location?: string;
  expirationDate?: Date;
  isActive?: boolean;
  imageURL?: string;
}

/**
 * Movimiento de inventario
 */
export interface InventoryMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  performedBy: string;
  createdAt: Date;
  notes?: string;
}

/**
 * DTO para registrar movimiento
 */
export interface CreateInventoryMovementDTO {
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  notes?: string;
}

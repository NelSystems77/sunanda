/**
 * Payment Interface
 * 
 * Sistema de pagos preparado para:
 * - Stripe (tarjetas de crédito/débito)
 * - SINPE Móvil (transferencias bancarias CR)
 * - Efectivo (pago en sitio)
 * 
 * Estados: PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED, CANCELLED
 */

export interface Payment {
  // ID
  id: string;

  // Vinculación
  appointmentId: string;
  clientId: string;
  serviceId: string;

  // Montos
  amountCRC: number;
  amountUSD: number;
  currency: 'CRC' | 'USD';

  // Método de pago
  paymentMethod: PaymentMethod;
  
  // Estado
  status: PaymentStatus;

  // Stripe specific (si aplica)
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
  last4?: string;
  cardBrand?: string;
  
  // SINPE specific (si aplica)
  sinpeTransactionId?: string;
  sinpePhoneNumber?: string;
  sinpeReference?: string;
  
  // Efectivo specific (si aplica)
  cashReceivedBy?: string;
  
  // Metadata
  description: string;
  invoiceNumber?: string;
  receiptUrl?: string;
  
  // Información adicional
  notes?: string;
  
  // Reembolso (si aplica)
  refundedAmount?: number;
  refundedAt?: Date;
  refundReason?: string;
  refundedBy?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  
  // Usuario que procesó
  processedBy: string;
}

export enum PaymentMethod {
  STRIPE_CARD = 'STRIPE_CARD',
  SINPE_MOVIL = 'SINPE_MOVIL',
  CASH = 'CASH',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

// DTO para crear un nuevo pago
export interface CreatePaymentDTO {
  appointmentId: string;
  clientId: string;
  serviceId: string;
  amountCRC: number;
  amountUSD: number;
  currency: 'CRC' | 'USD';
  paymentMethod: PaymentMethod;
  description: string;
  notes?: string;
  processedBy: string;
  
  // Stripe (si aplica)
  stripePaymentMethodId?: string;
  
  // SINPE (si aplica)
  sinpePhoneNumber?: string;
  
  // Efectivo (si aplica)
  cashReceivedBy?: string;
}

// DTO para actualizar estado del pago
export interface UpdatePaymentStatusDTO {
  status: PaymentStatus;
  
  // Stripe
  stripePaymentIntentId?: string;
  last4?: string;
  cardBrand?: string;
  
  // SINPE
  sinpeTransactionId?: string;
  sinpeReference?: string;
  
  // General
  invoiceNumber?: string;
  receiptUrl?: string;
  completedAt?: Date;
  failedAt?: Date;
  notes?: string;
}

// DTO para reembolso
export interface RefundPaymentDTO {
  amount?: number;
  reason: string;
  refundedBy: string;
}

// Filtros para búsqueda de pagos
export interface PaymentFilters {
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  clientId?: string;
  appointmentId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Estadísticas de pagos
export interface PaymentStats {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
  
  totalAmountCRC: number;
  totalAmountUSD: number;
  
  byMethod: {
    stripe: number;
    sinpe: number;
    cash: number;
  };
}

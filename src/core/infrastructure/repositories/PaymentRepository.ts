/**
 * PaymentRepository
 * 
 * Gestiona los pagos en Firestore
 * Preparado para integración con Stripe y SINPE Móvil
 * 
 * Colección: payments
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
  CreatePaymentDTO,
  UpdatePaymentStatusDTO,
  RefundPaymentDTO,
  PaymentFilters,
  PaymentStats,
} from '@/core/domain/interfaces/Payment';

const COLLECTION_NAME = 'payments';

export class PaymentRepository {
  /**
   * Crear un nuevo pago
   */
  async create(dto: CreatePaymentDTO): Promise<string> {
    try {
      const newPayment = {
        appointmentId: dto.appointmentId,
        clientId: dto.clientId,
        serviceId: dto.serviceId,
        amountCRC: dto.amountCRC,
        amountUSD: dto.amountUSD,
        currency: dto.currency,
        paymentMethod: dto.paymentMethod,
        status: PaymentStatus.PENDING,
        description: dto.description,
        notes: dto.notes,
        processedBy: dto.processedBy,
        
        // Stripe
        stripePaymentMethodId: dto.stripePaymentMethodId,
        
        // SINPE
        sinpePhoneNumber: dto.sinpePhoneNumber,
        
        // Cash
        cashReceivedBy: dto.cashReceivedBy,
        
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newPayment);
      return docRef.id;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  /**
   * Obtener un pago por ID
   */
  async getById(id: string): Promise<Payment | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        completedAt: data.completedAt?.toDate(),
        failedAt: data.failedAt?.toDate(),
        refundedAt: data.refundedAt?.toDate(),
      } as Payment;
    } catch (error) {
      console.error('Error getting payment:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los pagos
   */
  async getAll(): Promise<Payment[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          completedAt: data.completedAt?.toDate(),
          failedAt: data.failedAt?.toDate(),
          refundedAt: data.refundedAt?.toDate(),
        } as Payment;
      });
    } catch (error) {
      console.error('Error getting all payments:', error);
      throw error;
    }
  }

  /**
   * Obtener pagos por cliente
   */
  async getByClient(clientId: string): Promise<Payment[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          completedAt: data.completedAt?.toDate(),
          failedAt: data.failedAt?.toDate(),
          refundedAt: data.refundedAt?.toDate(),
        } as Payment;
      });
    } catch (error) {
      console.error('Error getting payments by client:', error);
      throw error;
    }
  }

  /**
   * Obtener pagos por cita
   */
  async getByAppointment(appointmentId: string): Promise<Payment[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('appointmentId', '==', appointmentId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          completedAt: data.completedAt?.toDate(),
          failedAt: data.failedAt?.toDate(),
          refundedAt: data.refundedAt?.toDate(),
        } as Payment;
      });
    } catch (error) {
      console.error('Error getting payments by appointment:', error);
      throw error;
    }
  }

  /**
   * Actualizar estado del pago
   */
  async updateStatus(
    id: string,
    dto: UpdatePaymentStatusDTO
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      const updateData: any = {
        status: dto.status,
        updatedAt: Timestamp.now(),
      };

      if (dto.stripePaymentIntentId) {
        updateData.stripePaymentIntentId = dto.stripePaymentIntentId;
      }

      if (dto.last4) {
        updateData.last4 = dto.last4;
      }

      if (dto.cardBrand) {
        updateData.cardBrand = dto.cardBrand;
      }

      if (dto.sinpeTransactionId) {
        updateData.sinpeTransactionId = dto.sinpeTransactionId;
      }

      if (dto.sinpeReference) {
        updateData.sinpeReference = dto.sinpeReference;
      }

      if (dto.invoiceNumber) {
        updateData.invoiceNumber = dto.invoiceNumber;
      }

      if (dto.receiptUrl) {
        updateData.receiptUrl = dto.receiptUrl;
      }

      if (dto.completedAt) {
        updateData.completedAt = Timestamp.fromDate(dto.completedAt);
      }

      if (dto.failedAt) {
        updateData.failedAt = Timestamp.fromDate(dto.failedAt);
      }

      if (dto.notes) {
        updateData.notes = dto.notes;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  /**
   * Procesar reembolso
   */
  async refund(
    id: string,
    dto: RefundPaymentDTO
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      await updateDoc(docRef, {
        status: PaymentStatus.REFUNDED,
        refundedAmount: dto.amount,
        refundedAt: Timestamp.now(),
        refundReason: dto.reason,
        refundedBy: dto.refundedBy,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }

  /**
   * Calcular estadísticas de pagos
   */
  async getStats(): Promise<PaymentStats> {
    try {
      const payments = await this.getAll();

      const stats: PaymentStats = {
        total: payments.length,
        pending: 0,
        completed: 0,
        failed: 0,
        refunded: 0,
        totalAmountCRC: 0,
        totalAmountUSD: 0,
        byMethod: {
          stripe: 0,
          sinpe: 0,
          cash: 0,
        },
      };

      payments.forEach(payment => {
        // Contar por estado
        switch (payment.status) {
          case PaymentStatus.PENDING:
          case PaymentStatus.PROCESSING:
            stats.pending++;
            break;
          case PaymentStatus.COMPLETED:
            stats.completed++;
            stats.totalAmountCRC += payment.amountCRC;
            stats.totalAmountUSD += payment.amountUSD;
            break;
          case PaymentStatus.FAILED:
            stats.failed++;
            break;
          case PaymentStatus.REFUNDED:
            stats.refunded++;
            break;
        }

        // Contar por método (solo completados)
        if (payment.status === PaymentStatus.COMPLETED) {
          switch (payment.paymentMethod) {
            case PaymentMethod.STRIPE_CARD:
              stats.byMethod.stripe++;
              break;
            case PaymentMethod.SINPE_MOVIL:
              stats.byMethod.sinpe++;
              break;
            case PaymentMethod.CASH:
              stats.byMethod.cash++;
              break;
          }
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting payment stats:', error);
      throw error;
    }
  }

  /**
   * Filtrar pagos
   */
  async filter(filters: PaymentFilters): Promise<Payment[]> {
    try {
      let payments = await this.getAll();

      if (filters.status) {
        payments = payments.filter(p => p.status === filters.status);
      }

      if (filters.paymentMethod) {
        payments = payments.filter(p => p.paymentMethod === filters.paymentMethod);
      }

      if (filters.clientId) {
        payments = payments.filter(p => p.clientId === filters.clientId);
      }

      if (filters.appointmentId) {
        payments = payments.filter(p => p.appointmentId === filters.appointmentId);
      }

      if (filters.dateFrom) {
        payments = payments.filter(p => p.createdAt >= filters.dateFrom!);
      }

      if (filters.dateTo) {
        payments = payments.filter(p => p.createdAt <= filters.dateTo!);
      }

      return payments;
    } catch (error) {
      console.error('Error filtering payments:', error);
      throw error;
    }
  }
}
// Exportar instancia singleton
export const paymentRepository = new PaymentRepository();
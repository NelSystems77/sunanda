/**
 * BookingRequestRepository
 * 
 * Gestiona las solicitudes de citas en Firestore
 * Colección: bookingRequests
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  BookingRequest,
  BookingRequestStatus,
  CreateBookingRequestDTO,
  UpdateBookingRequestStatusDTO,
} from '@/core/domain/interfaces/BookingRequest';

const COLLECTION_NAME = 'bookingRequests';

export class BookingRequestRepository {
  /**
   * Crear una nueva solicitud de cita
   */
  async create(dto: CreateBookingRequestDTO, serviceData: {
    name: string;
    priceCRC: number;
    priceUSD: number;
    duration: number;
  }): Promise<string> {
    try {
      const newRequest = {
        clientName: dto.clientName,
        clientEmail: dto.clientEmail,
        clientPhone: dto.clientPhone,
        clientLanguage: dto.clientLanguage,
        serviceId: dto.serviceId,
        serviceName: serviceData.name,
        servicePriceCRC: serviceData.priceCRC,
        servicePriceUSD: serviceData.priceUSD,
        serviceDuration: serviceData.duration,
        requestedDate: Timestamp.fromDate(dto.requestedDate),
        requestedTime: dto.requestedTime,
        flexibleTime: dto.flexibleTime,
        preferredTimeSlot: dto.preferredTimeSlot,
        notes: dto.notes,
        status: BookingRequestStatus.PENDING,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newRequest);
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking request:', error);
      throw error;
    }
  }

  /**
   * Obtener una solicitud por ID
   */
  async getById(id: string): Promise<BookingRequest | null> {
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
        requestedDate: data.requestedDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        processedAt: data.processedAt?.toDate(),
      } as BookingRequest;
    } catch (error) {
      console.error('Error getting booking request:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las solicitudes (para admin)
   */
  async getAll(): Promise<BookingRequest[]> {
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
          requestedDate: data.requestedDate.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          processedAt: data.processedAt?.toDate(),
        } as BookingRequest;
      });
    } catch (error) {
      console.error('Error getting all booking requests:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes por estado
   */
  async getByStatus(status: BookingRequestStatus): Promise<BookingRequest[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          requestedDate: data.requestedDate.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          processedAt: data.processedAt?.toDate(),
        } as BookingRequest;
      });
    } catch (error) {
      console.error('Error getting booking requests by status:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes pendientes (PENDING)
   */
  async getPending(): Promise<BookingRequest[]> {
    return this.getByStatus(BookingRequestStatus.PENDING);
  }

  /**
   * Actualizar estado de una solicitud
   */
  async updateStatus(
    id: string,
    dto: UpdateBookingRequestStatusDTO
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      const updateData: any = {
        status: dto.status,
        updatedAt: Timestamp.now(),
      };

      if (dto.processedBy) {
        updateData.processedBy = dto.processedBy;
        updateData.processedAt = Timestamp.now();
      }

      if (dto.appointmentId) {
        updateData.appointmentId = dto.appointmentId;
      }

      if (dto.rejectionReason) {
        updateData.rejectionReason = dto.rejectionReason;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating booking request status:', error);
      throw error;
    }
  }

  /**
   * Eliminar una solicitud
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting booking request:', error);
      throw error;
    }
  }

  /**
   * Contar solicitudes pendientes (para badge en admin)
   */
  async countPending(): Promise<number> {
    try {
      const requests = await this.getPending();
      return requests.length;
    } catch (error) {
      console.error('Error counting pending requests:', error);
      return 0;
    }
  }
}
// Exportar instancia singleton
export const bookingRequestRepository = new BookingRequestRepository();

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
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from '@/core/domain/interfaces/Appointment';
import { AppointmentStatus } from '../../domain/enums';

/**
 * Repositorio de Citas
 * Maneja la persistencia en Firestore
 */
export class AppointmentRepository {
  private collectionName = 'appointments';

  /**
   * Crear nueva cita
   */
  async create(data: CreateAppointmentDTO, createdBy: string): Promise<string> {
    try {
      const appointmentData = {
        ...data,
        status: AppointmentStatus.PENDING,
        reminderSent: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy,
        date: Timestamp.fromDate(data.date)
      };

      const docRef = await addDoc(collection(db, this.collectionName), appointmentData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('No se pudo crear la cita');
    }
  }

  /**
   * Obtener cita por ID
   */
  async getById(id: string): Promise<Appointment | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return this.mapDocToAppointment(docSnap.id, docSnap.data());
    } catch (error) {
      console.error('Error getting appointment:', error);
      throw new Error('No se pudo obtener la cita');
    }
  }

  /**
   * Obtener todas las citas
   */
  async getAll(): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => 
        this.mapDocToAppointment(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw new Error('No se pudieron obtener las citas');
    }
  }

  /**
   * Obtener citas por cliente
   */
  async getByClient(clientId: string): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('clientId', '==', clientId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => 
        this.mapDocToAppointment(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting client appointments:', error);
      throw new Error('No se pudieron obtener las citas del cliente');
    }
  }

  /**
   * Obtener citas por esteticista
   */
  async getByEsthetician(estheticianId: string): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('estheticianId', '==', estheticianId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => 
        this.mapDocToAppointment(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting esthetician appointments:', error);
      throw new Error('No se pudieron obtener las citas de la esteticista');
    }
  }

  /**
   * Obtener citas por fecha
   */
  async getByDate(date: Date): Promise<Appointment[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, this.collectionName),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay)),
        orderBy('date', 'asc')
      );

      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map(doc =>
        this.mapDocToAppointment(doc.id, doc.data())
      );
      return results.sort((a, b) => a.startTime.localeCompare(b.startTime));
    } catch (error) {
      console.error('Error getting appointments by date:', error);
      throw new Error('No se pudieron obtener las citas del día');
    }
  }

  /**
   * Obtener citas por rango de fechas
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    try {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, this.collectionName),
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', Timestamp.fromDate(end)),
        orderBy('date', 'asc')
      );

      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map(doc =>
        this.mapDocToAppointment(doc.id, doc.data())
      );
      return results.sort((a, b) => a.startTime.localeCompare(b.startTime));
    } catch (error) {
      console.error('Error getting appointments by date range:', error);
      throw new Error('No se pudieron obtener las citas del rango de fechas');
    }
  }

  /**
   * Obtener citas por estado
   */
  async getByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', status),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => 
        this.mapDocToAppointment(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting appointments by status:', error);
      throw new Error('No se pudieron obtener las citas por estado');
    }
  }

  /**
   * Actualizar cita
   */
  async update(id: string, data: UpdateAppointmentDTO): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now()
      };

      // Convertir date a Timestamp si existe
      if (data.date) {
        updateData.date = Timestamp.fromDate(data.date);
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error('No se pudo actualizar la cita');
    }
  }

  /**
   * Cancelar cita
   */
  async cancel(id: string, cancelledBy: string, reason?: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        status: AppointmentStatus.CANCELLED,
        cancelledAt: Timestamp.now(),
        cancelledBy,
        cancellationReason: reason || '',
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw new Error('No se pudo cancelar la cita');
    }
  }

  /**
   * Confirmar cita
   */
  async confirm(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        status: AppointmentStatus.CONFIRMED,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error confirming appointment:', error);
      throw new Error('No se pudo confirmar la cita');
    }
  }

  /**
   * Completar cita
   */
  async complete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        status: AppointmentStatus.COMPLETED,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error completing appointment:', error);
      throw new Error('No se pudo completar la cita');
    }
  }

  /**
   * Marcar como no asistió
   */
  async markAsNoShow(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        status: AppointmentStatus.NO_SHOW,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error marking appointment as no-show:', error);
      throw new Error('No se pudo marcar como no asistió');
    }
  }

  /**
   * Marcar recordatorio como enviado
   */
  async markReminderSent(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        reminderSent: true,
        reminderSentAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error marking reminder as sent:', error);
      throw new Error('No se pudo marcar el recordatorio como enviado');
    }
  }

  async reopen(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        status: AppointmentStatus.PENDING,
        cancelledAt: null,
        cancelledBy: null,
        cancellationReason: null,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error reopening appointment:', error);
      throw new Error('No se pudo reabrir la cita');
    }
  }

  /**
   * Eliminar cita
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw new Error('No se pudo eliminar la cita');
    }
  }

  /**
   * Mapear documento de Firestore a Appointment
   */
  private mapDocToAppointment(id: string, data: DocumentData): Appointment {
    return {
      id,
      clientId: data.clientId,
      estheticianId: data.estheticianId,
      serviceId: data.serviceId,
      date: data.date?.toDate() || new Date(),
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status,
      notes: data.notes,
      internalNotes: data.internalNotes,
      reminderSent: data.reminderSent || false,
      reminderSentAt: data.reminderSentAt?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      createdBy: data.createdBy,
      cancelledAt: data.cancelledAt?.toDate(),
      cancelledBy: data.cancelledBy,
      cancellationReason: data.cancellationReason
    };
  }
}
// Exportar instancia singleton
export const appointmentRepository = new AppointmentRepository();
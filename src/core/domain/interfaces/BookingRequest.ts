/**
 * BookingRequest Interface
 * 
 * Solicitud de cita del cliente (público)
 * Estado PENDING hasta que el staff la confirme/rechace
 * 
 * Flujo:
 * 1. Cliente crea solicitud desde la landing
 * 2. Staff ve en panel admin
 * 3. Staff confirma → crea Appointment
 * 4. Staff rechaza → marca como REJECTED
 */

export interface BookingRequest {
  // ID
  id: string;

  // Información del cliente
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientLanguage: 'es' | 'en'; // Idioma preferido del cliente

  // Información del servicio solicitado
  serviceId: string;
  serviceName: string;
  servicePriceCRC: number;
  servicePriceUSD: number;
  serviceDuration: number; // en minutos

  // Fecha y hora solicitada
  requestedDate: Date;
  requestedTime: string; // formato "HH:MM"
  flexibleTime: boolean; // ¿Es flexible con el horario?
  preferredTimeSlot?: 'morning' | 'afternoon' | 'evening'; // Si es flexible

  // Notas adicionales
  notes?: string;

  // Estado de la solicitud
  status: BookingRequestStatus;

  // Si se confirma, se vincula con la cita creada
  appointmentId?: string; // ID de la cita confirmada

  // Información de procesamiento (staff)
  processedBy?: string; // userId del staff que procesó
  processedAt?: Date;
  rejectionReason?: string; // Motivo si fue rechazada

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingRequestStatus {
  PENDING = 'PENDING',       // Pendiente de revisión
  CONFIRMED = 'CONFIRMED',   // Confirmada (cita creada)
  REJECTED = 'REJECTED',     // Rechazada (no disponible)
  CANCELLED = 'CANCELLED',   // Cancelada por el cliente
}

// Tipo para crear una nueva solicitud (desde formulario público)
export interface CreateBookingRequestDTO {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientLanguage: 'es' | 'en';
  serviceId: string;
  requestedDate: Date;
  requestedTime: string;
  flexibleTime: boolean;
  preferredTimeSlot?: 'morning' | 'afternoon' | 'evening';
  notes?: string;
}

// Tipo para actualizar estado (desde admin)
export interface UpdateBookingRequestStatusDTO {
  status: BookingRequestStatus;
  processedBy?: string;
  appointmentId?: string;
  rejectionReason?: string;
}

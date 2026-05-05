import { AppointmentStatus } from '../enums';

/**
 * Interfaz de Cita
 */
export interface Appointment {
  id: string;
  
  // Relaciones
  clientId: string;
  estheticianId: string;
  serviceId: string;
  
  // Fecha y hora
  date: Date;
  startTime: string; // formato HH:mm
  endTime: string; // formato HH:mm
  
  // Estado
  status: AppointmentStatus;
  
  // Notas
  notes?: string;
  internalNotes?: string; // Solo visible para staff
  
  // Recordatorios
  reminderSent?: boolean;
  reminderSentAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // ID del usuario que creó la cita
  
  // Cancelación
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
}

/**
 * DTO para crear cita
 */
export interface CreateAppointmentDTO {
  clientId: string;
  estheticianId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
  internalNotes?: string;
}

/**
 * DTO para actualizar cita
 */
export interface UpdateAppointmentDTO {
  clientId?: string;
  estheticianId?: string;
  serviceId?: string;
  date?: Date;
  startTime?: string;
  endTime?: string;
  status?: AppointmentStatus;
  notes?: string;
  internalNotes?: string;
}

/**
 * DTO para reasignar cita
 */
export interface ReassignAppointmentDTO {
  appointmentId: string;
  newEstheticianId: string;
  reason?: string;
}

/**
 * Vista expandida de cita con información relacionada
 */
export interface AppointmentWithDetails extends Appointment {
  clientName: string;
  clientPhone: string;
  estheticianName: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
}

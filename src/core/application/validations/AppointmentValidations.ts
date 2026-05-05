import { z } from 'zod';
import { AppointmentStatus } from '../../domain/enums';

/**
 * Validación de hora en formato HH:mm
 */
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Schema para crear cita
 */
export const createAppointmentSchema = z.object({
  clientId: z.string().min(1, 'El cliente es requerido'),
  estheticianId: z.string().min(1, 'La esteticista es requerida'),
  serviceId: z.string().min(1, 'El servicio es requerido'),
  date: z.date({
    required_error: 'La fecha es requerida',
    invalid_type_error: 'Fecha inválida'
  }),
  startTime: z.string()
    .regex(timeRegex, 'Formato de hora inválido (usar HH:mm)'),
  endTime: z.string()
    .regex(timeRegex, 'Formato de hora inválido (usar HH:mm)'),
  notes: z.string().optional(),
  internalNotes: z.string().optional()
}).refine(
  (data) => {
    // Validar que endTime sea después de startTime
    const [startH, startM] = data.startTime.split(':').map(Number);
    const [endH, endM] = data.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return endMinutes > startMinutes;
  },
  {
    message: 'La hora de fin debe ser posterior a la hora de inicio',
    path: ['endTime']
  }
).refine(
  (data) => {
    // Validar que la fecha no sea en el pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(data.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  },
  {
    message: 'La fecha no puede ser en el pasado',
    path: ['date']
  }
);

/**
 * Schema para actualizar cita
 */
export const updateAppointmentSchema = z.object({
  clientId: z.string().min(1).optional(),
  estheticianId: z.string().min(1).optional(),
  serviceId: z.string().min(1).optional(),
  date: z.date().optional(),
  startTime: z.string().regex(timeRegex).optional(),
  endTime: z.string().regex(timeRegex).optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional()
}).refine(
  (data) => {
    // Si ambos están presentes, validar que endTime > startTime
    if (data.startTime && data.endTime) {
      const [startH, startM] = data.startTime.split(':').map(Number);
      const [endH, endM] = data.endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      return endMinutes > startMinutes;
    }
    return true;
  },
  {
    message: 'La hora de fin debe ser posterior a la hora de inicio',
    path: ['endTime']
  }
);

/**
 * Schema para cancelar cita
 */
export const cancelAppointmentSchema = z.object({
  appointmentId: z.string().min(1, 'ID de cita requerido'),
  reason: z.string().min(1, 'La razón de cancelación es requerida').max(500)
});

/**
 * Schema para reasignar cita
 */
export const reassignAppointmentSchema = z.object({
  appointmentId: z.string().min(1, 'ID de cita requerido'),
  newEstheticianId: z.string().min(1, 'Nueva esteticista requerida'),
  reason: z.string().max(500).optional()
});

/**
 * Schema para filtros de búsqueda
 */
export const appointmentFiltersSchema = z.object({
  clientId: z.string().optional(),
  estheticianId: z.string().optional(),
  serviceId: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  searchTerm: z.string().optional()
}).refine(
  (data) => {
    // Si ambas fechas están presentes, validar que dateTo >= dateFrom
    if (data.dateFrom && data.dateTo) {
      return data.dateTo >= data.dateFrom;
    }
    return true;
  },
  {
    message: 'La fecha final debe ser posterior o igual a la fecha inicial',
    path: ['dateTo']
  }
);

/**
 * Tipos inferidos de los schemas
 */
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;
export type ReassignAppointmentInput = z.infer<typeof reassignAppointmentSchema>;
export type AppointmentFilters = z.infer<typeof appointmentFiltersSchema>;

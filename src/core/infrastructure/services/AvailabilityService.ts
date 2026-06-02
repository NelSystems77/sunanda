import { Appointment } from '@/core/domain/interfaces/Appointment';
import { AppointmentStatus } from '@/core/domain/enums';
import { AppointmentRepository } from '../repositories/AppointmentRepository';

/**
 * Configuración del horario del spa
 */
export const SPA_SCHEDULE = {
  openTime: '09:00',
  closeTime: '21:00',
  slotDuration: 90, // minutos
  minAdvanceHours: 1, // Advertencia si es menos de 1 hora (pero no bloquea)
  daysOpen: [0, 1, 2, 3, 4, 5, 6] // Lunes a Domingo
};

/**
 * Resultado de verificación de disponibilidad
 */
export interface AvailabilityCheckResult {
  available: boolean;
  reason?: string;
  warning?: string; // Nueva: advertencia que no bloquea
  conflictingAppointments?: Appointment[];
}

/**
 * Slot de tiempo disponible
 */
export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  appointmentId?: string;
}

/**
 * Servicio de Disponibilidad
 * Maneja la lógica de verificación de horarios
 */
export class AvailabilityService {
  private appointmentRepo: AppointmentRepository;

  constructor() {
    this.appointmentRepo = new AppointmentRepository();
  }

  /**
   * Verificar si un horario está disponible
   */
  async checkAvailability(
    date: Date,
    startTime: string,
    endTime: string,
    estheticianId: string,
    excludeAppointmentId?: string
  ): Promise<AvailabilityCheckResult> {
    // 1. Verificar que sea un día válido
    const dayOfWeek = date.getDay();
    if (!SPA_SCHEDULE.daysOpen.includes(dayOfWeek)) {
      return {
        available: false,
        reason: 'El spa no abre este día'
      };
    }

    // 2. Verificar horario de apertura
    if (!this.isWithinBusinessHours(startTime, endTime)) {
      return {
        available: false,
        reason: `El horario debe estar entre ${SPA_SCHEDULE.openTime} y ${SPA_SCHEDULE.closeTime}`
      };
    }

// Verificar si tiene advertencia de tiempo (pero no bloquear)
const advanceWarning = !this.hasMinimumAdvance(date, startTime)
  ? `⚠️ Cita con menos de ${SPA_SCHEDULE.minAdvanceHours} hora de antelación`
  : undefined;

    // 4. Verificar conflictos con otras citas
    const appointments = await this.appointmentRepo.getByDate(date);

    const conflicts = appointments.filter(apt => {
      // Excluir citas canceladas o no-show — el slot queda libre
      if (apt.status === AppointmentStatus.CANCELLED || apt.status === AppointmentStatus.NO_SHOW) {
        return false;
      }

      // Excluir la cita actual si estamos editando
      if (excludeAppointmentId && apt.id === excludeAppointmentId) {
        return false;
      }

      // Solo verificar citas del mismo esteticista
      if (apt.estheticianId !== estheticianId) {
        return false;
      }

      // Verificar si hay solapamiento de horarios
      return this.hasTimeOverlap(
        startTime,
        endTime,
        apt.startTime,
        apt.endTime
      );
    });

    if (conflicts.length > 0) {
      return {
        available: false,
        reason: 'Ya existe una cita en ese horario',
        conflictingAppointments: conflicts
      };
    }

    return {
      available: true,
      warning: advanceWarning,
    };
  }

  /**
   * Obtener slots disponibles para un día y esteticista
   */
  async getAvailableSlots(
    date: Date,
    estheticianId: string,
    serviceDuration: number = SPA_SCHEDULE.slotDuration
  ): Promise<TimeSlot[]> {
    const appointments = await this.appointmentRepo.getByDate(date);
    const estheticianAppointments = appointments.filter(
      apt =>
        apt.estheticianId === estheticianId &&
        apt.status !== AppointmentStatus.CANCELLED &&
        apt.status !== AppointmentStatus.NO_SHOW
    );

    const slots: TimeSlot[] = [];
    let currentTime = SPA_SCHEDULE.openTime;

    while (this.compareTime(currentTime, SPA_SCHEDULE.closeTime) < 0) {
      const endTime = this.addMinutes(currentTime, serviceDuration);

      // Verificar que el slot no pase del horario de cierre
      if (this.compareTime(endTime, SPA_SCHEDULE.closeTime) > 0) {
        break;
      }

      // Verificar si hay conflicto
      const conflict = estheticianAppointments.find(apt =>
        this.hasTimeOverlap(currentTime, endTime, apt.startTime, apt.endTime)
      );

      slots.push({
        startTime: currentTime,
        endTime,
        available: !conflict,
        appointmentId: conflict?.id
      });

      currentTime = this.addMinutes(currentTime, SPA_SCHEDULE.slotDuration);
    }

    return slots;
  }

  /**
   * Calcular porcentaje de ocupación de un día
   */
  async getDayOccupancy(date: Date, estheticianId?: string): Promise<number> {
    const appointments = await this.appointmentRepo.getByDate(date);
    
    const activeAppointments = appointments.filter(
      apt =>
        apt.status !== AppointmentStatus.CANCELLED &&
        apt.status !== AppointmentStatus.NO_SHOW
    );

    let relevantAppointments = activeAppointments;
    if (estheticianId) {
      relevantAppointments = activeAppointments.filter(
        apt => apt.estheticianId === estheticianId
      );
    }

    // Calcular minutos totales del día
    const totalMinutes = this.getMinutesBetween(
      SPA_SCHEDULE.openTime,
      SPA_SCHEDULE.closeTime
    );

    // Calcular minutos ocupados
    const occupiedMinutes = relevantAppointments.reduce((total, apt) => {
      return total + this.getMinutesBetween(apt.startTime, apt.endTime);
    }, 0);

    return Math.round((occupiedMinutes / totalMinutes) * 100);
  }

  /**
   * Calcular ocupación por semana
   */
  async getWeekOccupancy(
    startDate: Date,
    estheticianId?: string
  ): Promise<{ date: Date; occupancy: number }[]> {
    const weekDays: { date: Date; occupancy: number }[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const occupancy = await this.getDayOccupancy(date, estheticianId);
      weekDays.push({ date, occupancy });
    }

    return weekDays;
  }

  /**
   * Verificar si está dentro del horario de negocio
   */
  private isWithinBusinessHours(startTime: string, endTime: string): boolean {
    return (
      this.compareTime(startTime, SPA_SCHEDULE.openTime) >= 0 &&
      this.compareTime(endTime, SPA_SCHEDULE.closeTime) <= 0
    );
  }

  /**
   * Verificar tiempo mínimo de anticipación
   */
  private hasMinimumAdvance(date: Date, startTime: string): boolean {
    const now = new Date();
    const appointmentDateTime = this.combineDateAndTime(date, startTime);
    
    const diffHours = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Si la cita es en el pasado, no es válida
    if (diffHours < 0) {
      return false;
    }

    // Permitir citas con al menos 1 hora de anticipación
    return diffHours >= SPA_SCHEDULE.minAdvanceHours;
  }

  /**
   * Verificar solapamiento de horarios
   */
  private hasTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    return (
      this.compareTime(start1, end2) < 0 &&
      this.compareTime(end1, start2) > 0
    );
  }

  /**
   * Comparar dos horas (formato HH:mm)
   */
  private compareTime(time1: string, time2: string): number {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);

    const minutes1 = h1 * 60 + m1;
    const minutes2 = h2 * 60 + m2;

    return minutes1 - minutes2;
  }

  /**
   * Agregar minutos a una hora
   */
  private addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }

  /**
   * Obtener minutos entre dos horas
   */
  private getMinutesBetween(startTime: string, endTime: string): number {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    return endMinutes - startMinutes;
  }

  /**
   * Combinar fecha y hora
   */
  private combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  }

  /**
   * Generar slots de tiempo para todo el día
   */
  generateDaySlots(): string[] {
    const slots: string[] = [];
    let currentTime = SPA_SCHEDULE.openTime;

    while (this.compareTime(currentTime, SPA_SCHEDULE.closeTime) < 0) {
      slots.push(currentTime);
      currentTime = this.addMinutes(currentTime, SPA_SCHEDULE.slotDuration);
    }

    return slots;
  }
}

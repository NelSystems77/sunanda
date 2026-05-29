import { 
  Appointment, 
  CreateAppointmentDTO, 
  UpdateAppointmentDTO 
} from '@/core/domain/interfaces/Appointment';
import { AppointmentRepository } from '@/core/infrastructure/repositories/AppointmentRepository';
import { AvailabilityService } from '@/core/infrastructure/services/AvailabilityService';
import { AppointmentStatus } from '@/core/domain/enums';
import { 
  createAppointmentSchema,
  updateAppointmentSchema,
  cancelAppointmentSchema,
  reassignAppointmentSchema
} from '@/core/application/validations/AppointmentValidations';

/**
 * Casos de Uso de Citas
 * Contiene toda la lógica de negocio relacionada con las citas
 */
export class AppointmentUseCases {
  private repository: AppointmentRepository;
  private availabilityService: AvailabilityService;

  constructor() {
    this.repository = new AppointmentRepository();
    this.availabilityService = new AvailabilityService();
  }

  /**
   * Crear nueva cita
   */
  async createAppointment(
    data: CreateAppointmentDTO,
    createdBy: string
  ): Promise<string> {
    // 1. Validar datos
    const validated = createAppointmentSchema.parse(data);

    // 2. Verificar disponibilidad
    const availability = await this.availabilityService.checkAvailability(
      validated.date,
      validated.startTime,
      validated.endTime,
      validated.estheticianId
    );

    if (!availability.available) {
      throw new Error(availability.reason || 'Horario no disponible');
    }

    // 3. Crear la cita
    const appointmentId = await this.repository.create(validated, createdBy);

    return appointmentId;
  }

  /**
   * Obtener cita por ID
   */
  async getAppointmentById(id: string): Promise<Appointment | null> {
    return await this.repository.getById(id);
  }

  /**
   * Obtener todas las citas
   */
  async getAllAppointments(): Promise<Appointment[]> {
    return await this.repository.getAll();
  }

  /**
   * Obtener citas por cliente
   */
  async getAppointmentsByClient(clientId: string): Promise<Appointment[]> {
    return await this.repository.getByClient(clientId);
  }

  /**
   * Obtener citas por esteticista
   */
  async getAppointmentsByEsthetician(estheticianId: string): Promise<Appointment[]> {
    return await this.repository.getByEsthetician(estheticianId);
  }

  /**
   * Obtener citas por fecha
   */
  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    return await this.repository.getByDate(date);
  }

  /**
   * Obtener citas por rango de fechas
   */
  async getAppointmentsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Appointment[]> {
    return await this.repository.getByDateRange(startDate, endDate);
  }

  /**
   * Obtener citas por estado
   */
  async getAppointmentsByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    return await this.repository.getByStatus(status);
  }

  /**
   * Actualizar cita
   */
  async updateAppointment(
    id: string,
    data: UpdateAppointmentDTO
  ): Promise<void> {
    // 1. Validar datos
    const validated = updateAppointmentSchema.parse(data);

    // 2. Obtener cita actual
    const currentAppointment = await this.repository.getById(id);
    if (!currentAppointment) {
      throw new Error('Cita no encontrada');
    }

    // 3. Si se está cambiando fecha/hora/esteticista, verificar disponibilidad
    if (
      validated.date || 
      validated.startTime || 
      validated.endTime || 
      validated.estheticianId
    ) {
      const checkDate = validated.date || currentAppointment.date;
      const checkStartTime = validated.startTime || currentAppointment.startTime;
      const checkEndTime = validated.endTime || currentAppointment.endTime;
      const checkEstheticianId = validated.estheticianId || currentAppointment.estheticianId;

      const availability = await this.availabilityService.checkAvailability(
        checkDate,
        checkStartTime,
        checkEndTime,
        checkEstheticianId,
        id // Excluir la cita actual de la verificación
      );

      if (!availability.available) {
        throw new Error(availability.reason || 'Horario no disponible');
      }
    }

    // 4. Actualizar
    await this.repository.update(id, validated);
  }

  /**
   * Cancelar cita
   */
  async cancelAppointment(
    id: string,
    cancelledBy: string,
    reason: string
  ): Promise<void> {
    // 1. Validar
    cancelAppointmentSchema.parse({ appointmentId: id, reason });

    // 2. Verificar que existe
    const appointment = await this.repository.getById(id);
    if (!appointment) {
      throw new Error('Cita no encontrada');
    }

    // 3. Verificar que no esté ya cancelada
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new Error('La cita ya está cancelada');
    }

    // 4. Cancelar
    await this.repository.cancel(id, cancelledBy, reason);
  }

  /**
   * Confirmar cita
   */
  async confirmAppointment(id: string): Promise<void> {
    const appointment = await this.repository.getById(id);
    if (!appointment) {
      throw new Error('Cita no encontrada');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new Error('No se puede confirmar una cita cancelada');
    }

    await this.repository.confirm(id);
  }

  /**
   * Completar cita
   */
  async completeAppointment(id: string): Promise<void> {
    const appointment = await this.repository.getById(id);
    if (!appointment) {
      throw new Error('Cita no encontrada');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new Error('No se puede completar una cita cancelada');
    }

    await this.repository.complete(id);
  }

  /**
   * Marcar como no asistió
   */
  async markAsNoShow(id: string): Promise<void> {
    const appointment = await this.repository.getById(id);
    if (!appointment) {
      throw new Error('Cita no encontrada');
    }

    await this.repository.markAsNoShow(id);
  }

  /**
   * Reasignar cita a otra esteticista
   */
  async reassignAppointment(
    appointmentId: string,
    newEstheticianId: string,
    reason?: string
  ): Promise<void> {
    // 1. Validar
    reassignAppointmentSchema.parse({ appointmentId, newEstheticianId, reason });

    // 2. Obtener cita actual
    const appointment = await this.repository.getById(appointmentId);
    if (!appointment) {
      throw new Error('Cita no encontrada');
    }

    // 3. Verificar disponibilidad de la nueva esteticista
    const availability = await this.availabilityService.checkAvailability(
      appointment.date,
      appointment.startTime,
      appointment.endTime,
      newEstheticianId,
      appointmentId
    );

    if (!availability.available) {
      throw new Error(
        `La nueva esteticista no está disponible: ${availability.reason}`
      );
    }

    // 4. Actualizar
    await this.repository.update(appointmentId, {
      estheticianId: newEstheticianId,
      internalNotes: appointment.internalNotes 
        ? `${appointment.internalNotes}\n\nReasignado: ${reason || 'Sin razón especificada'}`
        : `Reasignado: ${reason || 'Sin razón especificada'}`
    });
  }

  async reopenAppointment(id: string): Promise<void> {
    const appointment = await this.repository.getById(id);
    if (!appointment) throw new Error('Cita no encontrada');
    await this.repository.reopen(id);
  }

  async deleteAppointment(id: string, _deletedBy: string): Promise<void> {
    const appointment = await this.repository.getById(id);
    if (!appointment) throw new Error('Cita no encontrada');
    await this.repository.delete(id);
  }

  /**
   * Obtener estadísticas de citas
   */
  async getAppointmentStats(dateFrom?: Date, dateTo?: Date): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
    byStatus: Record<AppointmentStatus, number>;
  }> {
    let appointments: Appointment[];

    if (dateFrom && dateTo) {
      appointments = await this.repository.getByDateRange(dateFrom, dateTo);
    } else {
      appointments = await this.repository.getAll();
    }

    const stats = {
      total: appointments.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
      byStatus: {} as Record<AppointmentStatus, number>
    };

    // Inicializar contadores por estado
    Object.values(AppointmentStatus).forEach(status => {
      stats.byStatus[status] = 0;
    });

    // Contar
    appointments.forEach(apt => {
      stats.byStatus[apt.status]++;
      
      switch (apt.status) {
        case AppointmentStatus.PENDING:
          stats.pending++;
          break;
        case AppointmentStatus.CONFIRMED:
          stats.confirmed++;
          break;
        case AppointmentStatus.COMPLETED:
          stats.completed++;
          break;
        case AppointmentStatus.CANCELLED:
          stats.cancelled++;
          break;
        case AppointmentStatus.NO_SHOW:
          stats.noShow++;
          break;
      }
    });

    return stats;
  }

  /**
   * Obtener ocupación del día
   */
  async getDayOccupancy(date: Date, estheticianId?: string): Promise<number> {
    return await this.availabilityService.getDayOccupancy(date, estheticianId);
  }

  /**
   * Obtener ocupación de la semana
   */
  async getWeekOccupancy(
    startDate: Date,
    estheticianId?: string
  ): Promise<{ date: Date; occupancy: number }[]> {
    return await this.availabilityService.getWeekOccupancy(startDate, estheticianId);
  }

  /**
   * Obtener slots disponibles
   */
  async getAvailableSlots(
    date: Date,
    estheticianId: string,
    serviceDuration?: number
  ) {
    return await this.availabilityService.getAvailableSlots(
      date,
      estheticianId,
      serviceDuration
    );
  }

  /**
   * Marcar recordatorio como enviado
   */
  async markReminderSent(id: string): Promise<void> {
    await this.repository.markReminderSent(id);
  }
}

import { useCallback, useEffect } from 'react';
import { useAppointmentStore } from '../context/AppointmentStore';
import { useAuthStore } from '../context/AuthStore';
import { CreateAppointmentDTO, UpdateAppointmentDTO } from '../../core/domain/interfaces/Appointment';
import { AppointmentStatus } from '../../core/domain/enums';
import toast from 'react-hot-toast';

/**
 * Hook personalizado para gestión de citas
 * Simplifica el acceso al store y maneja errores con toasts
 */
export function useAppointments() {
  const { user } = useAuthStore();
  const {
    appointments,
    selectedAppointment,
    availableSlots,
    calendarView,
    selectedDate,
    filters,
    loading,
    loadingSlots,
    error,
    
    // Actions
    fetchAppointments,
    fetchAppointmentById,
    fetchAppointmentsByDate,
    fetchAppointmentsByDateRange,
    fetchAppointmentsByEsthetician,
    createAppointment: createAppointmentStore,
    updateAppointment: updateAppointmentStore,
    cancelAppointment: cancelAppointmentStore,
    confirmAppointment: confirmAppointmentStore,
    completeAppointment: completeAppointmentStore,
    markAsNoShow: markAsNoShowStore,
    reassignAppointment: reassignAppointmentStore,
    deleteAppointment: deleteAppointmentStore,
    reopenAppointment: reopenAppointmentStore,
    fetchAvailableSlots,
    checkAvailability,
    
    // UI
    setSelectedAppointment,
    setCalendarView,
    setSelectedDate,
    setFilters,
    clearFilters,
    clearError,
    reset
  } = useAppointmentStore();

  // Mostrar errores como toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  /**
   * Crear cita con manejo de errores
   */
  const createAppointment = useCallback(async (data: CreateAppointmentDTO) => {
    try {
      if (!user) {
        toast.error('Debes iniciar sesión');
        return null;
      }

      const id = await createAppointmentStore(data, user.id);
      toast.success('Cita creada exitosamente');
      return id;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear cita');
      return null;
    }
  }, [user, createAppointmentStore]);

  /**
   * Actualizar cita con manejo de errores
   */
  const updateAppointment = useCallback(async (id: string, data: UpdateAppointmentDTO) => {
    try {
      await updateAppointmentStore(id, data);
      toast.success('Cita actualizada exitosamente');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar cita');
      return false;
    }
  }, [updateAppointmentStore]);

  /**
   * Cancelar cita con manejo de errores
   */
  const cancelAppointment = useCallback(async (id: string, reason: string) => {
    try {
      if (!user) {
        toast.error('Debes iniciar sesión');
        return false;
      }

      await cancelAppointmentStore(id, user.id, reason);
      toast.success('Cita cancelada');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cancelar cita');
      return false;
    }
  }, [user, cancelAppointmentStore]);

  /**
   * Confirmar cita con manejo de errores
   */
  const confirmAppointment = useCallback(async (id: string) => {
    try {
      await confirmAppointmentStore(id);
      toast.success('Cita confirmada');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al confirmar cita');
      return false;
    }
  }, [confirmAppointmentStore]);

  /**
   * Completar cita con manejo de errores
   */
  const completeAppointment = useCallback(async (id: string) => {
    try {
      await completeAppointmentStore(id);
      toast.success('Cita completada');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al completar cita');
      return false;
    }
  }, [completeAppointmentStore]);

  /**
   * Marcar como no asistió
   */
  const markAsNoShow = useCallback(async (id: string) => {
    try {
      await markAsNoShowStore(id);
      toast.success('Marcada como no asistió');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar estado');
      return false;
    }
  }, [markAsNoShowStore]);

  /**
   * Reasignar cita
   */
  const reassignAppointment = useCallback(async (
    id: string,
    newEstheticianId: string,
    reason?: string
  ) => {
    try {
      await reassignAppointmentStore(id, newEstheticianId, reason);
      toast.success('Cita reasignada exitosamente');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al reasignar cita');
      return false;
    }
  }, [reassignAppointmentStore]);

  /**
   * Eliminar cita
   */
  const deleteAppointment = useCallback(async (id: string) => {
    try {
      if (!user) {
        toast.error('Debes iniciar sesión');
        return false;
      }

      await deleteAppointmentStore(id, user.id);
      toast.success('Cita eliminada');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar cita');
      return false;
    }
  }, [user, deleteAppointmentStore]);

  const reopenAppointment = useCallback(async (id: string) => {
    try {
      await reopenAppointmentStore(id);
      toast.success('Cita reabierta');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al reabrir cita');
      return false;
    }
  }, [reopenAppointmentStore]);

  /**
   * Filtrar citas localmente
   */
  const filteredAppointments = useCallback(() => {
    let filtered = [...appointments];

    if (filters.estheticianId) {
      filtered = filtered.filter(apt => apt.estheticianId === filters.estheticianId);
    }

    if (filters.clientId) {
      filtered = filtered.filter(apt => apt.clientId === filters.clientId);
    }

    if (filters.serviceId) {
      filtered = filtered.filter(apt => apt.serviceId === filters.serviceId);
    }

    if (filters.status) {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(apt => apt.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(apt => apt.date <= filters.dateTo!);
    }

    return filtered;
  }, [appointments, filters]);

  /**
   * Obtener citas del día seleccionado
   */
  const todayAppointments = useCallback(() => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getDate() === selectedDate.getDate() &&
        aptDate.getMonth() === selectedDate.getMonth() &&
        aptDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [appointments, selectedDate]);

  /**
   * Obtener estadísticas rápidas
   */
  const stats = useCallback(() => {
    const total = appointments.length;
    const pending = appointments.filter(apt => apt.status === AppointmentStatus.PENDING).length;
    const confirmed = appointments.filter(apt => apt.status === AppointmentStatus.CONFIRMED).length;
    const completed = appointments.filter(apt => apt.status === AppointmentStatus.COMPLETED).length;
    const cancelled = appointments.filter(apt => apt.status === AppointmentStatus.CANCELLED).length;
    const noShow = appointments.filter(apt => apt.status === AppointmentStatus.NO_SHOW).length;

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      noShow
    };
  }, [appointments]);

  /**
   * Navegar fechas
   */
  const goToPreviousDay = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  }, [selectedDate, setSelectedDate]);

  const goToNextDay = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  }, [selectedDate, setSelectedDate]);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, [setSelectedDate]);

  /**
   * Navegar semanas
   */
  const goToPreviousWeek = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  }, [selectedDate, setSelectedDate]);

  const goToNextWeek = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  }, [selectedDate, setSelectedDate]);

  /**
   * Navegar meses
   */
  const goToPreviousMonth = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  }, [selectedDate, setSelectedDate]);

  const goToNextMonth = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  }, [selectedDate, setSelectedDate]);

  return {
    // Estado
    appointments,
    selectedAppointment,
    availableSlots,
    calendarView,
    selectedDate,
    filters,
    loading,
    loadingSlots,
    error,

    // Acciones CRUD
    fetchAppointments,
    fetchAppointmentById,
    fetchAppointmentsByDate,
    fetchAppointmentsByDateRange,
    fetchAppointmentsByEsthetician,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    completeAppointment,
    markAsNoShow,
    reassignAppointment,
    deleteAppointment,
    reopenAppointment,

    // Disponibilidad
    fetchAvailableSlots,
    checkAvailability,

    // UI
    setSelectedAppointment,
    setCalendarView,
    setSelectedDate,
    setFilters,
    clearFilters,
    reset,

    // Helpers
    filteredAppointments,
    todayAppointments,
    stats,

    // Navegación
    goToPreviousDay,
    goToNextDay,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
    goToPreviousMonth,
    goToNextMonth
  };
}

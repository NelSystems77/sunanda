import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Appointment, 
  CreateAppointmentDTO, 
  UpdateAppointmentDTO 
} from '../../core/domain/interfaces/Appointment';
import { AppointmentStatus } from '../../core/domain/enums';
import { AppointmentUseCases } from '../../core/application/use-cases/appointments/AppointmentUseCases';
import { TimeSlot, AvailabilityService } from '../../core/infrastructure/services/AvailabilityService';

/**
 * Vista del calendario
 */
export type CalendarView = 'day' | 'week' | 'month';

/**
 * Filtros de citas
 */
export interface AppointmentFilters {
  estheticianId?: string;
  clientId?: string;
  serviceId?: string;
  status?: AppointmentStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Estado del store de citas
 */
interface AppointmentState {
  // Datos
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  availableSlots: TimeSlot[];
  
  // UI State
  calendarView: CalendarView;
  selectedDate: Date;
  filters: AppointmentFilters;
  
  // Loading states
  loading: boolean;
  loadingSlots: boolean;
  
  // Error state
  error: string | null;

  // Actions - CRUD
  fetchAppointments: () => Promise<void>;
  fetchAppointmentById: (id: string) => Promise<void>;
  fetchAppointmentsByDate: (date: Date) => Promise<void>;
  fetchAppointmentsByDateRange: (start: Date, end: Date) => Promise<void>;
  fetchAppointmentsByEsthetician: (estheticianId: string) => Promise<void>;
  createAppointment: (data: CreateAppointmentDTO, createdBy: string) => Promise<string>;
  updateAppointment: (id: string, data: UpdateAppointmentDTO) => Promise<void>;
  cancelAppointment: (id: string, cancelledBy: string, reason: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  completeAppointment: (id: string) => Promise<void>;
  markAsNoShow: (id: string) => Promise<void>;
  reassignAppointment: (id: string, newEstheticianId: string, reason?: string) => Promise<void>;
  deleteAppointment: (id: string, deletedBy: string) => Promise<void>;

  // Actions - Availability
  fetchAvailableSlots: (date: Date, estheticianId: string, duration?: number) => Promise<void>;
  checkAvailability: (date: Date, startTime: string, endTime: string, estheticianId: string) => Promise<{ available: boolean; warning?: string }>;

  // Actions - UI
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setCalendarView: (view: CalendarView) => void;
  setSelectedDate: (date: Date) => void;
  setFilters: (filters: Partial<AppointmentFilters>) => void;
  clearFilters: () => void;
  
  // Actions - Utils
  clearError: () => void;
  reset: () => void;
}

const useCases = new AppointmentUseCases();

/**
 * Store de Citas
 */
export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      appointments: [],
      selectedAppointment: null,
      availableSlots: [],
      calendarView: 'day', // Vista por defecto: día
      selectedDate: new Date(),
      filters: {},
      loading: false,
      loadingSlots: false,
      error: null,

      // Obtener todas las citas
      fetchAppointments: async () => {
        set({ loading: true, error: null });
        try {
          const appointments = await useCases.getAllAppointments();
          set({ appointments, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar citas',
            loading: false 
          });
        }
      },

      // Obtener cita por ID
      fetchAppointmentById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const appointment = await useCases.getAppointmentById(id);
          set({ 
            selectedAppointment: appointment,
            loading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar cita',
            loading: false 
          });
        }
      },

      // Obtener citas por fecha
      fetchAppointmentsByDate: async (date: Date) => {
        set({ loading: true, error: null });
        try {
          const appointments = await useCases.getAppointmentsByDate(date);
          set({ appointments, selectedDate: date, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar citas',
            loading: false 
          });
        }
      },

      // Obtener citas por rango
      fetchAppointmentsByDateRange: async (start: Date, end: Date) => {
        set({ loading: true, error: null });
        try {
          const appointments = await useCases.getAppointmentsByDateRange(start, end);
          set({ appointments, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar citas',
            loading: false 
          });
        }
      },

      // Obtener citas por esteticista
      fetchAppointmentsByEsthetician: async (estheticianId: string) => {
        set({ loading: true, error: null });
        try {
          const appointments = await useCases.getAppointmentsByEsthetician(estheticianId);
          set({ appointments, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar citas',
            loading: false 
          });
        }
      },

      // Crear cita
      createAppointment: async (data: CreateAppointmentDTO, createdBy: string) => {
        set({ loading: true, error: null });
        try {
          const id = await useCases.createAppointment(data, createdBy);
          // Recargar citas del día
          await get().fetchAppointmentsByDate(data.date);
          set({ loading: false });
          return id;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al crear cita',
            loading: false 
          });
          throw error;
        }
      },

      // Actualizar cita
      updateAppointment: async (id: string, data: UpdateAppointmentDTO) => {
        set({ loading: true, error: null });
        try {
          await useCases.updateAppointment(id, data);
          
          // Actualizar en el estado local
          const appointments = get().appointments.map(apt =>
            apt.id === id ? { ...apt, ...data } : apt
          );
          
          set({ appointments, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al actualizar cita',
            loading: false 
          });
          throw error;
        }
      },

      // Cancelar cita
      cancelAppointment: async (id: string, cancelledBy: string, reason: string) => {
        set({ loading: true, error: null });
        try {
          await useCases.cancelAppointment(id, cancelledBy, reason);
          
          // Actualizar en el estado local
          const appointments = get().appointments.map(apt =>
            apt.id === id 
              ? { ...apt, status: AppointmentStatus.CANCELLED, cancellationReason: reason }
              : apt
          );
          
          set({ appointments, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cancelar cita',
            loading: false 
          });
          throw error;
        }
      },

      // Confirmar cita
      confirmAppointment: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await useCases.confirmAppointment(id);
          
          const appointments = get().appointments.map(apt =>
            apt.id === id ? { ...apt, status: AppointmentStatus.CONFIRMED } : apt
          );
          
          set({ appointments, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al confirmar cita',
            loading: false 
          });
          throw error;
        }
      },

      // Completar cita
      completeAppointment: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await useCases.completeAppointment(id);
          
          const appointments = get().appointments.map(apt =>
            apt.id === id ? { ...apt, status: AppointmentStatus.COMPLETED } : apt
          );
          
          set({ appointments, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al completar cita',
            loading: false 
          });
          throw error;
        }
      },

      // Marcar como no asistió
      markAsNoShow: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await useCases.markAsNoShow(id);
          
          const appointments = get().appointments.map(apt =>
            apt.id === id ? { ...apt, status: AppointmentStatus.NO_SHOW } : apt
          );
          
          set({ appointments, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al marcar como no show',
            loading: false 
          });
          throw error;
        }
      },

      // Reasignar cita
      reassignAppointment: async (id: string, newEstheticianId: string, reason?: string) => {
        set({ loading: true, error: null });
        try {
          await useCases.reassignAppointment(id, newEstheticianId, reason);
          
          const appointments = get().appointments.map(apt =>
            apt.id === id ? { ...apt, estheticianId: newEstheticianId } : apt
          );
          
          set({ appointments, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al reasignar cita',
            loading: false 
          });
          throw error;
        }
      },

      // Eliminar cita
      deleteAppointment: async (id: string, deletedBy: string) => {
        set({ loading: true, error: null });
        try {
          await useCases.deleteAppointment(id, deletedBy);
          
          const appointments = get().appointments.filter(apt => apt.id !== id);
          
          set({ appointments, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al eliminar cita',
            loading: false 
          });
          throw error;
        }
      },

      // Obtener slots disponibles
      fetchAvailableSlots: async (date: Date, estheticianId: string, duration?: number) => {
        set({ loadingSlots: true, error: null });
        try {
          const slots = await useCases.getAvailableSlots(date, estheticianId, duration);
          set({ availableSlots: slots, loadingSlots: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar horarios',
            loadingSlots: false 
          });
        }
      },

// Verificar disponibilidad
      checkAvailability: async (
        date: Date,
        startTime: string,
        endTime: string,
        estheticianId: string
      ) => {
        try {
          const availabilityService = new AvailabilityService();
          const result = await availabilityService.checkAvailability(
            date,
            startTime,
            endTime,
            estheticianId
          );
          return {
            available: result.available,
            warning: result.warning
          };
        } catch (error) {
          console.error('Error checking availability:', error);
          return { available: false };
        }
      },

      // UI Actions
      setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),
      setCalendarView: (view) => set({ calendarView: view }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setFilters: (newFilters) => set((state) => ({ 
        filters: { ...state.filters, ...newFilters } 
      })),
      clearFilters: () => set({ filters: {} }),
      
      // Utils
      clearError: () => set({ error: null }),
      reset: () => set({
        appointments: [],
        selectedAppointment: null,
        availableSlots: [],
        filters: {},
        error: null
      })
    }),
    {
name: 'appointment-storage',
      partialize: (state) => ({
        calendarView: state.calendarView,
        selectedDate: state.selectedDate
      }),
      onRehydrateStorage: () => (state) => {
        // Convertir selectedDate de string a Date al cargar desde localStorage
        if (state?.selectedDate && typeof state.selectedDate === 'string') {
          state.selectedDate = new Date(state.selectedDate);
        }
      }
    }
  )
);

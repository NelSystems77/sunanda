import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Service, CreateServiceDTO, UpdateServiceDTO } from '../../core/domain/interfaces/Service';
import { ServiceCategory } from '../../core/domain/enums/serviceCategory';
import { ServiceUseCases } from '../../core/application/use-cases/services/ServiceUseCases';

/**
 * Filtros de servicios
 */
export interface ServiceFilters {
  category?: ServiceCategory;
  isActive?: boolean;
  hasPromotion?: boolean;
  searchTerm?: string;
}

/**
 * Estado del store de servicios
 */
interface ServiceState {
  // Datos
  services: Service[];
  selectedService: Service | null;
  
  // UI State
  selectedCategory: ServiceCategory | 'all';
  filters: ServiceFilters;
  
  // Loading states
  loading: boolean;
  error: string | null;

  // Actions - CRUD
  fetchServices: () => Promise<void>;
  fetchActiveServices: () => Promise<void>;
  fetchServiceById: (id: string) => Promise<void>;
  fetchServicesByCategory: (category: ServiceCategory) => Promise<void>;
  fetchServicesWithPromotions: () => Promise<void>;
  searchServices: (searchTerm: string) => Promise<void>;
  createService: (data: CreateServiceDTO) => Promise<string>;
  updateService: (id: string, data: UpdateServiceDTO) => Promise<void>;
  activateService: (id: string) => Promise<void>;
  deactivateService: (id: string) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Actions - UI
  setSelectedService: (service: Service | null) => void;
  setSelectedCategory: (category: ServiceCategory | 'all') => void;
  setFilters: (filters: Partial<ServiceFilters>) => void;
  clearFilters: () => void;
  
  // Actions - Utils
  clearError: () => void;
  reset: () => void;
}

const useCases = new ServiceUseCases();

/**
 * Store de Servicios
 */
export const useServiceStore = create<ServiceState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      services: [],
      selectedService: null,
      selectedCategory: 'all',
      filters: {},
      loading: false,
      error: null,

      // Obtener todos los servicios
      fetchServices: async () => {
        set({ loading: true, error: null });
        try {
          const services = await useCases.getAllServices();
          set({ services, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar servicios',
            loading: false 
          });
        }
      },

      // Obtener servicios activos
      fetchActiveServices: async () => {
        set({ loading: true, error: null });
        try {
          const services = await useCases.getActiveServices();
          set({ services, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar servicios',
            loading: false 
          });
        }
      },

      // Obtener servicio por ID
      fetchServiceById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const service = await useCases.getServiceById(id);
          set({ selectedService: service, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar servicio',
            loading: false 
          });
        }
      },

      // Obtener por categoría
      fetchServicesByCategory: async (category: ServiceCategory) => {
        set({ loading: true, error: null });
        try {
          const services = await useCases.getServicesByCategory(category);
          set({ services, selectedCategory: category, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar servicios',
            loading: false 
          });
        }
      },

      // Obtener con promociones
      fetchServicesWithPromotions: async () => {
        set({ loading: true, error: null });
        try {
          const services = await useCases.getServicesWithPromotions();
          set({ services, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar servicios',
            loading: false 
          });
        }
      },

      // Buscar
      searchServices: async (searchTerm: string) => {
        set({ loading: true, error: null });
        try {
          const services = await useCases.searchServices(searchTerm);
          set({ services, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error en la búsqueda',
            loading: false 
          });
        }
      },

      // Crear servicio
      createService: async (data: CreateServiceDTO) => {
        set({ loading: true, error: null });
        try {
          const id = await useCases.createService(data);
          await get().fetchActiveServices();
          set({ loading: false });
          return id;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al crear servicio',
            loading: false 
          });
          throw error;
        }
      },

      // Actualizar servicio
      updateService: async (id: string, data: UpdateServiceDTO) => {
        set({ loading: true, error: null });
        try {
          await useCases.updateService(id, data);
          
          // Actualizar en el estado local
          const services = get().services.map(service =>
            service.id === id ? { ...service, ...data } : service
          );
          
          set({ services, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al actualizar servicio',
            loading: false 
          });
          throw error;
        }
      },

      // Activar servicio
      activateService: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await useCases.activateService(id);
          
          const services = get().services.map(service =>
            service.id === id ? { ...service, isActive: true } : service
          );
          
          set({ services, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al activar servicio',
            loading: false 
          });
          throw error;
        }
      },

      // Desactivar servicio
      deactivateService: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await useCases.deactivateService(id);
          
          const services = get().services.map(service =>
            service.id === id ? { ...service, isActive: false } : service
          );
          
          set({ services, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al desactivar servicio',
            loading: false 
          });
          throw error;
        }
      },

      // Eliminar servicio
      deleteService: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await useCases.deleteService(id);
          
          const services = get().services.filter(service => service.id !== id);
          
          set({ services, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al eliminar servicio',
            loading: false 
          });
          throw error;
        }
      },

      // UI Actions
      setSelectedService: (service) => set({ selectedService: service }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setFilters: (newFilters) => set((state) => ({ 
        filters: { ...state.filters, ...newFilters } 
      })),
      clearFilters: () => set({ filters: {} }),
      
      // Utils
      clearError: () => set({ error: null }),
      reset: () => set({
        services: [],
        selectedService: null,
        filters: {},
        error: null
      })
    }),
    {
      name: 'service-storage',
      partialize: (state) => ({
        selectedCategory: state.selectedCategory
      })
    }
  )
);

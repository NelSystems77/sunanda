import { useCallback, useEffect } from 'react';
import { useServiceStore } from '../context/ServiceStore';
import { CreateServiceDTO, UpdateServiceDTO } from '../../core/domain/interfaces/Service';
import { ServiceCategory } from '../../core/domain/enums/serviceCategory';
import toast from 'react-hot-toast';

/**
 * Hook personalizado para gestión de servicios
 */
export function useServices() {
  const {
    services,
    selectedService,
    selectedCategory,
    filters,
    loading,
    error,
    
    // Actions
    fetchServices,
    fetchActiveServices,
    fetchServiceById,
    fetchServicesByCategory,
    fetchServicesWithPromotions,
    searchServices,
    createService: createServiceStore,
    updateService: updateServiceStore,
    activateService: activateServiceStore,
    deactivateService: deactivateServiceStore,
    deleteService: deleteServiceStore,
    
    // UI
    setSelectedService,
    setSelectedCategory,
    setFilters,
    clearFilters,
    clearError,
    reset
  } = useServiceStore();

  // Mostrar errores como toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  /**
   * Crear servicio con manejo de errores
   */
  const createService = useCallback(async (data: CreateServiceDTO) => {
    try {
      const id = await createServiceStore(data);
      toast.success('Servicio creado exitosamente');
      return id;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear servicio');
      return null;
    }
  }, [createServiceStore]);

  /**
   * Actualizar servicio con manejo de errores
   */
  const updateService = useCallback(async (id: string, data: UpdateServiceDTO) => {
    try {
      await updateServiceStore(id, data);
      toast.success('Servicio actualizado exitosamente');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar servicio');
      return false;
    }
  }, [updateServiceStore]);

  /**
   * Activar servicio
   */
  const activateService = useCallback(async (id: string) => {
    try {
      await activateServiceStore(id);
      toast.success('Servicio activado');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al activar servicio');
      return false;
    }
  }, [activateServiceStore]);

  /**
   * Desactivar servicio
   */
  const deactivateService = useCallback(async (id: string) => {
    try {
      await deactivateServiceStore(id);
      toast.success('Servicio desactivado');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al desactivar servicio');
      return false;
    }
  }, [deactivateServiceStore]);

  /**
   * Eliminar servicio
   */
  const deleteService = useCallback(async (id: string) => {
    try {
      await deleteServiceStore(id);
      toast.success('Servicio eliminado');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar servicio');
      return false;
    }
  }, [deleteServiceStore]);

  /**
   * Filtrar servicios localmente
   */
  const filteredServices = useCallback(() => {
    let filtered = [...services];

    if (filters.category) {
      filtered = filtered.filter(s => s.category === filters.category);
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter(s => s.isActive === filters.isActive);
    }

    if (filters.hasPromotion !== undefined) {
      filtered = filtered.filter(s => s.hasPromotion === filters.hasPromotion);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [services, filters]);

  /**
   * Obtener servicios por categoría local
   */
  const servicesByCategory = useCallback((category: ServiceCategory) => {
    return services.filter(s => s.category === category && s.isActive);
  }, [services]);

  /**
   * Obtener estadísticas rápidas
   */
  const stats = useCallback(() => {
    const total = services.length;
    const active = services.filter(s => s.isActive).length;
    const inactive = services.filter(s => !s.isActive).length;
    const withPromotions = services.filter(s => s.hasPromotion).length;
    
    const byCategory = {
      [ServiceCategory.FACIAL]: services.filter(s => s.category === ServiceCategory.FACIAL).length,
      [ServiceCategory.CORPORAL]: services.filter(s => s.category === ServiceCategory.CORPORAL).length,
      [ServiceCategory.PAQUETE]: services.filter(s => s.category === ServiceCategory.PAQUETE).length
    };

    return {
      total,
      active,
      inactive,
      withPromotions,
      byCategory
    };
  }, [services]);

  /**
   * Formatear precio
   */
  const formatPrice = useCallback((priceCRC: number, priceUSD: number, showBoth: boolean = false) => {
    if (showBoth) {
      return `₡${priceCRC.toLocaleString()} (~$${priceUSD})`;
    }
    return `₡${priceCRC.toLocaleString()}`;
  }, []);

  return {
    // Estado
    services,
    selectedService,
    selectedCategory,
    filters,
    loading,
    error,

    // Acciones CRUD
    fetchServices,
    fetchActiveServices,
    fetchServiceById,
    fetchServicesByCategory,
    fetchServicesWithPromotions,
    searchServices,
    createService,
    updateService,
    activateService,
    deactivateService,
    deleteService,

    // UI
    setSelectedService,
    setSelectedCategory,
    setFilters,
    clearFilters,
    reset,

    // Helpers
    filteredServices,
    servicesByCategory,
    stats,
    formatPrice
  };
}

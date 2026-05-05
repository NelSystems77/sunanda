import { useState } from 'react';
import { AppointmentStatus } from '@/core/domain/enums';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface AppointmentFiltersProps {
  onFilterChange: (filters: {
    estheticianId?: string;
    clientId?: string;
    serviceId?: string;
    status?: AppointmentStatus;
  }) => void;
  onClear: () => void;
}

/**
 * Componente de filtros para citas
 * Permite filtrar por esteticista, cliente, servicio y estado
 */
export function AppointmentFilters({
  onFilterChange,
  onClear
}: AppointmentFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estheticianId: '',
    clientId: '',
    serviceId: '',
    status: '' as AppointmentStatus | ''
  });

  /**
   * Aplicar filtros
   */
  const handleApply = () => {
    const activeFilters: any = {};
    
    if (filters.estheticianId) activeFilters.estheticianId = filters.estheticianId;
    if (filters.clientId) activeFilters.clientId = filters.clientId;
    if (filters.serviceId) activeFilters.serviceId = filters.serviceId;
    if (filters.status) activeFilters.status = filters.status;

    onFilterChange(activeFilters);
    setShowFilters(false);
  };

  /**
   * Limpiar filtros
   */
  const handleClear = () => {
    setFilters({
      estheticianId: '',
      clientId: '',
      serviceId: '',
      status: ''
    });
    onClear();
  };

  /**
   * Contar filtros activos
   */
  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="relative">
      {/* Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="relative"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filtros
        {activeFiltersCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20"
          >
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Esthetician Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Esteticista
                </label>
                <select
                  value={filters.estheticianId}
                  onChange={(e) => setFilters({ ...filters, estheticianId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">Todas</option>
                  <option value="esthetician-1">Esteticista 1</option>
                  <option value="esthetician-2">Esteticista 2</option>
                  <option value="esthetician-3">Esteticista 3</option>
                </select>
              </div>

              {/* Service Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servicio
                </label>
                <select
                  value={filters.serviceId}
                  onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">Todos</option>
                  <option value="service-1">Limpieza Facial</option>
                  <option value="service-2">Masaje Corporal</option>
                  <option value="service-3">Tratamiento Completo</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as AppointmentStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">Todos</option>
                  <option value={AppointmentStatus.PENDING}>Pendiente</option>
                  <option value={AppointmentStatus.CONFIRMED}>Confirmada</option>
                  <option value={AppointmentStatus.COMPLETED}>Completada</option>
                  <option value={AppointmentStatus.CANCELLED}>Cancelada</option>
                  <option value={AppointmentStatus.NO_SHOW}>No asistió</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1"
                  size="sm"
                >
                  Limpiar
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1"
                  size="sm"
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

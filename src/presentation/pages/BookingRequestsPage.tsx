/**
 * BookingRequestsPage (Admin)
 * 
 * Panel para que el staff gestione las solicitudes de citas
 * - Ver todas las solicitudes
 * - Filtrar por estado
 * - Buscar
 * - Confirmar/Rechazar
 */

import { useEffect, useState } from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { bookingRequestRepository } from '@/core/infrastructure/repositories/BookingRequestRepository';
import { BookingRequestStatus } from '@/core/domain/interfaces/BookingRequest';
import { useBookingRequestStore } from '@/presentation/context/BookingRequestStore';
import { BookingRequestCard } from '@/presentation/components/features/BookingRequestCard';
import { DashboardLayout } from '@/presentation/components/layout/DashboardLayout';
import { PageHeader } from '@/presentation/components/layout/PageHeader';
import { Input } from '@/presentation/components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '@/presentation/components/ui/Tabs';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { EmptyState } from '@/presentation/components/layout/EmptyState';
import { StatsCard } from '@/presentation/components/features/StatsCard';

export function BookingRequestsPage() {
  const {
    setRequests,
    loading,
    setLoading,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    stats,
    getFilteredRequests,
  } = useBookingRequestStore();

  const [refreshKey, setRefreshKey] = useState(0);

  // Cargar solicitudes
  useEffect(() => {
    loadRequests();
  }, [refreshKey]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const allRequests = await bookingRequestRepository.getAll();
      setRequests(allRequests);
    } catch (error) {
      console.error('Error loading booking requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Tabs de estado
  const statusTabs = [
    { id: 'all', label: 'Todas', count: stats.total },
    { id: BookingRequestStatus.PENDING, label: 'Pendientes', count: stats.pending },
    { id: BookingRequestStatus.CONFIRMED, label: 'Confirmadas', count: stats.confirmed },
    { id: BookingRequestStatus.REJECTED, label: 'Rechazadas', count: stats.rejected },
  ];

  const filteredRequests = getFilteredRequests();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Solicitudes de Citas"
        description="Gestiona las solicitudes de los clientes"
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total"
          value={stats.total}
          icon={Calendar}
          variant="default"
        />
        <StatsCard
          title="Pendientes"
          value={stats.pending}
          icon={Calendar}
          variant="warning"
        />
        <StatsCard
          title="Confirmadas"
          value={stats.confirmed}
          icon={Calendar}
          variant="success"
        />
        <StatsCard
          title="Rechazadas"
          value={stats.rejected}
          icon={Calendar}
          variant="danger"
        />
      </div>

      {/* Filtros */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre, email, teléfono o servicio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* Tabs de estado */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-5 w-5 text-dark-400" />
            <span className="text-sm text-dark-400 font-medium">Estado</span>
          </div>
          <Tabs defaultValue={statusFilter} onChange={(id) => setStatusFilter(id as typeof statusFilter)}>
            <TabsList>
              {statusTabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}{tab.count > 0 ? ` (${tab.count})` : ''}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Lista de solicitudes */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No hay solicitudes"
          description={
            searchQuery
              ? "No se encontraron solicitudes con los filtros seleccionados"
              : statusFilter === 'all'
              ? "Aún no hay solicitudes de citas"
              : `No hay solicitudes en estado "${statusTabs.find(t => t.id === statusFilter)?.label}"`
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <BookingRequestCard
              key={request.id}
              request={request}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      {filteredRequests.length > 0 && (
        <div className="text-center">
          <p className="text-dark-400 text-sm">
            Mostrando <span className="text-white font-semibold">{filteredRequests.length}</span> de{' '}
            <span className="text-white font-semibold">{stats.total}</span> solicitudes
          </p>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}

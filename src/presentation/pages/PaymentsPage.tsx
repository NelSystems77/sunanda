/**
 * PaymentsPage (Admin)
 * 
 * Página para gestionar y ver historial de pagos
 * - Lista de pagos
 * - Filtros por estado y método
 * - Estadísticas
 * - Detalles de cada pago
 */

import { useEffect, useState } from 'react';
import { DollarSign, Search, Filter, CreditCard, Smartphone, Banknote, Plus } from 'lucide-react';
import { PaymentForm } from '../components/features/PaymentForm';
import { paymentRepository } from '@/core/infrastructure/repositories/PaymentRepository';
import { PaymentMethod, PaymentStatus } from '@/core/domain/interfaces/Payment';
import { usePaymentStore } from '../context/PaymentStore';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Input } from '../components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/layout/EmptyState';
import { StatsCard } from '../components/features/StatsCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function PaymentsPage() {
  const {
    setPayments,
    loading,
    setLoading,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    searchQuery,
    setSearchQuery,
    stats,
    getFilteredPayments,
  } = usePaymentStore();

  const [refreshKey, setRefreshKey] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Cargar pagos
  useEffect(() => {
    loadPayments();
  }, [refreshKey]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const allPayments = await paymentRepository.getAll();
      setPayments(allPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tabs de estado
  const statusTabs = [
    { id: 'all', label: 'Todos', count: stats.total },
    { id: PaymentStatus.PENDING, label: 'Pendientes', count: stats.pending },
    { id: PaymentStatus.COMPLETED, label: 'Completados', count: stats.completed },
    { id: PaymentStatus.FAILED, label: 'Fallidos', count: stats.failed },
    { id: PaymentStatus.REFUNDED, label: 'Reembolsados', count: stats.refunded },
  ];

  // Tabs de método
  const methodTabs = [
    { id: 'all', label: 'Todos' },
    { id: PaymentMethod.CASH, label: 'Efectivo' },
    { id: PaymentMethod.SINPE_MOVIL, label: 'SINPE' },
    { id: PaymentMethod.STRIPE_CARD, label: 'Tarjeta' },
  ];

  const filteredPayments = getFilteredPayments();

  // Badge de estado
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
      case PaymentStatus.PROCESSING:
        return <Badge variant="warning">Pendiente</Badge>;
      case PaymentStatus.COMPLETED:
        return <Badge variant="success">Completado</Badge>;
      case PaymentStatus.FAILED:
        return <Badge variant="danger">Fallido</Badge>;
      case PaymentStatus.REFUNDED:
        return <Badge variant="default">Reembolsado</Badge>;
      default:
        return null;
    }
  };

  // Icono de método
  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.STRIPE_CARD:
        return <CreditCard className="h-4 w-4" />;
      case PaymentMethod.SINPE_MOVIL:
        return <Smartphone className="h-4 w-4" />;
      case PaymentMethod.CASH:
        return <Banknote className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="Pagos"
          description="Gestión de pagos y transacciones"
        />
        <button
          onClick={() => setShowPaymentForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo pago
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Pagos"
          value={stats.total}
          icon={DollarSign}
          variant="default"
        />
        <StatsCard
          title="Completados"
          value={stats.completed}
          icon={DollarSign}
          variant="success"
        />
        <StatsCard
          title="Total CRC"
          value={`₡${stats.totalAmountCRC.toLocaleString()}`}
          icon={DollarSign}
          variant="primary"
        />
        <StatsCard
          title="Total USD"
          value={`$${stats.totalAmountUSD.toLocaleString()}`}
          icon={DollarSign}
          variant="primary"
        />
      </div>

      {/* Filtros */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
          <Input
            type="text"
            placeholder="Buscar por descripción, factura o ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* Filtro por estado */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-5 w-5 text-dark-400" />
            <span className="text-sm text-dark-400 font-medium">Estado</span>
          </div>
          <Tabs defaultValue={statusFilter} onChange={(id) => setStatusFilter(id as typeof statusFilter)}>
            <TabsList>
              {statusTabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}{tab.count !== undefined ? ` (${tab.count})` : ''}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Filtro por método */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-5 w-5 text-dark-400" />
            <span className="text-sm text-dark-400 font-medium">Método</span>
          </div>
          <Tabs defaultValue={methodFilter} onChange={(id) => setMethodFilter(id as typeof methodFilter)}>
            <TabsList>
              {methodTabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Lista de pagos */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No hay pagos"
          description="No se encontraron pagos con los filtros seleccionados"
        />
      ) : (
        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {format(payment.createdAt, 'dd MMM yyyy', { locale: es })}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      <div>{payment.description}</div>
                      {payment.invoiceNumber && (
                        <div className="text-xs text-dark-400">
                          Factura: {payment.invoiceNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2 text-dark-300">
                        {getMethodIcon(payment.paymentMethod)}
                        <span>
                          {payment.paymentMethod === PaymentMethod.STRIPE_CARD && 'Tarjeta'}
                          {payment.paymentMethod === PaymentMethod.SINPE_MOVIL && 'SINPE'}
                          {payment.paymentMethod === PaymentMethod.CASH && 'Efectivo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-semibold text-white">
                        ₡{payment.amountCRC.toLocaleString()}
                      </div>
                      <div className="text-xs text-dark-400">
                        ${payment.amountUSD}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contador */}
      {filteredPayments.length > 0 && (
        <div className="text-center">
          <p className="text-dark-400 text-sm">
            Mostrando <span className="text-white font-semibold">{filteredPayments.length}</span> de{' '}
            <span className="text-white font-semibold">{stats.total}</span> pagos
          </p>
        </div>
      )}
    </div>

    {/* Modal nuevo pago */}
    {showPaymentForm && (
      <PaymentForm
        onSuccess={() => {
          setShowPaymentForm(false);
          setRefreshKey(k => k + 1);
        }}
        onCancel={() => setShowPaymentForm(false)}
      />
    )}

    </DashboardLayout>
  );
}

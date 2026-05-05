import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { CardGrid, StatCard, ResponsiveTable } from '../components/ui/responsive';
import { useMedicalRecords } from '../hooks/useMedicalRecords';
import { MedicalRecordModal } from '../components/features/MedicalRecordModal';
import { Search, FileText, Calendar, User, CheckCircle, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function RecordsPage() {
  const { records, loading } = useMedicalRecords();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const filteredRecords = records.filter(record =>
    record.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenRecord = (clientId: string, clientName: string) => {
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    setShowModal(true);
  };

  const stats = {
    total: records.length,
    conAnamnesis: records.filter(r => r.anamnesis).length,
    sesionesTotal: records.reduce((sum, r) => sum + (r.sesiones?.length || 0), 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Expedientes"
          description="Historiales médicos y estéticos de clientes"
          breadcrumbs={[{ label: 'Expedientes' }]}
        />

        {/* Stats - Responsive */}
        <CardGrid columns={3}>
          <StatCard
            label="Total Expedientes"
            value={stats.total}
            icon={FolderOpen}
            color="blue"
          />
          <StatCard
            label="Con Anamnesis"
            value={stats.conAnamnesis}
            icon={CheckCircle}
            color="gold"
            trend={
              stats.total > 0
                ? {
                    value: Math.round((stats.conAnamnesis / stats.total) * 100),
                    isPositive: true,
                  }
                : undefined
            }
          />
          <StatCard
            label="Sesiones Totales"
            value={stats.sesionesTotal}
            icon={Calendar}
            color="green"
          />
        </CardGrid>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Buscar por nombre del cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-400"
          />
        </div>

        {/* Lista de Expedientes - Responsive */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
            <p className="mt-4 text-dark-300">Cargando expedientes...</p>
          </div>
        ) : (
          <ResponsiveTable
            data={filteredRecords}
            columns={[
              {
                header: 'Cliente',
                accessor: (record) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{record.clientName}</div>
                      <div className="text-xs text-dark-400">
                        Exp. #{record.id.slice(0, 8)}
                      </div>
                    </div>
                  </div>
                ),
                mobileLabel: 'Cliente'
              },
              {
                header: 'Fecha Apertura',
                accessor: (record) => (
                  <div className="flex items-center gap-2 text-dark-300">
                    <Calendar className="w-4 h-4" />
                    <span>{record.createdAt.toLocaleDateString('es-ES')}</span>
                  </div>
                ),
                mobileLabel: 'Apertura'
              },
              {
                header: 'Sesiones',
                accessor: (record) => (
                  <span className="font-bold text-gold-400">
                    {record.sesiones?.length || 0}
                  </span>
                ),
                mobileLabel: 'Sesiones',
                className: 'text-center'
              },
              {
                header: 'Anamnesis',
                accessor: (record) => (
                  record.anamnesis ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                      <CheckCircle className="w-3 h-3" />
                      Completa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                      Pendiente
                    </span>
                  )
                ),
                mobileLabel: 'Anamnesis'
              },
              {
                header: 'Última Actualización',
                accessor: (record) => (
                  <span className="text-sm text-dark-400">
                    {record.updatedAt?.toLocaleDateString('es-ES') || 'N/A'}
                  </span>
                ),
                mobileLabel: 'Actualizado'
              }
            ]}
            keyExtractor={(record) => record.id}
            onRowClick={(record) => handleOpenRecord(record.clientId, record.clientName)}
            emptyMessage={
              searchTerm 
                ? 'No se encontraron expedientes con ese criterio' 
                : 'No hay expedientes registrados'
            }
          />
        )}
      </div>

      {/* Modal de Expediente */}
      {showModal && selectedClientId && (
        <MedicalRecordModal
          clientId={selectedClientId}
          clientName={selectedClientName}
          onClose={() => {
            setShowModal(false);
            setSelectedClientId(null);
            setSelectedClientName('');
          }}
        />
      )}
    </DashboardLayout>
  );
}

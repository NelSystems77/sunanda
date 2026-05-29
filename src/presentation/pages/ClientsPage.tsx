import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users as UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/layout/EmptyState';
import { ClientCard } from '../components/features/ClientCard';
import { ResponsiveModal } from '../components/ui/responsive';
import { ClientForm } from '../components/features/ClientForm';
import { useClientStore } from '../context/ClientStore';
import { Client } from '@/core/domain/interfaces/Client';
import { debounce } from '@/shared/utils';

export function ClientsPage() {
  const navigate = useNavigate();
  const {
    clients,
    isLoading,
    fetchClients,
    searchClients,
    createClient,
  } = useClientStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManage = true;

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Debounced search
  const handleSearch = debounce(async (term: string) => {
    if (term.trim().length >= 2) {
      await searchClients(term);
    } else if (term.trim().length === 0) {
      await fetchClients();
    }
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleCreateClient = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createClient(data);
      toast.success('Cliente creado correctamente');
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error ya manejado en el store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientClick = (client: Client) => {
    navigate(`/dashboard/clients/${client.id}`);
  };

  if (isLoading && clients.length === 0) {
    return (
      <DashboardLayout>
        <Spinner fullScreen text="Cargando clientes..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Clientes"
          description="Gestión de clientes y pacientes"
          breadcrumbs={[{ label: 'Clientes' }]}
          actions={
            canManage && (
              <Button
                variant="primary"
                leftIcon={<Plus className="w-5 h-5" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Nuevo Cliente
              </Button>
            )
          }
        />

        {/* Búsqueda */}
        <div className="max-w-md">
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Search className="w-5 h-5" />}
            fullWidth
          />
        </div>

        {/* Lista de Clientes */}
        {clients.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No hay clientes"
            description={
              searchTerm
                ? 'No se encontraron clientes con ese criterio de búsqueda'
                : 'Comienza agregando tu primer cliente'
            }
            action={
              canManage && !searchTerm
                ? {
                    label: 'Agregar Cliente',
                    onClick: () => setIsCreateModalOpen(true),
                    icon: <Plus className="w-5 h-5" />,
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={handleClientClick}
              />
            ))}
          </div>
        )}

        {/* Modal Crear Cliente - Responsive */}
        <ResponsiveModal
          isOpen={isCreateModalOpen}
          onClose={() => !isSubmitting && setIsCreateModalOpen(false)}
          title="Nuevo Cliente"
          size="xl"
        >
          <ClientForm
            onSubmit={handleCreateClient}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isSubmitting}
          />
        </ResponsiveModal>
      </div>
    </DashboardLayout>
  );
}

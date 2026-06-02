import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';
import { Modal, ModalFooter } from '../components/ui/Modal';
import { Alert } from '../components/ui/Alert';
import { ClientForm } from '../components/features/ClientForm';
import { MedicalRecordModal } from '../components/features/MedicalRecordModal';
import { useClientStore } from '../context/ClientStore';
import { formatDate, formatPhoneNumber, calculateAge } from '@/shared/utils';

const genderLabels = {
  MALE: 'Masculino',
  FEMALE: 'Femenino',
  OTHER: 'Otro',
};

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedClient,
    isLoading,
    fetchClientById,
    updateClient,
    deleteClient,
  } = useClientStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMedicalRecordOpen, setIsMedicalRecordOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManage = true;

  useEffect(() => {
    if (id) {
      fetchClientById(id);
    }
  }, [id, fetchClientById]);

  const handleUpdate = async (data: any) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await updateClient(id, data);
      toast.success('Cliente actualizado correctamente');
      setIsEditModalOpen(false);
    } catch (error) {
      // Error ya manejado en el store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await deleteClient(id);
      toast.success('Cliente eliminado correctamente');
      navigate('/dashboard/clients');
    } catch (error) {
      toast.error('Error al eliminar cliente');
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading || !selectedClient) {
    return (
      <DashboardLayout>
        <Spinner fullScreen text="Cargando cliente..." />
      </DashboardLayout>
    );
  }

  const client = selectedClient;
  const fullName = `${client.firstName} ${client.lastName}`;
  const age = calculateAge(client.dateOfBirth);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={fullName}
          description="Información completa del cliente"
          breadcrumbs={[
            { label: 'Clientes', href: '/dashboard/clients' },
            { label: fullName },
          ]}
          actions={
            canManage && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  leftIcon={<Edit className="w-5 h-5" />}
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  leftIcon={<Trash2 className="w-5 h-5" />}
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Eliminar
                </Button>
              </div>
            )
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6 mb-6">
                  <Avatar src={client.photoURL} name={fullName} size="xl" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
                      {fullName}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="primary">
                        {age} años
                      </Badge>
                      <Badge variant="default">
                        {genderLabels[client.gender]}
                      </Badge>
                      {client.totalVisits > 0 && (
                        <Badge variant="success">
                          {client.totalVisits} {client.totalVisits === 1 ? 'visita' : 'visitas'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm font-medium text-dark-900 dark:text-white">
                        {client.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Teléfono</p>
                      <p className="text-sm font-medium text-dark-900 dark:text-white">
                        {formatPhoneNumber(client.phoneNumber)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Fecha de Nacimiento</p>
                      <p className="text-sm font-medium text-dark-900 dark:text-white">
                        {formatDate(client.dateOfBirth)}
                      </p>
                    </div>
                  </div>

                  {client.city && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Ciudad</p>
                        <p className="text-sm font-medium text-dark-900 dark:text-white">
                          {client.city}, {client.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {client.address && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dirección</p>
                    <p className="text-sm text-dark-900 dark:text-white">{client.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información Médica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Médica</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {client.skinType && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo de Piel
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{client.skinType}</p>
                    </div>
                  )}

                  {client.allergies && client.allergies.length > 0 && (
                    <Alert variant="warning">
                      <div>
                        <p className="font-medium mb-2">Alergias</p>
                        <div className="flex flex-wrap gap-2">
                          {client.allergies.map((allergy, index) => (
                            <Badge key={index} variant="warning" size="sm">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Alert>
                  )}

                  {client.medications && client.medications.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Medicamentos
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {client.medications.map((medication, index) => (
                          <Badge key={index} variant="info" size="sm">
                            {medication}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {client.medicalHistory && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Historial Médico
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {client.medicalHistory}
                      </p>
                    </div>
                  )}

                  {client.notes && (
                    <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notas Adicionales
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {client.notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total de Visitas
                      </span>
                    </div>
                    <span className="text-lg font-bold text-dark-900 dark:text-white">
                      {client.totalVisits}
                    </span>
                  </div>

                  {client.lastVisit && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Última Visita
                        </span>
                      </div>
                      <span className="text-sm font-medium text-dark-900 dark:text-white">
                        {formatDate(client.lastVisit)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Cliente Desde
                      </span>
                    </div>
                    <span className="text-sm font-medium text-dark-900 dark:text-white">
                      {formatDate(client.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tratamientos Previos */}
            {client.previousTreatments && client.previousTreatments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tratamientos Previos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {client.previousTreatments.map((treatment, index) => (
                      <Badge key={index} variant="primary" size="sm">
                        {treatment}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/dashboard/appointments')}
                  >
                    Nueva Cita
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/dashboard/records')}
                  >
                    Ver Expedientes
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    leftIcon={<FileText className="w-4 h-4" />}
                    onClick={() => setIsMedicalRecordOpen(true)}
                  >
                    Abrir Expediente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal Editar */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => !isSubmitting && setIsEditModalOpen(false)}
          title="Editar Cliente"
          description="Actualiza la información del cliente"
          size="xl"
        >
          <ClientForm
            client={client}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>

        {/* Modal Eliminar */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
          title="Eliminar Cliente"
          description="¿Estás seguro de que deseas eliminar este cliente?"
          size="sm"
        >
          <Alert variant="error">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Esta acción no se puede deshacer</p>
              <p className="text-sm mt-1">
                Se eliminará toda la información del cliente, incluyendo su historial.
              </p>
            </div>
          </Alert>

          <ModalFooter className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isSubmitting}
            >
              Eliminar
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      {/* Modal Expediente */}
      {isMedicalRecordOpen && client && (
        <MedicalRecordModal
          clientId={client.id}
          clientName={fullName}
          clientGender={client.gender}
          onClose={() => setIsMedicalRecordOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}

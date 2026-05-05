/**
 * BookingRequestCard Component
 * 
 * Tarjeta para mostrar solicitud de cita en el panel admin
 * Acciones:
 * - Confirmar (crear cita + cambiar status)
 * - Rechazar (con motivo)
 * - Ver detalles
 */

import { useState } from 'react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  XCircle,
  MessageSquare,
  Globe,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BookingRequest, BookingRequestStatus } from '@/core/domain/interfaces/BookingRequest';
import { BookingRequestRepository } from '@/core/infrastructure/repositories/BookingRequestRepository';
import { useAuthStore } from '../../context/AuthStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';

interface BookingRequestCardProps {
  request: BookingRequest;
  onUpdate: () => void;
}

export function BookingRequestCard({ request, onUpdate }: BookingRequestCardProps) {
  const { user } = useAuthStore();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Badge de estado
  const getStatusBadge = () => {
    switch (request.status) {
      case BookingRequestStatus.PENDING:
        return <Badge variant="warning">Pendiente</Badge>;
      case BookingRequestStatus.CONFIRMED:
        return <Badge variant="success">Confirmada</Badge>;
      case BookingRequestStatus.REJECTED:
        return <Badge variant="error">Rechazada</Badge>;
      case BookingRequestStatus.CANCELLED:
        return <Badge variant="default">Cancelada</Badge>;
      default:
        return null;
    }
  };

  // Confirmar solicitud
  const handleConfirm = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // TODO: En producción, aquí se debe crear la cita (Appointment)
      // y vincularla con appointmentId

      await BookingRequestRepository.updateStatus(request.id, {
        status: BookingRequestStatus.CONFIRMED,
        processedBy: user.uid,
      });

      toast.success('Solicitud confirmada. Recuerda contactar al cliente.');
      onUpdate();
    } catch (error) {
      console.error('Error confirming request:', error);
      toast.error('Error al confirmar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  // Rechazar solicitud
  const handleReject = async () => {
    if (!user || !rejectionReason.trim()) {
      toast.error('Debes proporcionar un motivo');
      return;
    }

    try {
      setLoading(true);

      await BookingRequestRepository.updateStatus(request.id, {
        status: BookingRequestStatus.REJECTED,
        processedBy: user.uid,
        rejectionReason: rejectionReason,
      });

      toast.success('Solicitud rechazada. Recuerda contactar al cliente.');
      setShowRejectModal(false);
      onUpdate();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Error al rechazar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const dateLocale = request.clientLanguage === 'es' ? es : enUS;

  return (
    <>
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-primary-500/30 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">
                {request.clientName}
              </h3>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-400">
              <Globe className="h-4 w-4" />
              <span>{request.clientLanguage === 'es' ? 'Español' : 'English'}</span>
            </div>
          </div>

          {/* Fecha de creación */}
          <div className="text-right">
            <div className="text-xs text-dark-400">Recibida</div>
            <div className="text-sm text-dark-300">
              {format(request.createdAt, 'dd MMM yyyy', { locale: dateLocale })}
            </div>
            <div className="text-xs text-dark-400">
              {format(request.createdAt, 'HH:mm')}
            </div>
          </div>
        </div>

        {/* Servicio solicitado */}
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-dark-400 mb-1">
                <Sparkles className="h-4 w-4" />
                <span>Servicio</span>
              </div>
              <div className="text-white font-semibold mb-2">
                {request.serviceName}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-dark-300">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {request.serviceDuration} min
                </span>
                <span className="text-primary-400 font-bold">
                  ₡{request.servicePriceCRC.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información del cliente */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-dark-400 flex-shrink-0" />
            <span className="text-dark-200">{request.clientEmail}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-dark-400 flex-shrink-0" />
            <span className="text-dark-200">{request.clientPhone}</span>
          </div>
        </div>

        {/* Fecha y hora solicitada */}
        <div className="bg-dark-900/50 border border-dark-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-dark-400 mb-1">Fecha solicitada</div>
              <div className="flex items-center gap-2 text-white font-semibold">
                <Calendar className="h-4 w-4 text-primary-400" />
                {format(request.requestedDate, 'dd MMM yyyy', { locale: dateLocale })}
              </div>
            </div>
            <div>
              <div className="text-xs text-dark-400 mb-1">Hora</div>
              <div className="flex items-center gap-2 text-white font-semibold">
                <Clock className="h-4 w-4 text-primary-400" />
                {request.requestedTime}
              </div>
            </div>
          </div>

          {request.flexibleTime && (
            <div className="mt-3 pt-3 border-t border-dark-700">
              <div className="text-xs text-dark-400 mb-1">Horario flexible</div>
              <div className="text-sm text-primary-400">
                Prefiere: {request.preferredTimeSlot === 'morning' && 'Mañana (9AM-12PM)'}
                {request.preferredTimeSlot === 'afternoon' && 'Tarde (12PM-6PM)'}
                {request.preferredTimeSlot === 'evening' && 'Noche (6PM-9PM)'}
              </div>
            </div>
          )}
        </div>

        {/* Notas */}
        {request.notes && (
          <div className="bg-dark-900/50 border border-dark-700 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-dark-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-dark-400 mb-1">Notas del cliente</div>
                <p className="text-sm text-dark-200">{request.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Información de procesamiento */}
        {request.status !== BookingRequestStatus.PENDING && (
          <div className="bg-dark-900/50 border border-dark-700 rounded-lg p-4 mb-4">
            <div className="text-xs text-dark-400 mb-2">Procesada</div>
            {request.processedAt && (
              <div className="text-sm text-dark-200 mb-1">
                {format(request.processedAt, 'dd MMM yyyy HH:mm', { locale: dateLocale })}
              </div>
            )}
            {request.rejectionReason && (
              <div className="mt-2 pt-2 border-t border-dark-700">
                <div className="text-xs text-dark-400 mb-1">Motivo</div>
                <p className="text-sm text-dark-200">{request.rejectionReason}</p>
              </div>
            )}
          </div>
        )}

        {/* Acciones (solo si está pendiente) */}
        {request.status === BookingRequestStatus.PENDING && (
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirmar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRejectModal(true)}
              disabled={loading}
              className="flex-1 border-red-500/30 hover:border-red-500 text-red-400 hover:bg-red-500/10"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rechazar
            </Button>
          </div>
        )}

        {/* Enlaces rápidos para contactar */}
        {request.status === BookingRequestStatus.PENDING && (
          <div className="mt-4 pt-4 border-t border-dark-700 flex gap-2">
            <a
              href={`https://wa.me/${request.clientPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="ghost" size="sm" className="w-full text-green-400 hover:bg-green-500/10">
                <Phone className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </a>
            <a
              href={`mailto:${request.clientEmail}`}
              className="flex-1"
            >
              <Button variant="ghost" size="sm" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </a>
          </div>
        )}
      </div>

      {/* Modal de rechazo */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Rechazar Solicitud"
      >
        <div className="space-y-4">
          <p className="text-dark-300">
            ¿Estás seguro de rechazar esta solicitud? Proporciona un motivo para el cliente.
          </p>

          <Textarea
            label="Motivo del rechazo"
            placeholder="Ej: No hay disponibilidad en la fecha solicitada. Te ofrecemos..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowRejectModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleReject}
              disabled={loading || !rejectionReason.trim()}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              {loading ? 'Rechazando...' : 'Rechazar Solicitud'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { UserCheck, Calendar, Clock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { BookingRequest, BookingRequestStatus } from '@/core/domain/interfaces/BookingRequest';
import { bookingRequestRepository } from '@/core/infrastructure/repositories/BookingRequestRepository';
import { appointmentRepository } from '@/core/infrastructure/repositories/AppointmentRepository';
import { ensureClientExists } from '@/core/application/services/ClientConsolidationService';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ConfirmBookingModalProps {
  isOpen: boolean;
  request: BookingRequest;
  userId: string;
  onClose: () => void;
  onConfirmed: () => void;
}

export function ConfirmBookingModal({
  isOpen,
  request,
  userId,
  onClose,
  onConfirmed,
}: ConfirmBookingModalProps) {
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);

  const openWhatsApp = () => {
    const clean = request.clientPhone.replace(/\D/g, '');
    const full = clean.startsWith('506') ? clean : `506${clean}`;
    const dateStr = format(request.requestedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
    const msg =
      `Estimado/a ${request.clientName},\n\n` +
      `Reciba un cordial saludo de parte del equipo de SUNANDA. Nos complace confirmar su asistencia para su próxima cita:\n` +
      `📅 Fecha: ${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}\n` +
      `⏰ Hora: ${request.requestedTime}\n\n` +
      `Agradecemos su preferencia y le esperamos puntualmente. ¡Feliz día!`;
    window.open(`https://wa.me/${full}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleConfirm = async () => {
    const cedulaTrim = cedula.trim();
    if (!cedulaTrim) {
      toast.error('Ingresa el número de cédula del cliente');
      return;
    }

    try {
      setLoading(true);

      // 1. Consolidar cliente (crear si nuevo, sumar visita si existe)
      const { clientCreated } = await ensureClientExists(
        cedulaTrim,
        request.clientName,
        request.clientPhone,
        request.clientEmail
      );

      // 2. Crear la cita en Firestore
      const [startH, startM] = request.requestedTime.split(':').map(Number);
      const endMinutes = startH * 60 + startM + request.serviceDuration;
      const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

      const notes = [
        `Nombre: ${request.clientName}`,
        `Tel: ${request.clientPhone}`,
        request.notes && `Notas: ${request.notes}`,
        `Origen: Solicitud web`,
      ].filter(Boolean).join(' | ');

      const appointmentId = await appointmentRepository.create(
        {
          clientId: cedulaTrim,
          estheticianId: '',
          serviceId: request.serviceId,
          date: request.requestedDate,
          startTime: request.requestedTime,
          endTime,
          notes,
        },
        userId
      );

      // 3. Actualizar booking request con estado CONFIRMED + ID de cita
      await bookingRequestRepository.updateStatus(request.id, {
        status: BookingRequestStatus.CONFIRMED,
        processedBy: userId,
        appointmentId,
      });

      toast.success(
        clientCreated
          ? `Cliente registrado y cita creada — expediente listo`
          : `Cita creada — visita #${1} registrada al cliente`
      );

      onConfirmed();
      openWhatsApp();
    } catch (error) {
      console.error('Error al confirmar solicitud:', error);
      toast.error('Error al confirmar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Solicitud">
      <div className="space-y-5">
        {/* Resumen de la solicitud */}
        <div className="bg-dark-900/60 border border-dark-700 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Sparkles className="h-4 w-4 text-primary-400" />
            {request.serviceName}
          </div>
          <div className="flex items-center gap-4 text-dark-300">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(request.requestedDate, 'dd MMM yyyy', { locale: es })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {request.requestedTime}
            </span>
          </div>
          <div className="text-dark-300">
            <span className="text-dark-400">Cliente: </span>
            {request.clientName} · {request.clientPhone}
          </div>
        </div>

        {/* Campo cédula */}
        <div>
          <Input
            label="Número de Cédula del Cliente"
            placeholder="1-2345-6789"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            hint="Si el cliente es nuevo se creará su ficha y expediente automáticamente. Si ya existe, se suma una visita."
            required
            fullWidth
            autoFocus
            leftIcon={<UserCheck className="h-4 w-4" />}
          />
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={loading || !cedula.trim()}
            className="flex-1"
          >
            {loading ? 'Procesando...' : 'Confirmar y Registrar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

import { Appointment } from '@/core/domain/interfaces/Appointment';
import { AppointmentStatus } from '@/core/domain/enums';
import { Calendar, Clock, User, Scissors, MoreVertical, Check, X, AlertCircle, FileText } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppointmentCardProps {
  appointment: Appointment;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string, reason: string) => void;
  onComplete?: (id: string) => void;
  onNoShow?: (id: string) => void;
  onClick?: () => void;
  onOpenRecord?: (clientId: string, clientName: string) => void; // ← NUEVO
  showActions?: boolean;
}

/**
 * Componente de tarjeta de cita
 * Muestra información resumida y acciones rápidas
 */
export function AppointmentCard({
  appointment,
  onConfirm,
  onCancel,
  onComplete,
  onNoShow,
  onClick,
  onOpenRecord, // ← NUEVO
  showActions = true
}: AppointmentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  /**
   * Obtener color según estado
   */
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case AppointmentStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case AppointmentStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-300';
      case AppointmentStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-300';
      case AppointmentStatus.NO_SHOW:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  /**
   * Obtener texto del estado
   */
  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return 'Pendiente';
      case AppointmentStatus.CONFIRMED:
        return 'Confirmada';
      case AppointmentStatus.COMPLETED:
        return 'Completada';
      case AppointmentStatus.CANCELLED:
        return 'Cancelada';
      case AppointmentStatus.NO_SHOW:
        return 'No asistió';
      default:
        return status;
    }
  };

  /**
   * Manejar cancelación
   */
  const handleCancel = () => {
    if (cancelReason.trim() && onCancel) {
      onCancel(appointment.id, cancelReason);
      setShowCancelDialog(false);
      setCancelReason('');
      setShowMenu(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          relative bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all
          ${onClick ? 'cursor-pointer' : ''}
          ${getStatusColor(appointment.status).split(' ')[0].replace('bg-', 'border-')}
        `}
        onClick={onClick}
      >
        {/* Header */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            {/* Status Badge */}
            <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${getStatusColor(appointment.status)}
            `}>
              {getStatusText(appointment.status)}
            </span>

            {/* Actions Menu */}
            {showActions && appointment.status !== AppointmentStatus.CANCELLED && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {appointment.status === AppointmentStatus.PENDING && onConfirm && (
                        <button
                          onClick={() => {
                            onConfirm(appointment.id);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                          Confirmar
                        </button>
                      )}

                      {(appointment.status === AppointmentStatus.PENDING || 
                        appointment.status === AppointmentStatus.CONFIRMED) && onComplete && (
                        <button
                          onClick={() => {
                            onComplete(appointment.id);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4 text-blue-600" />
                          Marcar completada
                        </button>
                      )}

                      {(appointment.status === AppointmentStatus.PENDING || 
                        appointment.status === AppointmentStatus.CONFIRMED) && onNoShow && (
                        <button
                          onClick={() => {
                            onNoShow(appointment.id);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          No asistió
                        </button>
                      )}

                      {appointment.status !== AppointmentStatus.COMPLETED && onCancel && (
                        <button
                          onClick={() => {
                            setShowCancelDialog(true);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                          <X className="w-4 h-4" />
                          Cancelar cita
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 mt-3 text-gray-900">
            <Clock className="w-5 h-5 text-primary-600" />
            <span className="font-semibold text-lg">
              {appointment.startTime} - {appointment.endTime}
            </span>
          </div>

          {/* Client */}
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <User className="w-4 h-4" />
            <span className="text-sm">Cliente ID: {appointment.clientId}</span>
          </div>

          {/* Service */}
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <Scissors className="w-4 h-4" />
            <span className="text-sm">Servicio ID: {appointment.serviceId}</span>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
              {appointment.notes}
            </div>
          )}

          {/* Cancellation reason */}
          {appointment.status === AppointmentStatus.CANCELLED && appointment.cancellationReason && (
            <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-600">
              <strong>Razón:</strong> {appointment.cancellationReason}
            </div>
          )}

          {/* NUEVO: Botón Abrir Expediente */}
          {onOpenRecord && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Aquí necesitamos el nombre del cliente
                  // Si appointment tiene clientName directamente:
                  onOpenRecord(appointment.clientId, appointment.clientId);
                  // Si necesitas buscar el nombre, ajusta según tu data
                }}
                className="flex items-center gap-2 px-3 py-2 w-full text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors border border-amber-200"
                title="Abrir Expediente Médico"
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Abrir Expediente</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Cancel Dialog */}
      <AnimatePresence>
        {showCancelDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCancelDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Cancelar Cita</h3>
              
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Razón de la cancelación..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCancel}
                  disabled={!cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

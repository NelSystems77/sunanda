import { Appointment } from '@/core/domain/interfaces/Appointment';
import { AppointmentStatus } from '@/core/domain/enums';
import { Clock, User, Scissors, MoreVertical, Check, X, AlertCircle, FileText } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServiceStore } from '../../context/ServiceStore';

interface AppointmentCardProps {
  appointment: Appointment;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string, reason: string) => void;
  onComplete?: (id: string) => void;
  onNoShow?: (id: string) => void;
  onClick?: () => void;
  onOpenRecord?: (clientId: string, clientName: string) => void;
  showActions?: boolean;
}

export type { AppointmentCardProps };

/** Parsea el nombre del cliente desde el campo notes */
function parseClientName(notes?: string): string {
  if (!notes) return '';
  const match = notes.match(/Nombre:\s*([^|]+)/);
  return match ? match[1].trim() : '';
}

const STATUS_STYLES: Record<AppointmentStatus, { badge: string; border: string; label: string }> = {
  [AppointmentStatus.PENDING]:   { badge: 'bg-gold-500/20 text-gold-300 border border-gold-500/40',    border: 'border-l-gold-500',   label: 'Pendiente'   },
  [AppointmentStatus.CONFIRMED]: { badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',    border: 'border-l-blue-400',   label: 'Confirmada'  },
  [AppointmentStatus.COMPLETED]: { badge: 'bg-purple-500/20 text-purple-300 border border-purple-500/40', border: 'border-l-purple-400', label: 'Completada'  },
  [AppointmentStatus.CANCELLED]: { badge: 'bg-red-500/20 text-red-400 border border-red-500/40',       border: 'border-l-red-500',    label: 'Cancelada'   },
  [AppointmentStatus.NO_SHOW]:   { badge: 'bg-dark-500/40 text-dark-300 border border-dark-500/40',    border: 'border-l-dark-500',   label: 'No asistió'  },
  [AppointmentStatus.IN_PROGRESS]: { badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/40', border: 'border-l-blue-400',   label: 'En atención' },
};

export function AppointmentCard({
  appointment,
  onConfirm,
  onCancel,
  onComplete,
  onNoShow,
  onClick,
  onOpenRecord,
  showActions = true,
}: AppointmentCardProps) {
  const [showMenu, setShowMenu]               = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason]       = useState('');

  const { services } = useServiceStore();
  const serviceName = services.find(s => s.id === appointment.serviceId)?.name ?? appointment.serviceId;
  const clientName  = parseClientName(appointment.notes);

  const status = STATUS_STYLES[appointment.status] ?? STATUS_STYLES[AppointmentStatus.PENDING];

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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          relative bg-dark-800 rounded-lg border border-dark-600 border-l-4 ${status.border}
          shadow-sm hover:shadow-gold-500/10 hover:border-gold-500/30 transition-all
          ${onClick ? 'cursor-pointer' : ''}
          ${showMenu ? 'z-30' : 'z-[1]'}
        `}
        onClick={onClick}
      >
        <div className="p-4">
          {/* Header: badge + menú */}
          <div className="flex items-start justify-between mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.badge}`}>
              {status.label}
            </span>

            {showActions && appointment.status !== AppointmentStatus.CANCELLED && (
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="p-1 hover:bg-dark-600 rounded-full transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-dark-400" />
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-dark-700 rounded-lg shadow-xl border border-dark-600 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {appointment.status === AppointmentStatus.PENDING && onConfirm && (
                        <button
                          onClick={() => { onConfirm(appointment.id); setShowMenu(false); }}
                          className="w-full px-4 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 hover:text-white flex items-center gap-2 rounded-t-lg transition-colors"
                        >
                          <Check className="w-4 h-4 text-green-400" />
                          Confirmar
                        </button>
                      )}

                      {(appointment.status === AppointmentStatus.PENDING ||
                        appointment.status === AppointmentStatus.CONFIRMED) && onComplete && (
                        <button
                          onClick={() => { onComplete(appointment.id); setShowMenu(false); }}
                          className="w-full px-4 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 hover:text-white flex items-center gap-2 transition-colors"
                        >
                          <Check className="w-4 h-4 text-blue-400" />
                          Marcar completada
                        </button>
                      )}

                      {(appointment.status === AppointmentStatus.PENDING ||
                        appointment.status === AppointmentStatus.CONFIRMED) && onNoShow && (
                        <button
                          onClick={() => { onNoShow(appointment.id); setShowMenu(false); }}
                          className="w-full px-4 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 hover:text-white flex items-center gap-2 transition-colors"
                        >
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                          No asistió
                        </button>
                      )}

                      {appointment.status !== AppointmentStatus.COMPLETED && onCancel && (
                        <button
                          onClick={() => { setShowCancelDialog(true); setShowMenu(false); }}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 flex items-center gap-2 rounded-b-lg transition-colors"
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

          {/* Hora */}
          <div className="flex items-center gap-2 text-white mb-2">
            <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <span className="font-semibold">{appointment.startTime} - {appointment.endTime}</span>
          </div>

          {/* Cliente */}
          <div className="flex items-center gap-2 text-dark-300 text-sm mb-1">
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span className={clientName ? 'text-dark-200' : 'text-dark-400'}>
              {clientName || `Cédula: ${appointment.clientId}`}
            </span>
          </div>

          {/* Servicio */}
          <div className="flex items-center gap-2 text-dark-300 text-sm">
            <Scissors className="w-3.5 h-3.5 flex-shrink-0 text-gold-500/70" />
            <span className="text-dark-200 truncate">{serviceName}</span>
          </div>

          {/* Notas */}
          {appointment.notes && (
            <div className="mt-3 p-2 bg-dark-700 rounded-lg text-xs text-dark-300 border border-dark-600">
              {appointment.notes}
            </div>
          )}

          {/* Razón de cancelación */}
          {appointment.status === AppointmentStatus.CANCELLED && appointment.cancellationReason && (
            <div className="mt-3 p-2 bg-red-900/20 rounded-lg text-xs text-red-400 border border-red-800/40">
              <strong>Razón:</strong> {appointment.cancellationReason}
            </div>
          )}

          {/* Botón Abrir Expediente */}
          {onOpenRecord && (
            <div className="mt-3 pt-3 border-t border-dark-600">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenRecord(appointment.clientId, clientName || appointment.clientId);
                }}
                className="flex items-center gap-2 px-3 py-2 w-full text-sm text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg transition-colors border border-gold-500/30 hover:border-gold-500/60"
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Abrir Expediente</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Diálogo de cancelación */}
      <AnimatePresence>
        {showCancelDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowCancelDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-dark-800 border border-dark-600 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Cancelar Cita</h3>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Razón de la cancelación..."
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 text-white placeholder-dark-400 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none text-sm"
                rows={4}
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 px-4 py-2 border border-dark-600 text-dark-300 rounded-lg hover:bg-dark-700 hover:text-white transition-colors text-sm"
                >
                  Volver
                </button>
                <button
                  onClick={handleCancel}
                  disabled={!cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  Confirmar cancelación
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

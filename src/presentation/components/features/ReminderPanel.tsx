import { useState } from 'react';
import { Appointment } from '@/core/domain/interfaces/Appointment';
import { Bell, Mail, MessageSquare, Send, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ReminderPanelProps {
  appointments: Appointment[];
  onReminderSent?: (appointmentId: string) => void;
}

/**
 * Panel de recordatorios manuales
 * Permite enviar recordatorios de forma manual
 */
export function ReminderPanel({
  appointments,
  onReminderSent
}: ReminderPanelProps) {
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  /**
   * Filtrar citas que necesitan recordatorio
   */
  const appointmentsNeedingReminder = appointments.filter(apt => {
    // Citas futuras que no han sido enviadas
    const now = new Date();
    const aptDate = new Date(apt.date);
    
    return (
      !apt.reminderSent &&
      aptDate > now &&
      (apt.status === 'pending' || apt.status === 'confirmed')
    );
  });

  /**
   * Enviar recordatorio manual
   */
  const handleSendReminder = async (appointmentId: string, method: 'email' | 'sms' | 'whatsapp') => {
    setSendingReminder(appointmentId);
    
    try {
      // Simular envío (en producción aquí irían las integraciones reales)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Recordatorio enviado por ${method === 'email' ? 'email' : method === 'sms' ? 'SMS' : 'WhatsApp'}`);
      onReminderSent?.(appointmentId);
    } catch (error) {
      toast.error('Error al enviar recordatorio');
    } finally {
      setSendingReminder(null);
    }
  };

  if (appointmentsNeedingReminder.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No hay recordatorios pendientes
        </h3>
        <p className="text-sm text-gray-500">
          Todas las citas próximas tienen recordatorios enviados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Recordatorios Pendientes
        </h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          {appointmentsNeedingReminder.length} pendiente{appointmentsNeedingReminder.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {appointmentsNeedingReminder.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            {/* Appointment Info */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-gray-900">
                    {new Date(appointment.date).toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                  <span className="text-gray-600">
                    {appointment.startTime}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Cliente: {appointment.clientId.slice(0, 12)}...
                </p>
              </div>

              {appointment.reminderSent && (
                <div className="flex items-center gap-1 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-xs">Enviado</span>
                </div>
              )}
            </div>

            {/* Send Actions */}
            {!appointment.reminderSent && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendReminder(appointment.id, 'email')}
                  disabled={sendingReminder === appointment.id}
                  className="flex-1"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendReminder(appointment.id, 'sms')}
                  disabled={sendingReminder === appointment.id}
                  className="flex-1"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  SMS
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendReminder(appointment.id, 'whatsapp')}
                  disabled={sendingReminder === appointment.id}
                  className="flex-1"
                >
                  <Send className="w-3 h-3 mr-1" />
                  WhatsApp
                </Button>
              </div>
            )}

            {sendingReminder === appointment.id && (
              <div className="mt-2 text-center text-sm text-gray-500">
                Enviando...
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Batch Send */}
      {appointmentsNeedingReminder.length > 1 && (
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            onClick={() => {
              toast.success(`${appointmentsNeedingReminder.length} recordatorios programados`);
            }}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Todos por Email
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Se enviarán {appointmentsNeedingReminder.length} recordatorios
          </p>
        </div>
      )}
    </div>
  );
}

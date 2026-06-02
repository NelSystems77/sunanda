import { Appointment } from '@/core/domain/interfaces/Appointment';
import { SPA_SCHEDULE } from '../../../core/infrastructure/services/AvailabilityService';
import { AppointmentCard } from './AppointmentCard';
import { Clock, Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarDayViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  onAppointmentClick?: (appointment: Appointment) => void;
  onTimeSlotClick?: (time: string) => void;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string, reason: string) => void;
  onComplete?: (id: string) => void;
  onNoShow?: (id: string) => void;
  onReopen?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreateNew?: () => void;
  onOpenRecord?: (clientId: string, clientName: string) => void;
}

/**
 * Vista de calendario por día
 * Muestra timeline de 9am a 9pm con citas del día
 */
export function CalendarDayView({
  appointments,
  selectedDate,
  onAppointmentClick,
  onTimeSlotClick,
  onConfirm,
  onCancel,
  onComplete,
  onNoShow,
  onReopen,
  onDelete,
  onCreateNew,
  onOpenRecord
}: CalendarDayViewProps) {
  /**
   * Generar slots de tiempo
   */
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    let currentTime = SPA_SCHEDULE.openTime;

    while (currentTime <= SPA_SCHEDULE.closeTime) {
      slots.push(currentTime);
      const [hours, minutes] = currentTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + SPA_SCHEDULE.slotDuration;
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      currentTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  /**
   * Obtener citas para un slot de tiempo
   */
  const getAppointmentsForSlot = (time: string): Appointment[] => {
    return appointments.filter(apt => apt.startTime === time);
  };

  /**
   * Verificar si es la hora actual
   */
  const isCurrentTime = (time: string): boolean => {
    const now = new Date();
    if (now.toDateString() !== selectedDate.toDateString()) return false;
    const [slotH, slotM] = time.split(':').map(Number);
    const slotStart = slotH * 60 + slotM;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return nowMinutes >= slotStart && nowMinutes < slotStart + SPA_SCHEDULE.slotDuration;
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          <p className="text-sm text-dark-400">
            {appointments.length} {appointments.length === 1 ? 'cita' : 'citas'}
          </p>
        </div>

        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-dark-900 rounded-lg hover:bg-gold-600 transition-colors font-semibold"
          >
            <Plus className="w-4 h-4" />
            Nueva Cita
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-dark-800 rounded-lg border border-dark-700 divide-y divide-dark-700">
        {timeSlots.map((time, index) => {
          const slotAppointments = getAppointmentsForSlot(time);
          const isCurrent = isCurrentTime(time);

          return (
            <motion.div
              key={time}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.01 }}
              className={`
                flex gap-4 p-3 hover:bg-dark-700 transition-colors
                ${isCurrent ? 'bg-dark-700 border-l-4 border-gold-500' : ''}
              `}
            >
              {/* Time */}
              <div className="flex items-center gap-2 w-24 flex-shrink-0">
                <Clock className={`w-4 h-4 ${isCurrent ? 'text-gold-400' : 'text-dark-400'}`} />
                <span className={`text-sm font-medium ${isCurrent ? 'text-gold-400' : 'text-white'}`}>
                  {time}
                </span>
              </div>

              {/* Appointments or Empty Slot */}
              <div className="flex-1">
                {slotAppointments.length > 0 ? (
                  <div className="space-y-2">
                    {slotAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onClick={() => onAppointmentClick?.(appointment)}
                        onConfirm={onConfirm}
                        onCancel={onCancel}
                        onReopen={onReopen}
                        onDelete={onDelete}
                        onComplete={onComplete}
                        onNoShow={onNoShow}
                        onOpenRecord={onOpenRecord} // ← PASAR HANDLER
                      />
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => onTimeSlotClick?.(time)}
                    className="w-full text-left px-4 py-3 border-2 border-dashed border-dark-600 rounded-lg hover:border-gold-500 hover:bg-dark-700 transition-all group"
                  >
                    <span className="text-sm text-dark-400 group-hover:text-gold-400">
                      Horario disponible - Click para agendar
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {appointments.length === 0 && (
        <div className="text-center py-12 text-dark-400">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No hay citas para este día</h3>
          <p className="text-sm">Selecciona un horario para crear una nueva cita</p>
        </div>
      )}
    </div>
  );
}

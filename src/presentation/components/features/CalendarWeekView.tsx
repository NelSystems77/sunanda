import { Appointment } from '@/core/domain/interfaces/Appointment';
import { OccupancyBadge } from './OccupancyIndicator';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarWeekViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  weekOccupancy?: { date: Date; occupancy: number }[];
  onDayClick?: (date: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

/**
 * Vista de calendario semanal
 * Muestra 7 días con citas agrupadas
 */
export function CalendarWeekView({
  appointments,
  selectedDate,
  weekOccupancy = [],
  onDayClick,
  onAppointmentClick
}: CalendarWeekViewProps) {
  /**
   * Obtener inicio de la semana (lunes)
   */
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que empiece en lunes
    return new Date(d.setDate(diff));
  };

  /**
   * Generar días de la semana
   */
  const generateWeekDays = (): Date[] => {
    const weekStart = getWeekStart(selectedDate);
    const days: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const weekDays = generateWeekDays();

  /**
   * Obtener citas para un día
   */
  const getAppointmentsForDay = (date: Date): Appointment[] => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  /**
   * Obtener ocupación de un día
   */
  const getOccupancyForDay = (date: Date): number => {
    const occupancy = weekOccupancy.find(o => {
      const oDate = new Date(o.date);
      return (
        oDate.getDate() === date.getDate() &&
        oDate.getMonth() === date.getMonth() &&
        oDate.getFullYear() === date.getFullYear()
      );
    });

    return occupancy?.occupancy || 0;
  };

  /**
   * Verificar si es hoy
   */
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  /**
   * Verificar si es el día seleccionado
   */
  const isSelected = (date: Date): boolean => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">
          Semana del {weekDays[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
          {' '}- {weekDays[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </h3>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayAppointments = getAppointmentsForDay(day);
          const occupancy = getOccupancyForDay(day);

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                bg-dark-800 rounded-lg border-2 p-4 cursor-pointer transition-all
                ${isToday(day) ? 'border-gold-500 shadow-md' : 'border-dark-700'}
                ${isSelected(day) ? 'ring-2 ring-gold-500' : ''}
                hover:shadow-lg hover:border-gold-500
              `}
              onClick={() => onDayClick?.(day)}
            >
              {/* Day Header */}
              <div className="text-center mb-3">
                <div className="text-xs font-medium text-dark-400 uppercase">
                  {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                </div>
                <div className={`
                  text-2xl font-bold mt-1
                  ${isToday(day) ? 'text-gold-400' : 'text-white'}
                `}>
                  {day.getDate()}
                </div>
              </div>

              {/* Occupancy Badge */}
              {weekOccupancy.length > 0 && (
                <div className="mb-3 flex justify-center">
                  <OccupancyBadge percentage={occupancy} />
                </div>
              )}

              {/* Appointments Count */}
              <div className="text-center">
                <div className={`
                  inline-flex items-center justify-center w-10 h-10 rounded-full
                  ${dayAppointments.length > 0 ? 'bg-gold-500/20 text-gold-400' : 'bg-dark-700 text-dark-400'}
                `}>
                  <span className="text-sm font-semibold">
                    {dayAppointments.length}
                  </span>
                </div>
                <div className="text-xs text-dark-400 mt-1">
                  {dayAppointments.length === 1 ? 'cita' : 'citas'}
                </div>
              </div>

              {/* Appointments List (compact) */}
              {dayAppointments.length > 0 && (
                <div className="mt-3 space-y-1">
                  {dayAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick?.(apt);
                      }}
                      className="text-xs p-2 bg-dark-900 rounded hover:bg-dark-700 transition-colors border border-dark-700"
                    >
                      <div className="font-medium text-white">
                        {apt.startTime}
                      </div>
                      <div className="text-dark-400 truncate">
                        Cliente: {apt.clientId.slice(0, 8)}...
                      </div>
                    </div>
                  ))}
                  
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-center text-dark-400 py-1">
                      +{dayAppointments.length - 3} más
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {appointments.length === 0 && (
        <div className="text-center py-12 text-dark-400">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2 text-white">No hay citas esta semana</h3>
          <p className="text-sm">Selecciona un día para crear una nueva cita</p>
        </div>
      )}
    </div>
  );
}

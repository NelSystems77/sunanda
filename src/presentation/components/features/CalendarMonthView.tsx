import { Appointment } from '@/core/domain/interfaces/Appointment';
import { AppointmentStatus } from '@/core/domain/enums';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarMonthViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  onDayClick?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
}

/**
 * Vista de calendario mensual
 * Grid tradicional de calendario con citas por día
 */
export function CalendarMonthView({
  appointments,
  selectedDate,
  onDayClick,
  onMonthChange
}: CalendarMonthViewProps) {
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  /**
   * Obtener días del mes en grid
   */
  const getMonthDays = (): (Date | null)[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days: (Date | null)[] = [];
    
    // Días vacíos al inicio (ajustar para que lunes sea el primero)
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }
    
    return days;
  };

  const monthDays = getMonthDays();

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
   * Obtener stats de un día (FASE 4)
   */
  const getDayStats = (date: Date) => {
    const dayAppointments = getAppointmentsForDay(date);
    return {
      total: dayAppointments.length,
      pending: dayAppointments.filter(a => a.status === AppointmentStatus.PENDING).length,
      confirmed: dayAppointments.filter(a => a.status === AppointmentStatus.CONFIRMED).length,
      completed: dayAppointments.filter(a => a.status === AppointmentStatus.COMPLETED).length,
    };
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

  /**
   * Navegar mes
   */
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange?.(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange?.(newDate);
  };

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-dark-400" />
        </button>

        <h3 className="text-lg font-semibold text-white">
          {new Date(currentYear, currentMonth).toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
          })}
        </h3>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-dark-400" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 bg-dark-900 border-b border-dark-700">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-dark-400 uppercase tracking-wide border-r border-dark-700 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7">
        {monthDays.map((date, index) => {
          if (!date) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-[100px] bg-gray-50 border-b border-r border-gray-100"
              />
            );
          }

          const dayAppointments = getAppointmentsForDay(date);
          const dayStats = getDayStats(date);
          const today = isToday(date);
          const selected = isSelected(date);
          const hasAppointments = dayAppointments.length > 0;

          return (
            <motion.div
              key={date.toISOString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => onDayClick?.(date)}
              className={`
                min-h-[100px] p-2 border-b border-r transition-all cursor-pointer
                ${today ? 'bg-dark-700 border-gold-500' : 'bg-dark-800 border-dark-700'}
                ${selected ? 'ring-2 ring-inset ring-gold-500' : ''}
                ${hasAppointments ? 'hover:bg-dark-700' : 'hover:bg-dark-750'}
              `}
            >
              {/* Day Number + Badge Total */}
              <div className="flex items-center justify-between mb-2">
                <span className={`
                  text-sm font-medium
                  ${today ? 'text-gold-400 font-bold' : 'text-white'}
                `}>
                  {date.getDate()}
                </span>

                {hasAppointments && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-gold-500 text-dark-900">
                    {dayAppointments.length}
                  </span>
                )}
              </div>

              {/* Indicadores por Estado (FASE 4) */}
              {hasAppointments && (
                <div className="space-y-1.5">
                  {/* Pendientes */}
                  {dayStats.pending > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gold-500" 
                           style={{ width: `${(dayStats.pending / dayStats.total) * 100}%` }}
                      />
                      <span className="text-xs text-gold-400 font-medium">
                        {dayStats.pending}P
                      </span>
                    </div>
                  )}

                  {/* Confirmadas */}
                  {dayStats.confirmed > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-green-500" 
                           style={{ width: `${(dayStats.confirmed / dayStats.total) * 100}%` }}
                      />
                      <span className="text-xs text-green-400 font-medium">
                        {dayStats.confirmed}C
                      </span>
                    </div>
                  )}

                  {/* Completadas */}
                  {dayStats.completed > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-purple-500" 
                           style={{ width: `${(dayStats.completed / dayStats.total) * 100}%` }}
                      />
                      <span className="text-xs text-purple-400 font-medium">
                        {dayStats.completed}A
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!hasAppointments && (
                <div className="text-center py-2">
                  <span className="text-xs text-dark-500">Sin citas</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="p-4 bg-dark-900 border-t border-dark-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark-400">
            Total de citas este mes:
          </span>
          <span className="font-semibold text-white">
            {appointments.length}
          </span>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { CardGrid, StatCard } from '../components/ui/responsive';
import { CalendarDayView } from '../components/features/CalendarDayView';
import { CalendarWeekView } from '../components/features/CalendarWeekView';
import { CalendarMonthView } from '../components/features/CalendarMonthView';
import { AppointmentForm } from '../components/features/AppointmentForm';
import { AppointmentFilters } from '../components/features/AppointmentFilters';
import { ReminderSettings } from '../components/features/ReminderSettings';
import { OccupancyIndicator } from '../components/features/OccupancyIndicator';
import { Button } from '../components/ui/Button';
import { MedicalRecordModal } from '../components/features/MedicalRecordModal';
import { PaymentForm } from '../components/features/PaymentForm';
import { ChevronLeft, ChevronRight, Plus, Bell, Calendar as CalendarIcon, CheckCircle, Clock, Users, X, User, Send, Settings, DollarSign, MessageCircle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppointmentUseCases } from '../../core/application/use-cases/appointments/AppointmentUseCases';
import { AppointmentRepository } from '../../core/infrastructure/repositories/AppointmentRepository';
import { Appointment } from '../../core/domain/interfaces/Appointment';
import toast from 'react-hot-toast';

const useCases = new AppointmentUseCases();
const appointmentRepo = new AppointmentRepository();

const parseClientFromNotes = (notes?: string): { name: string; phone: string } => {
  if (!notes) return { name: 'Cliente', phone: '' };
  const nameMatch = notes.match(/Nombre:\s*([^|]+)/);
  const phoneMatch = notes.match(/Tel:\s*([^|]+)/);
  return {
    name: nameMatch ? nameMatch[1].trim() : 'Cliente',
    phone: phoneMatch ? phoneMatch[1].trim() : '',
  };
};

const buildWhatsAppMessage = (appointment: Appointment, clientName: string): string => {
  const aptDate = new Date(appointment.date);
  const dateStr = aptDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  return `¡Hola ${clientName}! 👋\n\nTe recordamos que tienes una cita en *SUNANDA Estética y Spa* el *${dateStr}* a las *${appointment.startTime}*.\n\nSi necesitás hacer algún cambio, escribinos aquí 🙏\n\n_SUNANDA Estética y Spa_ ✨`;
};

const openWhatsApp = (phone: string, message: string): void => {
  const clean = phone.replace(/\D/g, '');
  const full = clean.startsWith('506') ? clean : `506${clean}`;
  window.open(`https://wa.me/${full}?text=${encodeURIComponent(message)}`, '_blank');
};

/**
 * Página de Citas/Agenda
 * Vista principal del módulo de gestión de citas
 */
export function AppointmentsPage() {
  const {
    appointments,
    selectedDate,
    calendarView,
    loading,
    
    // Actions
    fetchAppointmentsByDate,
    fetchAppointmentsByDateRange,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    markAsNoShow,
    setSelectedDate,
    setCalendarView,
    setFilters,
    clearFilters,
    
    // Navigation
    goToPreviousDay,
    goToNextDay,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
    goToPreviousMonth,
    goToNextMonth,
    
    // Helpers
    todayAppointments,
    stats
  } = useAppointments();

  const [showForm, setShowForm] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [dayOccupancy, setDayOccupancy] = useState(0);
  const [weekOccupancy, setWeekOccupancy] = useState<{ date: Date; occupancy: number }[]>([]);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
  
  // Nuevos estados para Fase 2
  const [showAppointmentsList, setShowAppointmentsList] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  
  // Estado para Fase 5
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [paymentAppointmentId, setPaymentAppointmentId] = useState<string | null>(null);

  // Recordatorios próximos (próximos 7 días sin recordatorio enviado)
  const [upcomingReminders, setUpcomingReminders] = useState<Appointment[]>([]);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);

  const loadUpcomingReminders = useCallback(async () => {
    const now = new Date();
    const in7days = new Date(now);
    in7days.setDate(in7days.getDate() + 7);
    const all = await appointmentRepo.getByDateRange(now, in7days);
    setUpcomingReminders(
      all.filter(a => !a.reminderSent && (a.status === 'pending' || a.status === 'confirmed'))
    );
  }, []);

  /**
   * Cargar citas al montar y cuando cambia la fecha o vista
   */
  useEffect(() => {
    loadAppointments();
    loadOccupancy();
  }, [selectedDate, calendarView]);

  useEffect(() => {
    loadUpcomingReminders();
  }, [loadUpcomingReminders]);

  const handleSendWhatsAppReminder = async (appointment: Appointment) => {
    const { name, phone } = parseClientFromNotes(appointment.notes);
    if (!phone) {
      toast.error('No se encontró el teléfono del cliente en las notas de la cita');
      return;
    }
    setSendingReminderId(appointment.id);
    try {
      const message = buildWhatsAppMessage(appointment, name);
      openWhatsApp(phone, message);
      await useCases.markReminderSent(appointment.id);
      toast.success(`Recordatorio enviado a ${name} por WhatsApp`);
      await loadUpcomingReminders();
    } catch {
      toast.error('Error al marcar el recordatorio');
    } finally {
      setSendingReminderId(null);
    }
  };

  /**
   * Cargar citas según la vista
   */
  const loadAppointments = async () => {
    if (calendarView === 'day') {
      await fetchAppointmentsByDate(selectedDate);
    } else if (calendarView === 'week') {
      const weekStart = getWeekStart(selectedDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      await fetchAppointmentsByDateRange(weekStart, weekEnd);
    } else if (calendarView === 'month') {
      const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      await fetchAppointmentsByDateRange(monthStart, monthEnd);
    }
  };

  /**
   * Cargar ocupación
   */
  const loadOccupancy = async () => {
    if (calendarView === 'day') {
      const occupancy = await useCases.getDayOccupancy(selectedDate);
      setDayOccupancy(occupancy);
    } else if (calendarView === 'week') {
      const weekStart = getWeekStart(selectedDate);
      const occupancy = await useCases.getWeekOccupancy(weekStart);
      setWeekOccupancy(occupancy);
    }
  };

  /**
   * Obtener inicio de semana
   */
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  /**
   * Manejar navegación según vista
   */
  const handlePrevious = () => {
    if (calendarView === 'day') goToPreviousDay();
    else if (calendarView === 'week') goToPreviousWeek();
    else goToPreviousMonth();
  };

  const handleNext = () => {
    if (calendarView === 'day') goToNextDay();
    else if (calendarView === 'week') goToNextWeek();
    else goToNextMonth();
  };

  /**
   * Manejar click en slot de tiempo
   */
  const handleTimeSlotClick = (time: string) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  /**
   * Manejar click en día
   */
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setCalendarView('day');
  };

  const handleOpenRecord = (clientId: string, clientName: string) => {
  setSelectedClient({ id: clientId, name: clientName });
  setShowRecordModal(true);
};

  /**
   * Calcular stats del día seleccionado (FASE 2)
   */
  const getDayStats = () => {
    // Filtrar citas del día seleccionado
    const dayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getDate() === selectedDate.getDate() &&
        aptDate.getMonth() === selectedDate.getMonth() &&
        aptDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    return {
      total: dayAppointments.length,
      pending: dayAppointments.filter(a => a.status === 'pending').length,
      confirmed: dayAppointments.filter(a => a.status === 'confirmed').length,
      completed: dayAppointments.filter(a => a.status === 'completed').length,
    };
  };

  /**
   * Manejar click en stat card
   */
  const handleStatClick = (status: 'all' | 'pending' | 'confirmed' | 'completed') => {
    setFilterStatus(status);
    setShowAppointmentsList(true);
  };

  /**
   * Obtener citas filtradas
   */
  const getFilteredAppointments = () => {
    // Citas del día seleccionado
    const dayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getDate() === selectedDate.getDate() &&
        aptDate.getMonth() === selectedDate.getMonth() &&
        aptDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    // Aplicar filtro de estado
    if (filterStatus === 'all') {
      return dayAppointments;
    }
    return dayAppointments.filter(a => a.status === filterStatus);
  };


  /**
   * Formatear título según vista
   */
  const getTitle = () => {
    if (calendarView === 'day') {
      return selectedDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } else if (calendarView === 'week') {
      const weekStart = getWeekStart(selectedDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      return `${weekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      return selectedDate.toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const dayStats = getDayStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Agenda"
          description="Gestión de citas y horarios"
          breadcrumbs={[{ label: 'Agenda' }]}
          actions={
            <div className="flex items-center gap-3">
              {/* Reminders Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowReminders(!showReminders)}
                className="relative"
              >
                <Bell className="w-4 h-4 mr-2" />
                Recordatorios
                {upcomingReminders.length > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {upcomingReminders.length}
                  </span>
                )}
              </Button>

              {/* Reminder Settings (FASE 5) */}
              <Button
                variant="outline"
                onClick={() => setShowReminderSettings(true)}
                title="Configuración de Recordatorios"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* New Appointment */}
              <Button 
                variant="primary"
                onClick={() => {
                  setSelectedTime(undefined);
                  setShowForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cita
              </Button>
            </div>
          }
        />

        {/* Stats - Del día seleccionado + Clickeables */}
        <CardGrid columns={4}>
          <button
            onClick={() => handleStatClick('all')}
            className="text-left transition-transform hover:scale-105"
          >
            <StatCard
              label={`Total Citas (${selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })})`}
              value={dayStats.total}
              icon={CalendarIcon}
              color="blue"
            />
          </button>
          
          <button
            onClick={() => handleStatClick('pending')}
            className="text-left transition-transform hover:scale-105"
          >
            <StatCard
              label="Pendientes"
              value={dayStats.pending}
              icon={Clock}
              color="gold"
            />
          </button>
          
          <button
            onClick={() => handleStatClick('confirmed')}
            className="text-left transition-transform hover:scale-105"
          >
            <StatCard
              label="Confirmadas"
              value={dayStats.confirmed}
              icon={CheckCircle}
              color="green"
            />
          </button>
          
          <button
            onClick={() => handleStatClick('completed')}
            className="text-left transition-transform hover:scale-105"
          >
            <StatCard
              label="Completadas"
              value={dayStats.completed}
              icon={Users}
              color="purple"
            />
          </button>
        </CardGrid>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Hoy
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-lg font-semibold text-white">
              {getTitle()}
            </div>
          </div>

          {/* View Selector & Filters */}
          <div className="flex items-center gap-3">
            <AppointmentFilters
              onFilterChange={setFilters}
              onClear={clearFilters}
            />

            <div className="flex items-center bg-dark-700 rounded-lg p-1">
              <button
                onClick={() => setCalendarView('day')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  calendarView === 'day'
                    ? 'bg-gold-500 text-dark-900 shadow-sm'
                    : 'text-dark-300 hover:text-white'
                }`}
              >
                Día
              </button>
              <button
                onClick={() => setCalendarView('week')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  calendarView === 'week'
                    ? 'bg-gold-500 text-dark-900 shadow-sm'
                    : 'text-dark-300 hover:text-white'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setCalendarView('month')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  calendarView === 'month'
                    ? 'bg-gold-500 text-dark-900 shadow-sm'
                    : 'text-dark-300 hover:text-white'
                }`}
              >
                Mes
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar View */}
          <div className="lg:col-span-2">
            {calendarView === 'day' && (
              <>
                <div className="mb-4">
                  <OccupancyIndicator percentage={dayOccupancy} size="lg" />
                </div>
                <CalendarDayView
                  appointments={todayAppointments()}
                  selectedDate={selectedDate}
                  onTimeSlotClick={handleTimeSlotClick}
                  onConfirm={confirmAppointment}
                  onCancel={cancelAppointment}
                  onComplete={completeAppointment}
                  onNoShow={markAsNoShow}
                  onCreateNew={() => setShowForm(true)}
                  onOpenRecord={handleOpenRecord}
                />
              </>
            )}

            {calendarView === 'week' && (
              <CalendarWeekView
                appointments={appointments}
                selectedDate={selectedDate}
                weekOccupancy={weekOccupancy}
                onDayClick={handleDayClick}
              />
            )}

            {calendarView === 'month' && (
              <CalendarMonthView
                appointments={appointments}
                selectedDate={selectedDate}
                onDayClick={handleDayClick}
                onMonthChange={setSelectedDate}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mini Calendar */}
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-4">Calendario</h3>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Recordatorios */}
      <AnimatePresence>
        {showReminders && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReminders(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-800 border border-dark-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-dark-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Recordatorios Pendientes</h3>
                    <p className="text-sm text-dark-400 mt-0.5">
                      {upcomingReminders.length === 0
                        ? 'Todas las citas tienen recordatorio enviado'
                        : `${upcomingReminders.length} cita${upcomingReminders.length !== 1 ? 's' : ''} sin recordatorio — próximos 7 días`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReminders(false)}
                  className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-dark-400" />
                </button>
              </div>

              {/* Lista Recordatorios */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {upcomingReminders.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                    <p className="text-dark-400">No hay recordatorios pendientes</p>
                    <p className="text-xs text-dark-500 mt-2">
                      Todas las citas de los próximos 7 días tienen recordatorio enviado
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingReminders.map((appointment) => {
                      const { name, phone } = parseClientFromNotes(appointment.notes);
                      const isSending = sendingReminderId === appointment.id;
                      return (
                        <div
                          key={appointment.id}
                          className="bg-dark-900 border border-dark-700 rounded-lg p-4 hover:border-gold-500/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            {/* Info Cita */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
                                <span className="font-semibold text-white">
                                  {new Date(appointment.date).toLocaleDateString('es-ES', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short'
                                  })} · {appointment.startTime}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                  appointment.status === 'confirmed'
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-gold-500/20 text-gold-300'
                                }`}>
                                  {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                </span>
                              </div>
                              <div className="text-sm text-dark-300 space-y-1 ml-7">
                                <div className="flex items-center gap-2">
                                  <User className="w-3 h-3 flex-shrink-0" />
                                  <span className="font-medium text-white truncate">{name}</span>
                                </div>
                                {phone && (
                                  <div className="flex items-center gap-2 text-dark-400">
                                    <Phone className="w-3 h-3 flex-shrink-0" />
                                    <span>{phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Botón WhatsApp */}
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSendWhatsAppReminder(appointment)}
                              disabled={isSending || !phone}
                              className="flex-shrink-0 bg-green-600 hover:bg-green-700 border-green-600"
                              title={!phone ? 'Sin teléfono en notas' : 'Enviar recordatorio por WhatsApp'}
                            >
                              {isSending ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <MessageCircle className="w-4 h-4 mr-1" />
                              )}
                              {isSending ? '' : 'WhatsApp'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer con envío masivo */}
              {upcomingReminders.length > 1 && (
                <div className="p-4 border-t border-dark-700 bg-dark-900/50">
                  <p className="text-xs text-dark-400 text-center">
                    Los recordatorios por WhatsApp se abren uno a uno para que puedas personalizarlos antes de enviar.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Form Modal */}
      <AnimatePresence>
        {showForm && (
          <AppointmentForm
            onClose={() => {
              setShowForm(false);
              setSelectedTime(undefined);
            }}
            onSuccess={() => {
              loadAppointments();
              loadOccupancy();
            }}
            initialDate={selectedDate}
            initialTime={selectedTime}
          />
        )}
      </AnimatePresence>

{/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-dark-800 border border-gold-500/30 rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold-500"></div>
              <span className="text-white">Cargando...</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Expediente */}
      {showRecordModal && selectedClient && (
        <MedicalRecordModal
          clientId={selectedClient.id}
          clientName={selectedClient.name}
          onClose={() => {
            setShowRecordModal(false);
            setSelectedClient(null);
          }}
        />
      )}

      {/* Modal Lista de Citas (FASE 2) */}
      <AnimatePresence>
        {showAppointmentsList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAppointmentsList(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-800 border border-dark-700 rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-dark-700 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Citas del {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                  </h3>
                  <p className="text-sm text-dark-400 mt-1">
                    {filterStatus === 'all' ? 'Todas las citas' : 
                     filterStatus === 'pending' ? 'Citas pendientes' :
                     filterStatus === 'confirmed' ? 'Citas confirmadas' :
                     'Citas completadas'}
                  </p>
                </div>
                <button
                  onClick={() => setShowAppointmentsList(false)}
                  className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-dark-400" />
                </button>
              </div>

              {/* Lista de Citas */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {getFilteredAppointments().length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                    <p className="text-dark-400">No hay citas en esta categoría</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getFilteredAppointments().map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-dark-900 border border-dark-700 rounded-lg p-4 hover:border-gold-500/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Info Cita */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Clock className="w-4 h-4 text-gold-400" />
                              <span className="font-semibold text-white">
                                {appointment.startTime} - {appointment.endTime}
                              </span>
                              <span className={`
                                px-2 py-0.5 rounded-full text-xs font-medium
                                ${appointment.status === 'pending' ? 'bg-gold-500/20 text-gold-300' :
                                  appointment.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                                  'bg-purple-500/20 text-purple-300'}
                              `}>
                                {appointment.status === 'pending' ? 'Pendiente' :
                                 appointment.status === 'confirmed' ? 'Confirmada' :
                                 'Completada'}
                              </span>
                            </div>
                            <div className="text-sm text-dark-300 space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3" />
                                Cliente: {appointment.clientId}
                              </div>
                              {appointment.notes && (
                                <div className="text-xs text-dark-400 mt-2">
                                  {appointment.notes}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex flex-col gap-2">
                            {appointment.status === 'pending' && (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => {
                                    confirmAppointment(appointment.id);
                                    loadAppointments();
                                  }}
                                >
                                  ✓ Confirmar
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => {
                                    handleOpenRecord(appointment.clientId, 'Cliente');
                                    setShowAppointmentsList(false);
                                  }}
                                >
                                  Iniciar Atención
                                </Button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  handleOpenRecord(appointment.clientId, 'Cliente');
                                  setShowAppointmentsList(false);
                                }}
                              >
                                Iniciar Atención
                              </Button>
                            )}
                            {appointment.status === 'completed' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setPaymentAppointmentId(appointment.id)}
                                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                Cobrar
                              </Button>
                            )}
                            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm('¿Cancelar esta cita? El espacio quedará disponible para nuevas reservas.')) {
                                    cancelAppointment(appointment.id, 'Cancelada desde lista de citas');
                                    loadAppointments();
                                  }
                                }}
                                className="text-red-400 border-red-800 hover:bg-red-900/30"
                              >
                                ✕ Cancelar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Configuración Recordatorios (FASE 5) */}
      <AnimatePresence>
        {showReminderSettings && (
          <ReminderSettings
            onClose={() => setShowReminderSettings(false)}
          />
        )}
      </AnimatePresence>

      {/* Modal cobro SINPE */}
      {paymentAppointmentId && (
        <PaymentForm
          appointmentId={paymentAppointmentId}
          onSuccess={() => {
            setPaymentAppointmentId(null);
            loadAppointments();
          }}
          onCancel={() => setPaymentAppointmentId(null)}
        />
      )}

    </DashboardLayout>
  );
}
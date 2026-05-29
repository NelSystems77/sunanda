import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAppointmentDTO } from '@/core/domain/interfaces/Appointment';
import { createAppointmentSchema } from '../../../core/application/validations/AppointmentValidations';
import { TimeSlotSelector } from './TimeSlotSelector';
import { TimeSlot, SPA_SCHEDULE } from '../../../core/infrastructure/services/AvailabilityService';
import { useAppointments } from '../../hooks/useAppointments';
import { useServices } from '../../hooks/useServices';
import { X, Calendar, User, Scissors, Clock, FileText, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface AppointmentFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialDate?: Date;
  initialTime?: string;
}

function generateAllTimeSlots(serviceDuration: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [openH, openM] = SPA_SCHEDULE.openTime.split(':').map(Number);
  const [closeH, closeM] = SPA_SCHEDULE.closeTime.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  let current = openMinutes;
  while (current + serviceDuration <= closeMinutes) {
    const sH = Math.floor(current / 60);
    const sM = current % 60;
    const end = current + serviceDuration;
    const eH = Math.floor(end / 60);
    const eM = end % 60;
    slots.push({
      startTime: `${String(sH).padStart(2, '0')}:${String(sM).padStart(2, '0')}`,
      endTime: `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}`,
      available: true
    });
    current += SPA_SCHEDULE.slotDuration;
  }
  return slots;
}

export function AppointmentForm({
  onClose,
  onSuccess,
  initialDate,
  initialTime
}: AppointmentFormProps) {
  const {
    createAppointment,
    fetchAvailableSlots,
    availableSlots,
    loadingSlots
  } = useAppointments();
  const { services, fetchActiveServices } = useServices();

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const [selectedEsthetician, setSelectedEsthetician] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>(initialTime || '');
  const [serviceDuration, setServiceDuration] = useState<number>(90);
  const [submitting, setSubmitting] = useState(false);
  const [showOtherService, setShowOtherService] = useState(false);
  const [otherServiceDescription, setOtherServiceDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<CreateAppointmentDTO>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      clientId: '',
      estheticianId: '',
      serviceId: '',
      date: selectedDate,
      startTime: initialTime || '',
      endTime: '',
      notes: '',
      internalNotes: ''
    }
  });

  /**
   * Cargar servicios activos
   */
  useEffect(() => {
    fetchActiveServices();
  }, []);

  /**
   * Cargar slots cuando cambia fecha o esteticista
   */
  useEffect(() => {
    if (selectedDate && selectedEsthetician) {
      fetchAvailableSlots(selectedDate, selectedEsthetician, serviceDuration);
    }
  }, [selectedDate, selectedEsthetician, serviceDuration]);

  const displaySlots = useMemo(() => {
    if (selectedEsthetician) return availableSlots;
    return generateAllTimeSlots(serviceDuration);
  }, [selectedEsthetician, availableSlots, serviceDuration]);

  const handleSlotSelect = (startTime: string, endTime: string) => {
    setSelectedSlot(startTime);
    setValue('startTime', startTime);
    setValue('endTime', endTime);
  };

  const onValidationError = () => {
    toast.error('Por favor completa todos los campos requeridos');
  };

  /**
   * Enviar formulario
   */
  const onSubmit = async (data: CreateAppointmentDTO) => {
    try {
      setSubmitting(true);

      // Construir prefijo con datos del cliente y contacto de emergencia
      const clientPrefix = [
        clientName && `Nombre: ${clientName}`,
        clientPhone && `Tel: ${clientPhone}`,
        emergencyContactName && `Emergencia: ${emergencyContactName}`,
        emergencyContactPhone && `Tel Emergencia: ${emergencyContactPhone}`
      ].filter(Boolean).join(' | ');

      let finalNotes = data.notes || '';
      if (showOtherService && otherServiceDescription) {
        finalNotes = `[Servicio: ${otherServiceDescription}]\n${finalNotes}`;
      }
      if (clientPrefix) {
        finalNotes = finalNotes ? `${clientPrefix}\n${finalNotes}` : clientPrefix;
      }

      const appointmentData: CreateAppointmentDTO = {
        ...data,
        date: selectedDate,
        notes: finalNotes
      };

      const id = await createAppointment(appointmentData);

      if (id) {
        onSuccess?.();
        onClose();
      } else {
        toast.error('No se pudo crear la cita. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Error inesperado al crear la cita');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-semibold text-white">
            Nueva Cita
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit, onValidationError)} className="p-6 space-y-6">
          {/* Client Information */}
          <div className="space-y-4 p-4 bg-dark-900/50 border border-dark-700 rounded-lg">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-gold-400" />
              Información del Cliente
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cédula → clientId */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Número de Cédula *
                </label>
                <input
                  {...register('clientId')}
                  type="text"
                  placeholder="Ej: 1-0000-0000"
                  className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-400"
                />
                {errors.clientId && (
                  <p className="mt-1 text-sm text-red-400">{errors.clientId.message}</p>
                )}
              </div>

              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: María González Pérez"
                  className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-400"
                />
              </div>

              {/* Teléfono */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Ej: 8888-8888"
                  className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-400"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4 p-4 bg-dark-900/50 border border-dark-700 rounded-lg">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold-400" />
              Contacto de Emergencia
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="Ej: Juan González"
                  className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="Ej: 8888-8888"
                  className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-400"
                />
              </div>
            </div>
          </div>

          {/* Esthetician */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
              <User className="w-4 h-4 text-gold-400" />
              Esteticista
            </label>
            <select
              {...register('estheticianId')}
              value={selectedEsthetician}
              onChange={(e) => {
                setSelectedEsthetician(e.target.value);
                setValue('estheticianId', e.target.value);
              }}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">Seleccionar esteticista</option>
              <option value="esthetician-1">Lic. Grettel Bolaños González</option>
              <option value="esthetician-2">Esteticista 2</option>
              <option value="esthetician-3">Esteticista 3</option>
            </select>
            {errors.estheticianId && (
              <p className="mt-1 text-sm text-red-400">{errors.estheticianId.message}</p>
            )}
          </div>

          {/* Service */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
              <Scissors className="w-4 h-4 text-gold-400" />
              Servicio
            </label>
            <select
              {...register('serviceId')}
              onChange={(e) => {
                const value = e.target.value;
                setValue('serviceId', value);
                
                if (value === 'OTHER') {
                  setShowOtherService(true);
                  setServiceDuration(90);
                } else {
                  setShowOtherService(false);
                  setOtherServiceDescription('');
                  
                  // Encontrar servicio y establecer duración
                  const service = services.find(s => s.id === value);
                  if (service) {
                    setServiceDuration(service.duration);
                  }
                }
              }}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">Seleccionar servicio</option>
              
              {/* Servicios activos */}
              {services.filter(s => s.isActive).map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.duration} min
                </option>
              ))}
              
              {/* Opción "Otros" */}
              <option value="OTHER" className="font-semibold text-gold-400">
                ➕ Otro servicio (especificar)
              </option>
            </select>
            {errors.serviceId && (
              <p className="mt-1 text-sm text-red-400">{errors.serviceId.message}</p>
            )}
          </div>

          {/* Campo condicional: Descripción de "Otros" */}
          {showOtherService && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-white">
                Describe el servicio
              </label>
              <textarea
                value={otherServiceDescription}
                onChange={(e) => setOtherServiceDescription(e.target.value)}
                placeholder="Ej: Tratamiento facial personalizado, depilación específica, etc."
                rows={3}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm"
                required
              />
              <p className="text-xs text-dark-400">
                💡 Esta descripción se guardará en las notas de la cita
              </p>
            </motion.div>
          )}

          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              Fecha
            </label>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value + 'T12:00:00');
                setSelectedDate(newDate);
                setValue('date', newDate);
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent [color-scheme:dark]"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
            )}
          </div>

          {/* Time Slots */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
              <Clock className="w-4 h-4 text-gold-400" />
              Horario
            </label>
            {!selectedEsthetician && (
              <p className="text-xs text-dark-400 mb-3">
                Selecciona una esteticista para ver su disponibilidad real
              </p>
            )}
            <TimeSlotSelector
              slots={displaySlots}
              selectedSlot={selectedSlot}
              onSelect={handleSlotSelect}
              loading={!!selectedEsthetician && loadingSlots}
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-400">{errors.startTime.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
              <FileText className="w-4 h-4 text-gold-400" />
              Notas del cliente
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Notas visibles para el cliente..."
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none placeholder-dark-400"
            />
          </div>

          {/* Internal Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
              <FileText className="w-4 h-4 text-gold-400" />
              Notas internas
            </label>
            <textarea
              {...register('internalNotes')}
              rows={2}
              placeholder="Notas solo para el staff..."
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none placeholder-dark-400"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="flex-1"
            >
              {submitting ? 'Creando...' : 'Crear Cita'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

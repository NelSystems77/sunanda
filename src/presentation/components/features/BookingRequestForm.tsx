/**
 * BookingRequestForm Component
 * 
 * Formulario multi-step para solicitud de cita
 * Steps:
 * 1. Seleccionar servicio
 * 2. Información personal
 * 3. Fecha y hora preferida
 * 4. Confirmación
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays } from 'date-fns';
import { Calendar, User, Clock, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Service } from '@/core/domain/interfaces/Service';
import { serviceRepository } from '@/core/infrastructure/repositories/ServiceRepository';
import { bookingRequestRepository } from '@/core/infrastructure/repositories/BookingRequestRepository';
import { CreateBookingRequestDTO } from '@/core/domain/interfaces/BookingRequest';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Spinner } from '../ui/Spinner';

export function BookingRequestForm() {
  const { t, i18n } = useTranslation(['booking', 'validation', 'common']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentLang = i18n.language as 'es' | 'en';

  // State
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Validation schema
  const schema = z.object({
    serviceId: z.string().min(1, t('validation:service.required')),
    clientName: z.string().min(3, t('validation:name.min', { min: 3 })),
    clientEmail: z.string().email(t('validation:email.invalid')),
    clientPhone: z.string().min(8, t('validation:phone.invalid')),
    requestedDate: z.string().min(1, t('validation:date.required')),
    requestedTime: z.string().min(1, t('validation:time.required')),
    flexibleTime: z.boolean(),
    preferredTimeSlot: z.enum(['morning', 'afternoon', 'evening']).optional(),
    notes: z.string().max(500, t('validation:notes.max', { max: 500 })).optional(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      flexibleTime: false,
      preferredTimeSlot: 'morning',
    },
  });

  const watchedValues = watch();

  // Cargar servicios
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const allServices = await serviceRepository.getAll();
      const activeServices = allServices.filter(s => s.isActive);
      setServices(activeServices);

      // Si viene serviceId por URL, pre-seleccionarlo
      const serviceIdFromUrl = searchParams.get('service');
      if (serviceIdFromUrl) {
        const service = activeServices.find(s => s.id === serviceIdFromUrl);
        if (service) {
          setSelectedService(service);
          setValue('serviceId', service.id);
          setStep(2); // Ir directamente al paso 2
        }
      }
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error(t('common:errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  // Manejar selección de servicio
  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      setValue('serviceId', serviceId);
      setStep(2);
    }
  };

  // Submit del formulario
  const onSubmit = async (data: FormData) => {
    if (!selectedService) return;

    try {
      setSubmitting(true);

      const dto: CreateBookingRequestDTO = {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientLanguage: currentLang,
        serviceId: data.serviceId,
        requestedDate: new Date(data.requestedDate),
        requestedTime: data.requestedTime,
        flexibleTime: data.flexibleTime,
        preferredTimeSlot: data.preferredTimeSlot,
        notes: data.notes,
      };

      await bookingRequestRepository.create(dto, {
        name: selectedService.name,
        priceCRC: selectedService.priceCRC,
        priceUSD: selectedService.priceUSD,
        duration: selectedService.duration,
      });

      toast.success(t('booking:messages.success.title'));
      
      // Ir a página de éxito
      navigate('/booking-success');
    } catch (error) {
      console.error('Error submitting booking request:', error);
      toast.error(t('booking:messages.error.description'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                  s === step
                    ? 'bg-primary-500 border-primary-500 text-dark-900'
                    : s < step
                    ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                    : 'bg-dark-800 border-dark-700 text-dark-500'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`h-1 w-16 mx-2 transition-colors ${
                    s < step ? 'bg-primary-500' : 'bg-dark-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Seleccionar Servicio */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              {t('booking:steps.selectService')}
            </h2>

            <div className="grid gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedService?.id === service.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-700 bg-dark-800 hover:border-primary-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {service.name}
                      </h3>
                      <p className="text-dark-300 text-sm mb-3">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-dark-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {service.duration} min
                        </span>
                        <span className="text-primary-400 font-bold">
                          ₡{service.priceCRC.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Información Personal */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              {t('booking:form.personalInfo.title')}
            </h2>

            <Input
              label={t('booking:form.personalInfo.name')}
              placeholder={t('booking:form.personalInfo.namePlaceholder')}
              error={errors.clientName?.message}
              {...register('clientName')}
            />

            <Input
              label={t('booking:form.personalInfo.email')}
              type="email"
              placeholder={t('booking:form.personalInfo.emailPlaceholder')}
              error={errors.clientEmail?.message}
              {...register('clientEmail')}
            />

            <Input
              label={t('booking:form.personalInfo.phone')}
              placeholder={t('booking:form.personalInfo.phonePlaceholder')}
              error={errors.clientPhone?.message}
              {...register('clientPhone')}
            />

            <Textarea
              label={t('booking:form.personalInfo.notes')}
              placeholder={t('booking:form.personalInfo.notesPlaceholder')}
              error={errors.notes?.message}
              rows={4}
              {...register('notes')}
            />
          </div>
        )}

        {/* Step 3: Fecha y Hora */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              {t('booking:form.dateTime.title')}
            </h2>

            <Input
              label={t('booking:form.dateTime.date')}
              type="date"
              min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
              error={errors.requestedDate?.message}
              {...register('requestedDate')}
            />

            <Input
              label={t('booking:form.dateTime.time')}
              type="time"
              min="09:00"
              max="21:00"
              error={errors.requestedTime?.message}
              {...register('requestedTime')}
            />

            <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
              <p className="text-sm text-dark-300 mb-2">
                {t('booking:info.confirmationNote')}
              </p>
              <p className="text-xs text-dark-400">
                {t('booking:info.responseTime')}
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Confirmación */}
        {step === 4 && selectedService && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              {t('booking:form.summary.title')}
            </h2>

            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-4">
              <div>
                <p className="text-sm text-dark-400 mb-1">{t('booking:form.summary.service')}</p>
                <p className="text-white font-semibold">{selectedService.name}</p>
              </div>

              <div>
                <p className="text-sm text-dark-400 mb-1">{t('booking:form.summary.date')}</p>
                <p className="text-white font-semibold">
                  {watchedValues.requestedDate} - {watchedValues.requestedTime}
                </p>
              </div>

              <div>
                <p className="text-sm text-dark-400 mb-1">{t('booking:form.summary.contactInfo')}</p>
                <p className="text-white">{watchedValues.clientName}</p>
                <p className="text-dark-300 text-sm">{watchedValues.clientEmail}</p>
                <p className="text-dark-300 text-sm">{watchedValues.clientPhone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navegación */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('booking:buttons.back')}
            </Button>
          )}

          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => setStep(step + 1)}
              className="ml-auto"
            >
              {t('booking:buttons.continue')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="ml-auto"
            >
              {submitting ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t('booking:buttons.submit')}
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import * as QRCode from 'qrcode';
import { DollarSign, Smartphone, CreditCard, Banknote, X, CheckCircle, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Spinner } from '../ui/Spinner';
import { PaymentMethod, PaymentStatus, CreatePaymentDTO } from '@/core/domain/interfaces/Payment';
import { appointmentRepository } from '@/core/infrastructure/repositories/AppointmentRepository';
import { serviceRepository } from '@/core/infrastructure/repositories/ServiceRepository';
import { paymentRepository } from '@/core/infrastructure/repositories/PaymentRepository';
import { clientRepository } from '@/core/infrastructure/repositories/ClientRepository';
import { AppointmentStatus } from '@/core/domain/enums';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const SINPE_PHONE = import.meta.env.VITE_SINPE_PHONE ?? '88083390';

interface AppointmentOption {
  id: string;
  label: string;
  serviceId: string;
  serviceName: string;
  amountCRC: number;
  amountUSD: number;
  clientId: string;
  clientName: string;
}

export interface PaymentFormProps {
  appointmentId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ appointmentId: preselectedId, onSuccess, onCancel }: PaymentFormProps) {
  const { user } = useAuth();

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [options, setOptions] = useState<AppointmentOption[]>([]);
  const [selectedId, setSelectedId] = useState(preselectedId ?? '');
  const [sinpeRef, setSinpeRef] = useState('');
  const [sinpePhone, setSinpePhone] = useState('');
  const [notes, setNotes] = useState('');
  const [qrDataURL, setQrDataURL] = useState('');
  const [qrLoading, setQrLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  const selected = options.find(o => o.id === selectedId);

  // Genera el QR cada vez que cambia la cita seleccionada
  useEffect(() => {
    if (!selected) {
      setQrDataURL('');
      return;
    }

    let cancelled = false;
    setQrLoading(true);

    const sinpeURI = `sinpemovil://${SINPE_PHONE}?amount=${selected.amountCRC}&description=${encodeURIComponent(`Pago SUNANDA - ${selected.serviceName}`)}`;

    QRCode.toDataURL(sinpeURI, {
      width: 220,
      margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' },
    })
      .then((url: string) => {
        if (!cancelled) setQrDataURL(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataURL('');
      })
      .finally(() => {
        if (!cancelled) setQrLoading(false);
      });

    return () => { cancelled = true; };
  }, [selectedId, selected?.amountCRC]);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);

      const [allApts, allPayments, allServices, allClients] = await Promise.all([
        appointmentRepository.getAll(),
        paymentRepository.getAll(),
        serviceRepository.getAll(),
        clientRepository.getAll(),
      ]);

      const paidAptIds = new Set(allPayments.map(p => p.appointmentId));

      const unpaid = allApts.filter(a => {
        const isCompleted =
          a.status === AppointmentStatus.COMPLETED ||
          (a.status as string) === 'completed';
        return isCompleted && !paidAptIds.has(a.id);
      });

      const built: AppointmentOption[] = unpaid.map(a => {
        const service = allServices.find(s => s.id === a.serviceId);
        const client = allClients.find(c => c.id === a.clientId);
        return {
          id: a.id,
          label: `${format(a.date, 'dd MMM yyyy', { locale: es })} · ${a.startTime}`,
          serviceId: a.serviceId,
          serviceName: service?.name ?? 'Servicio',
          amountCRC: service?.priceCRC ?? 0,
          amountUSD: service?.priceUSD ?? 0,
          clientId: a.clientId,
          clientName: client ? `${client.firstName} ${client.lastName}` : 'Cliente',
        };
      });

      setOptions(built);

      if (preselectedId && !built.find(o => o.id === preselectedId)) {
        toast.error('Esta cita ya tiene un pago registrado');
        onCancel();
      }
    } catch (error) {
      console.error('Error loading options:', error);
      toast.error('Error cargando citas');
    } finally {
      setLoadingOptions(false);
    }
  };

  const copyPhone = useCallback(() => {
    navigator.clipboard.writeText(SINPE_PHONE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selected) { toast.error('Selecciona una cita'); return; }
    if (!sinpeRef.trim()) { toast.error('Ingresa el número de confirmación SINPE'); return; }
    if (!user?.id) { toast.error('Usuario no autenticado'); return; }

    setSubmitting(true);
    try {
      const dto: CreatePaymentDTO = {
        appointmentId: selected.id,
        clientId: selected.clientId,
        serviceId: selected.serviceId,
        amountCRC: selected.amountCRC,
        amountUSD: selected.amountUSD,
        currency: 'CRC',
        paymentMethod: PaymentMethod.SINPE_MOVIL,
        description: `${selected.serviceName} — ${selected.label}`,
        notes: notes.trim() || undefined,
        processedBy: user.id,
        sinpePhoneNumber: sinpePhone.trim() || undefined,
      };

      const paymentId = await paymentRepository.create(dto);

      await paymentRepository.updateStatus(paymentId, {
        status: PaymentStatus.COMPLETED,
        sinpeTransactionId: sinpeRef.trim(),
        sinpeReference: sinpeRef.trim(),
        completedAt: new Date(),
      });

      toast.success('Pago registrado correctamente');
      onSuccess();
    } catch (error) {
      console.error('Error registering payment:', error);
      toast.error('Error al registrar el pago');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-dark-700 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Registrar Pago</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-dark-400" />
          </button>
        </div>

        {/* Body */}
        {loadingOptions ? (
          <div className="flex justify-center py-14">
            <Spinner size="lg" />
          </div>
        ) : options.length === 0 && !preselectedId ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="font-semibold text-gray-900 dark:text-white">Sin citas pendientes de cobro</p>
            <p className="text-sm text-gray-500 dark:text-dark-400 mt-1">
              Todas las citas completadas ya tienen pago registrado.
            </p>
            <Button variant="outline" className="mt-4" onClick={onCancel}>Cerrar</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">

            {/* Selector de cita */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1.5">
                Cita a cobrar *
              </label>
              {preselectedId && selected ? (
                <div className="px-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-600">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selected.clientName}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-400 mt-0.5">
                    {selected.serviceName} · {selected.label}
                  </p>
                </div>
              ) : (
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-600 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                >
                  <option value="">Selecciona una cita…</option>
                  {options.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.clientName} — {o.serviceName} · {o.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Monto (readonly) */}
            {selected && (
              <div className="px-4 py-3 bg-gold-50 dark:bg-gold-900/10 rounded-xl border border-gold-200 dark:border-gold-800/30">
                <p className="text-xs text-gray-500 dark:text-dark-400">Monto a cobrar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                  ₡{selected.amountCRC.toLocaleString('es-CR')}
                </p>
                <p className="text-xs text-gray-400 dark:text-dark-500 mt-0.5">{selected.serviceName}</p>
              </div>
            )}

            {/* Selector de método */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Método de pago
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 border-gold-500 bg-gold-50 dark:bg-gold-900/20">
                  <Smartphone className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                  <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">SINPE Móvil</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gold-500 text-white rounded-full font-medium">Activo</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-600 opacity-50 cursor-not-allowed select-none">
                  <CreditCard className="w-5 h-5 text-gray-400 dark:text-dark-500" />
                  <span className="text-xs font-medium text-gray-400 dark:text-dark-500 text-center">Tarjeta</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-dark-600 text-gray-500 dark:text-dark-400 rounded-full">Próximo</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-600 opacity-50 cursor-not-allowed select-none">
                  <Banknote className="w-5 h-5 text-gray-400 dark:text-dark-500" />
                  <span className="text-xs font-medium text-gray-400 dark:text-dark-500 text-center">Efectivo</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-dark-600 text-gray-500 dark:text-dark-400 rounded-full">Próximo</span>
                </div>
              </div>
            </div>

            {/* QR SINPE — aparece cuando hay cita y monto */}
            {selected && (
              <div className="rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase tracking-wide flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5" />
                    Código QR SINPE Móvil
                  </p>
                </div>

                <div className="p-4 flex flex-col items-center gap-3">
                  {qrLoading ? (
                    <div className="w-[220px] h-[220px] flex items-center justify-center">
                      <Spinner size="lg" />
                    </div>
                  ) : qrDataURL ? (
                    <img
                      src={qrDataURL}
                      alt="QR SINPE Móvil"
                      className="w-[220px] h-[220px] rounded-lg border border-gray-200 dark:border-dark-600"
                    />
                  ) : null}

                  <p className="text-xs text-center text-gray-500 dark:text-dark-400 max-w-[220px]">
                    El cliente escanea este QR con su app bancaria para enviar{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₡{selected.amountCRC.toLocaleString('es-CR')}
                    </span>{' '}
                    al número del spa.
                  </p>

                  {/* Número del spa con botón copiar */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-900 rounded-xl">
                    <Smartphone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    <span className="text-sm font-mono font-bold text-gray-900 dark:text-white tracking-widest">
                      {SINPE_PHONE}
                    </span>
                    <button
                      type="button"
                      onClick={copyPhone}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors text-gray-500 dark:text-dark-400"
                      title="Copiar número"
                    >
                      {copied
                        ? <Check className="w-4 h-4 text-green-500" />
                        : <Copy className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Campos SINPE */}
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase tracking-wide">
                Confirmar transferencia
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Número de confirmación *
                </label>
                <Input
                  type="text"
                  placeholder="Código del comprobante SINPE"
                  value={sinpeRef}
                  onChange={e => setSinpeRef(e.target.value)}
                />
                <p className="text-xs text-gray-400 dark:text-dark-500 mt-1">
                  Verificar con el comprobante del cliente antes de confirmar.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Teléfono origen (opcional)
                </label>
                <Input
                  type="tel"
                  placeholder="8888-8888"
                  value={sinpePhone}
                  onChange={e => setSinpePhone(e.target.value)}
                />
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Notas (opcional)
              </label>
              <textarea
                rows={2}
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-600 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                placeholder="Observaciones adicionales…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" onClick={onCancel} disabled={submitting} className="flex-1">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || !selectedId || !sinpeRef.trim()}
                className="flex-1"
              >
                {submitting ? 'Registrando…' : 'Confirmar pago'}
              </Button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}

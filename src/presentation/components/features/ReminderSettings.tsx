import { useState } from 'react';
import { Bell, Send, CheckCircle, X, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ReminderSettingsProps {
  onClose: () => void;
}

/**
 * Panel de configuración de recordatorios
 * Permite configurar recordatorios automáticos y manuales
 */
export function ReminderSettings({ onClose }: ReminderSettingsProps) {
  const [autoReminders, setAutoReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState(24); // horas antes
  const [channels, setChannels] = useState({
    sms: true,
    email: true,
    whatsapp: false
  });
  const [confirmationReminder, setConfirmationReminder] = useState(true);
  const [dayBeforeReminder, setDayBeforeReminder] = useState(true);

  const handleSaveSettings = () => {
    // Guardar configuración
    toast.success('Configuración guardada');
    onClose();
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
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-dark-800 border border-dark-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Configuración de Recordatorios</h3>
              <p className="text-sm text-dark-400 mt-0.5">
                Configura cómo y cuándo se envían los recordatorios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          <div className="space-y-6">
            {/* Recordatorios Automáticos */}
            <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gold-400" />
                  <div>
                    <h4 className="font-semibold text-white">Recordatorios Automáticos</h4>
                    <p className="text-sm text-dark-400">Enviar recordatorios de forma automática</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoReminders(!autoReminders)}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors
                    ${autoReminders ? 'bg-gold-500' : 'bg-dark-700'}
                  `}
                >
                  <div className={`
                    absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                    ${autoReminders ? 'translate-x-7' : 'translate-x-1'}
                  `} />
                </button>
              </div>

              {autoReminders && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-4 border-t border-dark-700"
                >
                  {/* Tiempo de anticipación */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Enviar recordatorio con anticipación
                    </label>
                    <select
                      value={reminderTime}
                      onChange={(e) => setReminderTime(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    >
                      <option value={1}>1 hora antes</option>
                      <option value={2}>2 horas antes</option>
                      <option value={4}>4 horas antes</option>
                      <option value={24}>24 horas antes (1 día)</option>
                      <option value={48}>48 horas antes (2 días)</option>
                    </select>
                  </div>

                  {/* Tipos de recordatorio */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-white">
                      Tipos de recordatorio
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={confirmationReminder}
                        onChange={(e) => setConfirmationReminder(e.target.checked)}
                        className="w-4 h-4 rounded border-dark-600 text-gold-500 focus:ring-gold-500 bg-dark-800"
                      />
                      <div>
                        <div className="text-sm text-white">Recordatorio de confirmación</div>
                        <div className="text-xs text-dark-400">Enviar cuando se crea la cita</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dayBeforeReminder}
                        onChange={(e) => setDayBeforeReminder(e.target.checked)}
                        className="w-4 h-4 rounded border-dark-600 text-gold-500 focus:ring-gold-500 bg-dark-800"
                      />
                      <div>
                        <div className="text-sm text-white">Recordatorio previo</div>
                        <div className="text-xs text-dark-400">Enviar según tiempo configurado</div>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Canales de Envío */}
            <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
              <div className="flex items-center gap-3 mb-4">
                <Send className="w-5 h-5 text-gold-400" />
                <div>
                  <h4 className="font-semibold text-white">Canales de Envío</h4>
                  <p className="text-sm text-dark-400">Selecciona cómo enviar los recordatorios</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-dark-800 rounded-lg cursor-pointer hover:bg-dark-750 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📱</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">SMS</div>
                      <div className="text-xs text-dark-400">Mensaje de texto</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.sms}
                    onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                    className="w-4 h-4 rounded border-dark-600 text-gold-500 focus:ring-gold-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-dark-800 rounded-lg cursor-pointer hover:bg-dark-750 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📧</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Email</div>
                      <div className="text-xs text-dark-400">Correo electrónico</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.email}
                    onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                    className="w-4 h-4 rounded border-dark-600 text-gold-500 focus:ring-gold-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-dark-800 rounded-lg cursor-pointer hover:bg-dark-750 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">💬</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">WhatsApp</div>
                      <div className="text-xs text-dark-400">Mensaje de WhatsApp</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.whatsapp}
                    onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                    className="w-4 h-4 rounded border-dark-600 text-gold-500 focus:ring-gold-500"
                  />
                </label>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-gold-400" />
                <div>
                  <h4 className="font-semibold text-white">Estadísticas de Recordatorios</h4>
                  <p className="text-sm text-dark-400">Resumen de envíos este mes</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">156</div>
                  <div className="text-xs text-dark-400">Enviados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">142</div>
                  <div className="text-xs text-dark-400">Confirmados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-400">91%</div>
                  <div className="text-xs text-dark-400">Efectividad</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-700 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveSettings}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

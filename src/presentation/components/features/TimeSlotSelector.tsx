import { TimeSlot } from '../../../core/infrastructure/services/AvailabilityService';
import { Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlot?: string;
  onSelect: (startTime: string, endTime: string) => void;
  loading?: boolean;
}

/**
 * Selector de slots de tiempo
 * Muestra horarios disponibles y permite seleccionar uno
 */
export function TimeSlotSelector({
  slots,
  selectedSlot,
  onSelect,
  loading = false
}: TimeSlotSelectorProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No hay horarios disponibles para este día</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {slots.map((slot, index) => {
        const isSelected = selectedSlot === slot.startTime;
        const isAvailable = slot.available;

        return (
          <motion.button
            type="button"
            key={`${slot.startTime}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => {
              if (isAvailable) {
                onSelect(slot.startTime, slot.endTime);
              }
            }}
            disabled={!isAvailable}
            className={`
              relative px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${isAvailable
                ? isSelected
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
              }
            `}
          >
            {isSelected && (
              <Check className="absolute top-1 right-1 w-3 h-3" />
            )}
            <div className="text-center">
              {slot.startTime}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

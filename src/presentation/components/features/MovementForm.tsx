import { useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, ModalFooter } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { productRepository } from '@/core/infrastructure/repositories/ProductRepository';
import { Product } from '@/core/domain/interfaces/Product';
import { useAuth } from '@/presentation/hooks/useAuth';

interface MovementFormProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

const MOVEMENT_TYPES: { type: MovementType; label: string; icon: typeof TrendingUp; color: string }[] = [
  { type: 'IN', label: 'Entrada', icon: TrendingUp, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' },
  { type: 'OUT', label: 'Salida', icon: TrendingDown, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800' },
  { type: 'ADJUSTMENT', label: 'Ajuste', icon: RefreshCw, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
];

const IN_REASONS = ['Compra a proveedor', 'Devolución de cliente', 'Corrección de inventario'];
const OUT_REASONS = ['Uso en tratamiento', 'Venta al cliente', 'Vencimiento/descarte', 'Muestra o regalo'];

export function MovementForm({ product, onClose, onSuccess }: MovementFormProps) {
  const { user } = useAuth();
  const [movType, setMovType] = useState<MovementType>('IN');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = movType === 'IN' ? IN_REASONS : movType === 'OUT' ? OUT_REASONS : [];
  const finalReason = reason === '__custom__' ? customReason : reason;

  const projectedStock = () => {
    if (movType === 'IN') return product.quantity + quantity;
    if (movType === 'OUT') return product.quantity - quantity;
    return quantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) { toast.error('La cantidad debe ser mayor a 0'); return; }
    if (!finalReason.trim()) { toast.error('Ingresa el motivo del movimiento'); return; }
    if (movType === 'OUT' && quantity > product.quantity) {
      toast.error(`Stock insuficiente. Disponible: ${product.quantity} ${product.unit}`);
      return;
    }

    setLoading(true);
    try {
      await productRepository.registerMovement({
        productId: product.id,
        type: movType,
        quantity: movType === 'ADJUSTMENT' ? quantity : quantity,
        reason: finalReason,
        notes: notes.trim() || undefined,
        performedBy: user?.email ?? 'admin',
      });
      toast.success('Movimiento registrado');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message ?? 'Error al registrar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Movimiento — ${product.name}`}
      description={`Stock actual: ${product.quantity} ${product.unit}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Movement type selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de movimiento
          </label>
          <div className="grid grid-cols-3 gap-3">
            {MOVEMENT_TYPES.map(({ type, label, icon: Icon, color }) => (
              <button
                key={type}
                type="button"
                onClick={() => { setMovType(type); setReason(''); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  movType === type ? color + ' border-current' : 'border-gray-200 dark:border-dark-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <Input
          label={movType === 'ADJUSTMENT' ? `Nuevo stock (${product.unit})` : `Cantidad (${product.unit})`}
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          fullWidth
          required
        />

        {/* Stock projection */}
        {movType !== 'ADJUSTMENT' && (
          <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-xl text-sm">
            <span className="text-gray-500 dark:text-gray-400">Stock resultante: </span>
            <span className={`font-bold ${projectedStock() < product.minStock ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
              {projectedStock()} {product.unit}
            </span>
            {projectedStock() < product.minStock && (
              <span className="ml-2 text-red-500 text-xs">(por debajo del mínimo)</span>
            )}
          </div>
        )}

        {/* Reason */}
        {reasons.length > 0 ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Motivo *</label>
            <div className="grid grid-cols-1 gap-2">
              {reasons.map(r => (
                <label key={r} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-dark-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700">
                  <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-gold-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{r}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-dark-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700">
                <input type="radio" name="reason" value="__custom__" checked={reason === '__custom__'} onChange={() => setReason('__custom__')} className="accent-gold-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Otro motivo...</span>
              </label>
            </div>
            {reason === '__custom__' && (
              <Input value={customReason} onChange={e => setCustomReason(e.target.value)} placeholder="Describe el motivo" fullWidth />
            )}
          </div>
        ) : (
          <Input
            label="Motivo del ajuste *"
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
            placeholder="Ej: Conteo físico"
            fullWidth
            required
          />
        )}

        {/* Notes */}
        <Input
          label="Notas adicionales"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Opcional"
          fullWidth
        />
      </form>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit as any} disabled={loading}>
          {loading ? 'Guardando...' : 'Registrar movimiento'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

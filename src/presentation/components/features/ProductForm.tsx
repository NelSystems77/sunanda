import { useState } from 'react';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, ModalFooter } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { productRepository } from '@/core/infrastructure/repositories/ProductRepository';
import { Product, CreateProductDTO } from '@/core/domain/interfaces/Product';
import { ProductType } from '@/core/domain/enums';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSuccess: () => void;
}

const PRODUCT_TYPE_OPTIONS = [
  { value: ProductType.TREATMENT, label: 'Tratamiento' },
  { value: ProductType.RETAIL, label: 'Venta al público' },
  { value: ProductType.CONSUMABLE, label: 'Consumible' },
];

const UNIT_OPTIONS = [
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'unidad', label: 'Unidad' },
  { value: 'frasco', label: 'Frasco' },
  { value: 'ampolla', label: 'Ampolla' },
  { value: 'caja', label: 'Caja' },
];

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name ?? '',
    brand: product?.brand ?? 'Germaine de Capuccini',
    description: product?.description ?? '',
    type: product?.type ?? ProductType.RETAIL,
    sku: product?.sku ?? '',
    quantity: product?.quantity ?? 0,
    minStock: product?.minStock ?? 5,
    maxStock: product?.maxStock ?? 50,
    unit: product?.unit ?? 'unidad',
    cost: product?.cost ?? 0,
    price: product?.price ?? 0,
    supplier: product?.supplier ?? '',
    location: product?.location ?? '',
    imageURL: product?.imageURL ?? '',
  });
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brand.trim()) {
      toast.error('Nombre y marca son requeridos');
      return;
    }

    setLoading(true);
    try {
      const dto: CreateProductDTO = {
        ...form,
        quantity: Number(form.quantity),
        minStock: Number(form.minStock),
        maxStock: Number(form.maxStock),
        cost: Number(form.cost),
        price: Number(form.price),
      };

      if (isEdit && product) {
        await productRepository.update(product.id, dto);
        toast.success('Producto actualizado');
      } else {
        await productRepository.create(dto);
        toast.success('Producto creado');
      }
      onSuccess();
    } catch (err) {
      toast.error('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Editar Producto' : 'Nuevo Producto'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nombre del producto *" value={form.name} onChange={set('name')} required fullWidth />
          <Input label="Marca *" value={form.brand} onChange={set('brand')} required fullWidth />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo"
            value={form.type}
            onChange={set('type') as any}
            options={PRODUCT_TYPE_OPTIONS}
            fullWidth
          />
          <Select
            label="Unidad de medida"
            value={form.unit}
            onChange={set('unit') as any}
            options={UNIT_OPTIONS}
            fullWidth
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input label="Stock actual" type="number" min="0" value={form.quantity} onChange={set('quantity')} fullWidth />
          <Input label="Stock mínimo" type="number" min="0" value={form.minStock} onChange={set('minStock')} fullWidth />
          <Input label="Stock máximo" type="number" min="0" value={form.maxStock} onChange={set('maxStock')} fullWidth />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Costo (₡)" type="number" min="0" value={form.cost} onChange={set('cost')} fullWidth />
          <Input label="Precio venta (₡)" type="number" min="0" value={form.price} onChange={set('price')} hint="Precio para venta al cliente" fullWidth />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="SKU / Código" value={form.sku} onChange={set('sku')} fullWidth />
          <Input label="Proveedor" value={form.supplier} onChange={set('supplier')} fullWidth />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Ubicación en bodega" value={form.location} onChange={set('location')} fullWidth />
          <Input label="URL imagen" value={form.imageURL} onChange={set('imageURL')} fullWidth />
        </div>
      </form>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button
          variant="primary"
          onClick={handleSubmit as any}
          disabled={loading}
          leftIcon={<Package className="w-4 h-4" />}
        >
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { Package, Plus, AlertTriangle, TrendingUp, Search, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/layout/EmptyState';
import { ProductForm } from '../components/features/ProductForm';
import { MovementForm } from '../components/features/MovementForm';
import { productRepository } from '@/core/infrastructure/repositories/ProductRepository';
import { Product } from '@/core/domain/interfaces/Product';
import { ProductType } from '@/core/domain/enums';

const TYPE_LABELS: Record<ProductType, string> = {
  [ProductType.TREATMENT]: 'Tratamiento',
  [ProductType.RETAIL]: 'Venta',
  [ProductType.CONSUMABLE]: 'Consumible',
};

const TYPE_COLORS: Record<ProductType, string> = {
  [ProductType.TREATMENT]: 'purple',
  [ProductType.RETAIL]: 'blue',
  [ProductType.CONSUMABLE]: 'gray',
};

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [movementProduct, setMovementProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productRepository.getAll();
      setProducts(data);
    } catch {
      toast.error('Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const lowStock = useMemo(() => products.filter(p => p.quantity <= p.minStock), [products]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const totalValue = useMemo(
    () => products.reduce((sum, p) => sum + p.quantity * p.cost, 0),
    [products]
  );

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await productRepository.softDelete(product.id);
      toast.success('Producto eliminado');
      loadProducts();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Inventario"
          description="Control de productos y stock"
          actions={
            <Button
              variant="primary"
              onClick={() => setShowProductForm(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Nuevo Producto
            </Button>
          }
        />

        {/* Low stock alert */}
        {lowStock.length > 0 && (
          <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white text-sm mb-1">
                {lowStock.length} {lowStock.length === 1 ? 'producto con stock bajo' : 'productos con stock bajo'}
              </p>
              <div className="flex flex-wrap gap-2">
                {lowStock.map(p => (
                  <span key={p.id} className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                    {p.name} ({p.quantity} {p.unit})
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-dark-400">Total productos</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{products.length}</p>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-dark-400">Stock bajo</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{lowStock.length}</p>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-dark-400">Valor en bodega</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ₡{totalValue.toLocaleString('es-CR')}
            </p>
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder="Buscar por nombre, marca o SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          fullWidth
        />

        {/* Table */}
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Package}
              title={search ? 'Sin resultados' : 'Sin productos'}
              description={search ? 'Intenta con otro término de búsqueda' : 'Crea tu primer producto para comenzar'}
              action={!search ? { label: 'Nuevo Producto', onClick: () => setShowProductForm(true) } : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900/50">
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-dark-400">Producto</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-dark-400">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-dark-400">Stock</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-dark-400">Mínimo</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-dark-400">Costo unit.</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-dark-400">Precio</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-dark-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(product => (
                    <tr key={product.id} className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-xs text-gray-500 dark:text-dark-400">{product.brand}{product.sku ? ` · ${product.sku}` : ''}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={TYPE_COLORS[product.type] as any} size="sm">
                          {TYPE_LABELS[product.type]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                          product.quantity <= product.minStock
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {product.quantity} {product.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-dark-400">
                        {product.minStock} {product.unit}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        ₡{product.cost.toLocaleString('es-CR')}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {product.price ? `₡${product.price.toLocaleString('es-CR')}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setMovementProduct(product)}
                            title="Registrar movimiento"
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditProduct(product)}
                            title="Editar"
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            title="Eliminar"
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showProductForm && (
        <ProductForm
          onClose={() => setShowProductForm(false)}
          onSuccess={() => { setShowProductForm(false); loadProducts(); }}
        />
      )}
      {editProduct && (
        <ProductForm
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={() => { setEditProduct(null); loadProducts(); }}
        />
      )}
      {movementProduct && (
        <MovementForm
          product={movementProduct}
          onClose={() => setMovementProduct(null)}
          onSuccess={() => { setMovementProduct(null); loadProducts(); }}
        />
      )}
    </DashboardLayout>
  );
}

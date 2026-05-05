import { useState, useEffect } from 'react';
import { useServices } from '../hooks/useServices';
import { Service } from '@/core/domain/interfaces/Service';
import { ServiceCategory, getServiceCategoryText } from '../../core/domain/enums/serviceCategory';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { ServiceCard } from '../components/features/ServiceCard';
import { Button } from '../components/ui/Button';
import { Modal, ModalFooter } from '../components/ui/Modal';
import { Alert } from '../components/ui/Alert';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export function ServicesPage() {
  const {
    services,
    loading,
    selectedCategory,
    setSelectedCategory,
    fetchActiveServices,
    createService,
    updateService,
    activateService,
    deactivateService,
    deleteService,
    stats
  } = useServices();

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ServiceCategory.FACIAL,
    duration: 60,
    priceCRC: 0,
    priceUSD: 0,
    imageURL: '',
    benefits: [] as string[],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
    promotionType: 'percentage' as 'percentage' | '2x1',
    promotionValue: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchActiveServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const serviceStats = stats();
  const categories: Array<ServiceCategory | 'all'> = ['all', ServiceCategory.FACIAL, ServiceCategory.CORPORAL, ServiceCategory.PAQUETE];

  const handleOpenCreate = () => {
    setEditingService(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      name: '',
      description: '',
      category: ServiceCategory.FACIAL,
      duration: 60,
      priceCRC: 0,
      priceUSD: 0,
      imageURL: '',
      benefits: [],
      productLines: ['Germaine de Capuccini'],
      hasPromotion: false,
      promotionType: 'percentage',
      promotionValue: 0,
      isActive: true,
    });
    setShowForm(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setImageFile(null);
    setImagePreview('');
    
    // Normalizar category: convertir a lowercase si viene en uppercase de la DB
    const normalizedCategory = service.category.toLowerCase() as ServiceCategory;
    
    setFormData({
      name: service.name,
      description: service.description,
      category: normalizedCategory,
      duration: service.duration,
      priceCRC: service.priceCRC,
      priceUSD: service.priceUSD,
      imageURL: service.imageURL || '',
      benefits: service.benefits || [],
      productLines: service.productLines || ['Germaine de Capuccini'],
      hasPromotion: service.hasPromotion || false,
      promotionType: service.promotionType || 'percentage',
      promotionValue: service.promotionValue || 0,
      isActive: service.isActive,
    });
    setShowForm(true);
  };

  /**
   * Manejar selección de archivo de imagen
   */
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen (JPG, PNG, etc.)');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es muy grande. Máximo 5MB');
      return;
    }

    setImageFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData({ ...formData, imageURL: result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.priceCRC <= 0) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
        toast.success('Servicio actualizado correctamente');
      } else {
        await createService(formData);
        toast.success('Servicio creado correctamente');
      }
      setShowForm(false);
      fetchActiveServices();
    } catch (error) {
      toast.error('Error al guardar el servicio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    setIsSubmitting(true);
    try {
      await deleteService(deletingId);
      toast.success('Servicio eliminado correctamente');
      setShowDeleteModal(false);
      setDeletingId(null);
      fetchActiveServices();
    } catch (error) {
      toast.error('Error al eliminar el servicio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await activateService(id);
        toast.success('Servicio activado');
      } else {
        await deactivateService(id);
        toast.success('Servicio desactivado');
      }
      fetchActiveServices();
    } catch (error) {
      toast.error('Error al cambiar estado del servicio');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Servicios"
          description="Catálogo de tratamientos y servicios"
          breadcrumbs={[{ label: 'Servicios' }]}
          actions={
            <Button 
              variant="primary"
              onClick={handleOpenCreate}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Servicio
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
            <div className="text-sm text-dark-400">Total</div>
            <div className="text-2xl font-bold text-white">{serviceStats.total}</div>
          </div>
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-sm text-green-300">Activos</div>
            <div className="text-2xl font-bold text-green-400">{serviceStats.active}</div>
          </div>
          <div className="bg-gold-500/20 border border-gold-500/30 rounded-lg p-4">
            <div className="text-sm text-gold-300">Con Promoción</div>
            <div className="text-2xl font-bold text-gold-400">{serviceStats.withPromotions}</div>
          </div>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="text-sm text-blue-300">Faciales</div>
            <div className="text-2xl font-bold text-blue-400">{serviceStats.byCategory[ServiceCategory.FACIAL] || 0}</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-400"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
                ${selectedCategory === category
                  ? 'bg-gold-500 text-dark-900'
                  : 'bg-dark-800 border border-dark-700 text-dark-300 hover:text-white hover:border-gold-500'
                }
              `}
            >
              {category === 'all' ? 'Todos' : getServiceCategoryText(category)}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
            <p className="mt-4 text-dark-300">Cargando servicios...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-dark-800 border border-dark-700 rounded-lg">
            <p className="text-dark-400">No se encontraron servicios</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ServiceCard
                  service={service}
                  onEdit={handleOpenEdit}
                  onDelete={(id) => {
                    setDeletingId(id);
                    setShowDeleteModal(true);
                  }}
                  onToggleActive={handleToggleActive}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <Modal
            isOpen={showForm}
            onClose={() => !isSubmitting && setShowForm(false)}
            title={editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            size="xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              {/* Image/Icon Selector */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Imagen o Icono
                </label>
                <div className="space-y-3">
                  {/* Preview */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gold-900/20 to-gold-800/20 flex items-center justify-center overflow-hidden border border-dark-700">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : formData.imageURL ? (
                        formData.imageURL.startsWith('http') || formData.imageURL.startsWith('data:') ? (
                          <img src={formData.imageURL} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl">{formData.imageURL}</span>
                        )
                      ) : (
                        <span className="text-4xl text-dark-600">?</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-dark-400">
                        Puedes usar un emoticon, subir una imagen o pegar una URL
                      </p>
                    </div>
                  </div>

                  {/* Emoticon Selector */}
                  <div>
                    <p className="text-xs font-medium text-dark-300 mb-2">Emoticones rápidos:</p>
                    <div className="grid grid-cols-8 gap-2">
                      {['✨', '💆', '💅', '🧖', '💄', '🌸', '🌺', '💐', '🦋', '💎', '👑', '⭐', '💫', '🔮', '🎀', '🌟'].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, imageURL: emoji });
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className={`
                            w-10 h-10 rounded-lg flex items-center justify-center text-2xl
                            border-2 transition-all hover:scale-110
                            ${formData.imageURL === emoji 
                              ? 'border-gold-500 bg-gold-500/20' 
                              : 'border-dark-700 hover:border-dark-600'
                            }
                          `}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File Upload (NUEVO) */}
                  <div>
                    <p className="text-xs font-medium text-dark-300 mb-2">Sube una imagen (JPG, PNG):</p>
                    <label className="flex items-center gap-3 px-4 py-3 bg-dark-900 border-2 border-dashed border-dark-700 rounded-lg hover:border-gold-500 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
                        <Plus className="w-5 h-5 text-gold-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">
                          {imageFile ? imageFile.name : 'Seleccionar imagen'}
                        </p>
                        <p className="text-xs text-dark-400">
                          JPG, PNG - Máximo 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* URL Input */}
                  <div>
                    <p className="text-xs font-medium text-dark-300 mb-2">O pega la URL de una imagen:</p>
                    <input
                      type="url"
                      value={formData.imageURL.startsWith('http') ? formData.imageURL : ''}
                      onChange={(e) => {
                        setFormData({ ...formData, imageURL: e.target.value });
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 text-sm"
                    />
                    <p className="text-xs text-dark-500 mt-1">
                      💡 Tip: También puedes usar una URL directa de internet
                    </p>
                  </div>
                </div>
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                    className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500"
                  >
                    <option value={ServiceCategory.FACIAL}>{getServiceCategoryText(ServiceCategory.FACIAL)}</option>
                    <option value={ServiceCategory.CORPORAL}>{getServiceCategoryText(ServiceCategory.CORPORAL)}</option>
                    <option value={ServiceCategory.PAQUETE}>{getServiceCategoryText(ServiceCategory.PAQUETE)}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Duración (minutos) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="15"
                    step="15"
                    className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Precio CRC *
                  </label>
                  <input
                    type="number"
                    value={formData.priceCRC}
                    onChange={(e) => {
                      const crc = parseInt(e.target.value);
                      setFormData({ 
                        ...formData, 
                        priceCRC: crc,
                        priceUSD: Math.round(crc / 530) // Auto-calculate USD
                      });
                    }}
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Precio USD (auto)
                  </label>
                  <input
                    type="number"
                    value={formData.priceUSD}
                    readOnly
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 text-dark-400 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Promotion */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.hasPromotion}
                    onChange={(e) => setFormData({ ...formData, hasPromotion: e.target.checked })}
                    className="rounded border-dark-700 text-gold-500 focus:ring-gold-500"
                  />
                  <span className="text-sm font-medium text-white">Tiene promoción</span>
                </label>

                {formData.hasPromotion && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Tipo
                      </label>
                      <select
                        value={formData.promotionType}
                        onChange={(e) => setFormData({ ...formData, promotionType: e.target.value as 'percentage' | '2x1' })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500"
                      >
                        <option value="percentage">Porcentaje</option>
                        <option value="2x1">2x1</option>
                      </select>
                    </div>

                    {formData.promotionType === 'percentage' && (
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">
                          Descuento (%)
                        </label>
                        <input
                          type="number"
                          value={formData.promotionValue}
                          onChange={(e) => setFormData({ ...formData, promotionValue: parseInt(e.target.value) })}
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Active */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-dark-700 text-gold-500 focus:ring-gold-500"
                  />
                  <span className="text-sm font-medium text-white">Servicio activo</span>
                </label>
              </div>

              <ModalFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  {editingService ? 'Actualizar' : 'Crear'} Servicio
                </Button>
              </ModalFooter>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => !isSubmitting && setShowDeleteModal(false)}
            title="Eliminar Servicio"
            size="sm"
          >
            <Alert variant="error">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Esta acción no se puede deshacer</p>
                <p className="text-sm mt-1">
                  ¿Estás seguro de que deseas eliminar este servicio?
                </p>
              </div>
            </Alert>

            <ModalFooter className="mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={isSubmitting}
              >
                Eliminar
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

import { Service } from '@/core/domain/interfaces/Service';
import { Clock, Tag, MoreVertical, Edit, Trash, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceCardProps {
  service: Service;
  onEdit?: (service: Service) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  onClick?: () => void;
  showActions?: boolean;
}

export function ServiceCard({
  service,
  onEdit,
  onDelete,
  onToggleActive,
  onClick,
  showActions = true
}: ServiceCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const promotionPrice = service.hasPromotion && service.promotionType === 'percentage'
    ? service.priceCRC - (service.priceCRC * (service.promotionValue || 0) / 100)
    : service.priceCRC;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-dark-800 border border-dark-700 rounded-lg hover:border-gold-500/50 transition-all overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${!service.isActive ? 'opacity-60' : ''}
      `}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gold-900/20 to-gold-800/20">
        {service.imageURL ? (
          // Si es URL (http) o Base64 (data:) → imagen
          service.imageURL.startsWith('http') || service.imageURL.startsWith('data:') ? (
            <img src={service.imageURL} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            // Si no, es emoticon → texto
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {service.imageURL}
            </div>
          )
        ) : (
          // Sin imagen → emoticon default según categoría
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {service.category === 'facial' ? '✨' : service.category === 'corporal' ? '💆' : '🎁'}
          </div>
        )}

        {service.hasPromotion && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {service.promotionType === '2x1' ? '2x1' : `${service.promotionValue}% OFF`}
          </div>
        )}

        {!service.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-dark-800 border border-dark-700 text-white px-4 py-2 rounded-lg font-semibold">
              Inactivo
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-white">{service.name}</h3>
            <p className="text-sm text-dark-300 line-clamp-2">{service.description}</p>
          </div>

          {showActions && (onEdit || onDelete || onToggleActive) && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 hover:bg-dark-700 rounded text-dark-400 hover:text-white transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    {/* Backdrop para cerrar el menu */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMenu(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-44 bg-dark-700 border border-dark-600 rounded-lg shadow-xl z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onEdit && (
                        <button
                          onClick={() => {
                            onEdit(service);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-dark-600 flex items-center gap-2 rounded-t-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gold-400" />
                          Editar
                        </button>
                      )}

                      {onToggleActive && (
                        <button
                          onClick={() => {
                            onToggleActive(service.id, !service.isActive);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-dark-600 flex items-center gap-2 transition-colors"
                        >
                          {service.isActive ? (
                            <>
                              <EyeOff className="w-4 h-4 text-yellow-400" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 text-green-400" />
                              Activar
                            </>
                          )}
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => {
                            onDelete(service.id);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-dark-600 flex items-center gap-2 rounded-b-lg transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                          Eliminar
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-3">
          {service.hasPromotion ? (
            <div>
              <span className="text-2xl font-bold text-gold-400">
                ₡{promotionPrice.toLocaleString()}
              </span>
              <span className="ml-2 text-sm text-dark-400 line-through">
                ₡{service.priceCRC.toLocaleString()}
              </span>
              <span className="ml-2 text-xs text-dark-500">
                ~${service.priceUSD}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-2xl font-bold text-white">
                ₡{service.priceCRC.toLocaleString()}
              </span>
              <span className="ml-2 text-sm text-dark-400">
                ~${service.priceUSD}
              </span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="mt-3 flex items-center gap-4 text-sm text-dark-300">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{service.duration} min</span>
          </div>
          {service.category && (
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span className="capitalize">{service.category.toLowerCase()}</span>
            </div>
          )}
        </div>

        {service.productLines && service.productLines.length > 0 && (
          <div className="mt-2 text-xs text-dark-400">
            <strong className="text-dark-300">Línea:</strong> {service.productLines.join(', ')}
          </div>
        )}
      </div>
    </motion.div>
  );
}

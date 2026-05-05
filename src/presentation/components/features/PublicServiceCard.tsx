/**
 * PublicServiceCard Component
 * 
 * Tarjeta de servicio para clientes (vista pública)
 * Similar a ServiceCard pero sin acciones de administración
 */

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Sparkles } from 'lucide-react';
import { Service } from '@/core/domain/interfaces/Service';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface PublicServiceCardProps {
  service: Service;
}

export function PublicServiceCard({ service }: PublicServiceCardProps) {
  const { t } = useTranslation(['services', 'common']);

  // Calcular precio con promoción si aplica
  const finalPrice = service.hasPromotion && service.promotionType === 'percentage' && service.promotionValue
    ? service.priceCRC - (service.priceCRC * service.promotionValue / 100)
    : service.priceCRC;

  const finalPriceUSD = Math.round(finalPrice / 510);

  return (
    <div className="group relative bg-dark-800 border border-dark-700 rounded-xl overflow-hidden hover:border-primary-500/30 transition-all duration-300">
      {/* Badge de promoción */}
      {service.hasPromotion && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="error" className="animate-pulse">
            {service.promotionType === '2x1' && t('services:card.twoForOne')}
            {service.promotionType === 'percentage' && t('services:card.discount', { percent: service.promotionValue })}
            {service.promotionType === 'fixed' && t('services:card.promo')}
          </Badge>
        </div>
      )}

      {/* Imagen o Emoji */}
      <div className="relative h-48 bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center overflow-hidden">
        {service.imageURL ? (
          <img
            src={service.imageURL}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="text-7xl">
            {service.category === 'facial' && '✨'}
            {service.category === 'corporal' && '💆'}
            {service.category === 'paquete' && '🎁'}
          </div>
        )}
        
        {/* Overlay en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Categoría */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="default" className="text-xs">
            {t(`services:categories.${service.category}`)}
          </Badge>
          {service.brand && (
            <span className="text-xs text-dark-400">
              {service.brand}
            </span>
          )}
        </div>

        {/* Nombre */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
          {service.name}
        </h3>

        {/* Descripción */}
        <p className="text-dark-300 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Info */}
        <div className="space-y-2 mb-4">
          {/* Duración */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-dark-400">
              <Clock className="h-4 w-4" />
              {t('services:card.duration')}
            </div>
            <span className="text-white font-medium">
              {service.duration} {t('services:card.minutes')}
            </span>
          </div>

          {/* Sesiones */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-dark-400">
              <Sparkles className="h-4 w-4" />
              {service.sessions > 1 ? t('services:card.sessions') : t('services:card.session')}
            </div>
            <span className="text-white font-medium">
              {service.sessions} {service.sessions > 1 ? t('services:card.sessions') : t('services:card.session')}
            </span>
          </div>
        </div>

        {/* Precio */}
        <div className="border-t border-dark-700 pt-4 mb-4">
          {service.hasPromotion && service.promotionType === 'percentage' ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-dark-400 line-through text-sm">
                  {t('common:currency.crc')}{service.priceCRC.toLocaleString()}
                </span>
                <Badge variant="error" className="text-xs">
                  -{service.promotionValue}%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-primary-400">
                {t('common:currency.crc')}{finalPrice.toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-white">
              {t('common:currency.crc')}{service.priceCRC.toLocaleString()}
            </div>
          )}
          <div className="text-sm text-dark-400 mt-1">
            {t('common:currency.approximately')} {t('common:currency.usd')}{service.hasPromotion ? finalPriceUSD : service.priceUSD} USD
          </div>
        </div>

        {/* CTA */}
        <Link to={`/booking?service=${service.id}`}>
          <Button
            variant="primary"
            className="w-full group-hover:bg-primary-600 transition-colors"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {t('services:card.bookNow')}
          </Button>
        </Link>
      </div>
    </div>
  );
}

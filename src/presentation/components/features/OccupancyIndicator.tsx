import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface OccupancyIndicatorProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
  previousPercentage?: number;
}

/**
 * Indicador de ocupación porcentual
 * Muestra barras de progreso con colores según el porcentaje
 */
export function OccupancyIndicator({
  percentage,
  showLabel = true,
  size = 'md',
  showTrend = false,
  previousPercentage
}: OccupancyIndicatorProps) {
  /**
   * Obtener color según porcentaje
   */
  const getColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 30) return 'bg-blue-500';
    return 'bg-green-500';
  };

  /**
   * Obtener texto del color
   */
  const getTextColor = () => {
    if (percentage >= 90) return 'text-red-700';
    if (percentage >= 70) return 'text-orange-700';
    if (percentage >= 50) return 'text-yellow-700';
    if (percentage >= 30) return 'text-blue-700';
    return 'text-green-700';
  };

  /**
   * Obtener altura según tamaño
   */
  const getHeight = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'md': return 'h-2.5';
      case 'lg': return 'h-4';
      default: return 'h-2.5';
    }
  };

  /**
   * Calcular tendencia
   */
  const getTrend = () => {
    if (!previousPercentage) return null;
    
    const diff = percentage - previousPercentage;
    
    if (diff > 5) return { icon: TrendingUp, text: 'Aumento', color: 'text-green-600' };
    if (diff < -5) return { icon: TrendingDown, text: 'Disminución', color: 'text-red-600' };
    return { icon: Minus, text: 'Estable', color: 'text-gray-600' };
  };

  const trend = getTrend();

  return (
    <div className="space-y-1">
      {/* Label */}
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Ocupación</span>
          <div className="flex items-center gap-2">
            <span className={`font-bold ${getTextColor()}`}>
              {percentage}%
            </span>
            {showTrend && trend && (
              <div className={`flex items-center gap-1 ${trend.color}`}>
                <trend.icon className="w-4 h-4" />
                <span className="text-xs">{trend.text}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${getHeight()} ${getColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Legend */}
      {size === 'lg' && (
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}

/**
 * Indicador de ocupación compacto (solo badge)
 */
export function OccupancyBadge({ percentage }: { percentage: number }) {
  const getColor = () => {
    if (percentage >= 90) return 'bg-red-100 text-red-800 border-red-300';
    if (percentage >= 70) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (percentage >= 30) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <span className={`
      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
      ${getColor()}
    `}>
      {percentage}% ocupado
    </span>
  );
}

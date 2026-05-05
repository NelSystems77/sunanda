/**
 * Utilidades para manejo responsive
 */

import { BREAKPOINTS } from '../../presentation/hooks/useMobileDetect';

/**
 * Obtiene el tipo de dispositivo basado en width
 */
export const getDeviceType = (width: number): 'mobile' | 'tablet' | 'desktop' => {
  if (width <= BREAKPOINTS.MOBILE_MAX) return 'mobile';
  if (width <= BREAKPOINTS.TABLET_MAX) return 'tablet';
  return 'desktop';
};

/**
 * Clases CSS condicionales por dispositivo
 */
export const responsiveClasses = {
  // Padding para bottom nav en mobile
  contentPadding: (isMobile: boolean) => 
    isMobile ? 'pb-20' : 'pb-0',
  
  // Ancho del sidebar
  sidebarWidth: (isCollapsed: boolean) => 
    isCollapsed ? 'w-16' : 'w-64',
  
  // Transición suave
  transition: 'transition-all duration-300 ease-in-out',
  
  // Overlay oscuro
  overlay: (isVisible: boolean) =>
    `fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`,
  
  // Sidebar según modo
  sidebar: {
    base: 'fixed top-0 left-0 h-full bg-dark-800 border-r border-dark-700 z-50',
    overlay: 'shadow-2xl',
    rail: 'shadow-md',
    desktop: 'shadow-sm',
  },
  
  // Transformación para sidebar mobile
  sidebarTransform: (isOpen: boolean, isOverlay: boolean) => {
    if (!isOverlay) return 'translate-x-0';
    return isOpen ? 'translate-x-0' : '-translate-x-full';
  },
};

/**
 * Debounce para resize events
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

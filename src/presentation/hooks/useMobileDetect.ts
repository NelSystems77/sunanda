import { useState, useEffect } from 'react';

/**
 * Hook para detectar dispositivo con matchMedia reactivo
 * 
 * Breakpoints optimizados para PWA:
 * - Mobile: < 768px (touch-first, bottom nav)
 * - Tablet: 768px - 1280px (sidebar rail colapsado)
 * - Desktop: > 1280px (sidebar completo expandido)
 */

// Constantes de breakpoints (exportadas para uso en otros componentes)
export const BREAKPOINTS = {
  MOBILE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1279,
  DESKTOP_MIN: 1280,
} as const;

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.MOBILE_MAX}px)`,
  tablet: `(min-width: ${BREAKPOINTS.TABLET_MIN}px) and (max-width: ${BREAKPOINTS.TABLET_MAX}px)`,
  desktop: `(min-width: ${BREAKPOINTS.DESKTOP_MIN}px)`,
} as const;

interface DeviceDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  orientation: 'portrait' | 'landscape';
}

export const useMobileDetect = (): DeviceDetection => {
  const [deviceState, setDeviceState] = useState<DeviceDetection>(() => {
    // Initial state basado en window.innerWidth (SSR safe)
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1280,
        orientation: 'landscape',
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      isMobile: width <= BREAKPOINTS.MOBILE_MAX,
      isTablet: width >= BREAKPOINTS.TABLET_MIN && width <= BREAKPOINTS.TABLET_MAX,
      isDesktop: width >= BREAKPOINTS.DESKTOP_MIN,
      width,
      orientation: width > height ? 'landscape' : 'portrait',
    };
  });

  useEffect(() => {
    // Usar matchMedia para mejor performance y precisión
    const mobileQuery = window.matchMedia(MEDIA_QUERIES.mobile);
    const tabletQuery = window.matchMedia(MEDIA_QUERIES.tablet);
    const desktopQuery = window.matchMedia(MEDIA_QUERIES.desktop);

    const updateDeviceState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDeviceState({
        isMobile: mobileQuery.matches,
        isTablet: tabletQuery.matches,
        isDesktop: desktopQuery.matches,
        width,
        orientation: width > height ? 'landscape' : 'portrait',
      });
    };

    // Listeners para cambios en media queries
    mobileQuery.addEventListener('change', updateDeviceState);
    tabletQuery.addEventListener('change', updateDeviceState);
    desktopQuery.addEventListener('change', updateDeviceState);

    // Listener para rotación de pantalla (importante en tablets/móviles)
    window.addEventListener('orientationchange', updateDeviceState);
    
    // Listener de resize como fallback
    window.addEventListener('resize', updateDeviceState);

    // Cleanup
    return () => {
      mobileQuery.removeEventListener('change', updateDeviceState);
      tabletQuery.removeEventListener('change', updateDeviceState);
      desktopQuery.removeEventListener('change', updateDeviceState);
      window.removeEventListener('orientationchange', updateDeviceState);
      window.removeEventListener('resize', updateDeviceState);
    };
  }, []);

  return deviceState;
};

import { useState, useEffect, useCallback } from 'react';
import { useMobileDetect } from './useMobileDetect';
import { useLocation } from 'react-router-dom';

/**
 * Hook para gestionar estado del sidebar según dispositivo
 * 
 * Comportamiento:
 * - Mobile: Sidebar overlay, cerrado por defecto, auto-cierra al navegar
 * - Tablet: Sidebar rail (colapsado), siempre visible
 * - Desktop: Sidebar completo, siempre visible
 */

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  isOverlay: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

export const useSidebar = (): SidebarState => {
  const { isMobile, isTablet, isDesktop } = useMobileDetect();
  const location = useLocation();
  
  // Estado del sidebar
  const [isOpen, setIsOpen] = useState(!isMobile);

  // Determinar modo según dispositivo
  const isOverlay = isMobile; // Solo overlay en mobile
  const isCollapsed = isTablet; // Rail colapsado en tablet

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Cerrar sidebar
  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Abrir sidebar
  const openSidebar = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Auto-cerrar en mobile al cambiar de ruta
  useEffect(() => {
    if (isMobile && isOpen) {
      closeSidebar();
    }
  }, [location.pathname, isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ajustar estado al cambiar dispositivo
  useEffect(() => {
    if (isDesktop) {
      // Desktop: siempre abierto
      setIsOpen(true);
    } else if (isTablet) {
      // Tablet: siempre visible (rail)
      setIsOpen(true);
    } else if (isMobile) {
      // Mobile: cerrado por defecto
      setIsOpen(false);
    }
  }, [isMobile, isTablet, isDesktop]);

  return {
    isOpen,
    isCollapsed,
    isOverlay,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };
};

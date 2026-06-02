import { useState, useEffect, useCallback } from 'react';
import { useMobileDetect } from './useMobileDetect';
import { useLocation } from 'react-router-dom';

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

  const [isOpen, setIsOpen] = useState(!isMobile);
  // Desktop arranca en rail (colapsado); hamburger lo expande
  const [desktopCollapsed, setDesktopCollapsed] = useState(true);

  const isOverlay = isMobile;
  // Colapsado en tablet (siempre) o en desktop cuando el usuario lo eligió
  const isCollapsed = isTablet || (isDesktop && desktopCollapsed);

  const toggleSidebar = useCallback(() => {
    if (isDesktop) {
      setDesktopCollapsed(prev => !prev);
    } else {
      setIsOpen(prev => !prev);
    }
  }, [isDesktop]);

  // En desktop vuelve a rail; en mobile cierra el overlay
  const closeSidebar = useCallback(() => {
    if (isDesktop) {
      setDesktopCollapsed(true);
    } else {
      setIsOpen(false);
    }
  }, [isDesktop]);

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
    if (isDesktop || isTablet) {
      setIsOpen(true);
    } else if (isMobile) {
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

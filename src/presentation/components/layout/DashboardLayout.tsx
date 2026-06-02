import { ReactNode, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from '../mobile/MobileBottomNav';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useMobileDetect, useSidebar } from '@/presentation/hooks';
import { responsiveClasses } from '@/shared/utils/responsive';
import { cn } from '@/shared/utils';
import { useBookingRequestStore } from '@/presentation/context/BookingRequestStore';
import { bookingRequestRepository } from '@/core/infrastructure/repositories/BookingRequestRepository';

export interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const { isMobile, isTablet, isDesktop } = useMobileDetect();
  const { isOpen, isCollapsed, isOverlay, toggleSidebar, closeSidebar } = useSidebar();
  const { stats, setRequests } = useBookingRequestStore();

  useEffect(() => {
    if (!user) return;
    bookingRequestRepository.getAll().then(setRequests).catch(() => {});
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* ========================================
          HEADER DESKTOP - Oculto en mobile/tablet
          ======================================== */}
      {isDesktop && (
        <Header
          user={
            user
              ? {
                  name: user.displayName,
                  email: user.email,
                  photoURL: user.photoURL,
                  role: user.role,
                }
              : undefined
          }
          notifications={stats.pending}
          onMenuToggle={toggleSidebar}
        />
      )}

      {/* ========================================
          HEADER MOBILE - Solo en mobile
          ======================================== */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-16 bg-dark-900 border-b border-dark-700 flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-white">SUNANDA</h1>
              <p className="text-xs text-gold-400">Estética y Spa</p>
            </div>
          </div>

          {/* Hamburger - Solo muestra cuando el sidebar está cerrado en overlay mode */}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </header>
      )}

      {/* ========================================
          OVERLAY OSCURO - Solo cuando sidebar overlay está abierto
          ======================================== */}
      {isOverlay && isOpen && (
        <div
          className={cn(
            responsiveClasses.overlay(isOpen),
            'mt-16' // Offset para header mobile
          )}
          onClick={closeSidebar}
          aria-label="Cerrar menú"
        />
      )}

      <div className="flex">
        {/* ========================================
            SIDEBAR - Responsive en 3 modos
            ======================================== */}
        <aside
          className={cn(
            // Base styles
            'fixed bg-dark-900 border-r border-dark-700 z-50',
            responsiveClasses.transition,

            // Altura: mobile = viewport - header (4rem) - bottom nav (4rem)
            isMobile ? 'h-[calc(100vh-8rem)]' : 'h-full',

            // Posicionamiento según modo
            isMobile && 'top-16', // Offset para header mobile
            (isTablet || isDesktop) && 'top-0',
            
            // Ancho según estado
            responsiveClasses.sidebarWidth(isCollapsed && !isMobile),
            isMobile && 'w-80', // Mobile siempre 320px cuando abierto
            
            // Transform para overlay mobile
            isOverlay && responsiveClasses.sidebarTransform(isOpen, isOverlay),
            
            // Shadows según modo
            isOverlay && responsiveClasses.sidebar.overlay,
            isCollapsed && !isOverlay && responsiveClasses.sidebar.rail,
            !isCollapsed && !isOverlay && responsiveClasses.sidebar.desktop
          )}
        >
          <Sidebar
            isOpen={isOpen}
            isCollapsed={isCollapsed}
            userRole={user?.role}
            onNavigate={isOverlay ? closeSidebar : undefined}
          />
        </aside>

        {/* ========================================
            MAIN CONTENT - Ajuste dinámico según sidebar
            ======================================== */}
        <main
          className={cn(
            'flex-1',
            responsiveClasses.transition,
            
            // Padding top para header
            isDesktop && 'pt-16',
            (isMobile || isTablet) && 'pt-16',
            
            // Padding bottom para bottom nav mobile
            responsiveClasses.contentPadding(isMobile),
            
            // Margin left según estado del sidebar
            // Desktop: expandido (256px) o rail (64px) — siempre visible
            isDesktop && !isCollapsed && 'ml-64',
            isDesktop && isCollapsed && 'ml-16',

            // Tablet: sidebar rail siempre visible (64px)
            isTablet && 'ml-16',
            
            // Mobile: sin margin (sidebar overlay)
            isMobile && 'ml-0',
            
            // Full width en mobile
            isMobile && 'w-full'
          )}
        >
          <div
            className={cn(
              'mx-auto',
              // Desktop/Tablet: container con padding generoso
              (isDesktop || isTablet) && 'container p-4 md:p-6 lg:p-8',
              // Mobile: full width con padding menor
              isMobile && 'p-4'
            )}
          >
            {children}
          </div>
        </main>
      </div>

      {/* ========================================
          BOTTOM NAVIGATION - Solo en mobile
          ======================================== */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}

import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/shared/utils';
import { useAuth } from '@/presentation/hooks/useAuth';
import { ROUTES } from '@/shared/constants';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  UserCog,
  BellRing,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  roles?: string[];
  disabled?: boolean;
  comingSoon?: boolean;
}

export interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean; // ← NUEVO: Modo rail (tablet)
  userRole?: string;
  children?: ReactNode;
  onNavigate?: () => void;
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Clientes',
    href: '/dashboard/clients',
    icon: Users,
  },
  {
    label: 'Agenda',
    href: '/dashboard/appointments',
    icon: Calendar,
  },
  {
    label: 'Solicitudes',
    href: '/dashboard/booking-requests',
    icon: BellRing,
  },
  {
    label: 'Servicios',
    href: '/dashboard/services',
    icon: ClipboardList,
  },
  {
    label: 'Expedientes',
    href: '/dashboard/records',
    icon: FileText,
  },
  {
    label: 'Inventario',
    href: '/dashboard/inventory',
    icon: Package,
  },
  {
    label: 'Pagos',
    href: '/dashboard/payments',
    icon: CreditCard,
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    label: 'Reportes',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    disabled: true,
    comingSoon: true,
  },
  {
    label: 'Usuarios',
    href: '/dashboard/users',
    icon: UserCog,
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Configuración',
    href: '/dashboard/settings',
    icon: Settings,
    disabled: true,
    comingSoon: true,
  },
];

export function Sidebar({ isOpen = true, isCollapsed = false, userRole, onNavigate }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const filteredItems = navigationItems.filter((item) => {
    if (!item.roles) return true;
    return userRole && item.roles.includes(userRole);
  });

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada correctamente');
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error('Error al cerrar sesión');
    }
  };

  // Determinar si mostrar labels (no mostrar en modo rail colapsado)
  const showLabels = isOpen && !isCollapsed;

  return (
    <nav className={cn(
      'h-full flex flex-col p-4',
      isCollapsed ? 'overflow-x-hidden scrollbar-hide' : 'custom-scrollbar',
    )}>
      {/* Nav items */}
      <div className={cn(
        'flex-1 overflow-y-auto space-y-2',
        isCollapsed && 'snap-y snap-mandatory overflow-x-hidden'
      )}>
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        const content = (
          <motion.div
            whileHover={item.disabled ? {} : {
              x: isCollapsed ? 0 : 4,
              scale: isCollapsed ? 1.05 : 1
            }}
            whileTap={item.disabled ? {} : { scale: 0.95 }}
            className={cn(
              'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
              item.disabled
                ? 'text-gray-400 dark:text-dark-500 cursor-not-allowed opacity-60'
                : isActive
                  ? 'bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700',
              isCollapsed && 'justify-center',
              isCollapsed && 'px-2 py-3'
            )}
          >
              {/* Indicador activo - Diferentes estilos según modo */}
              {isActive && (
                <>
                  {/* Modo normal: barra izquierda */}
                  {!isCollapsed && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500 rounded-r"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Modo rail: dot derecha */}
                  {isCollapsed && (
                    <motion.div
                      layoutId="activeNavRail"
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gold-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}

              {/* Icon con badge integrado en rail */}
              <div className="relative">
                <Icon 
                  className={cn(
                    'flex-shrink-0 transition-all duration-200',
                    isCollapsed ? 'w-6 h-6' : 'w-5 h-5',
                    isActive && 'text-gold-600 dark:text-gold-400'
                  )} 
                />
                
                {/* Badge mini en modo rail (solo active) */}
                {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-dark-900 flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold leading-none">
                      {item.badge > 9 ? '9' : item.badge}
                    </span>
                  </span>
                )}
              </div>

              {/* Label - oculto en modo colapsado */}
              {showLabels && (
                <span className="font-medium text-sm">
                  {item.label}
                </span>
              )}

              {/* Badge numérico completo - solo en modo expandido */}
              {showLabels && item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-gold-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}

              {/* Badge "Próximamente" - solo en modo expandido */}
              {showLabels && item.comingSoon && (
                <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-dark-600 text-dark-400 border border-dark-500">
                  Próximo
                </span>
              )}

              {/* Tooltip para sidebar colapsado */}
              {isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-full ml-3 px-4 py-2.5 bg-dark-900 dark:bg-dark-700 text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-dark-600"
                >
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-dark-900 dark:border-r-dark-700" />
                  <div className="flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.comingSoon && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-dark-600 text-dark-400 border border-dark-500">
                        Próximo
                      </span>
                    )}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <div className="mt-1 pt-1 border-t border-dark-600 text-xs text-gray-400">
                      Actual
                    </div>
                  )}
                </motion.div>
              )}
          </motion.div>
        );

        if (item.disabled) {
          return (
            <div key={item.href} className={cn(isCollapsed && 'snap-start')}>
              {content}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={handleNavClick}
            className={cn(isCollapsed && 'snap-start')}
          >
            {content}
          </Link>
        );
      })}
      </div>

      {/* Logout button - pinned to bottom */}
      <div className="border-t border-dark-700 pt-3 mt-3">
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: isCollapsed ? 0 : 4, scale: isCollapsed ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
            'text-red-400 hover:bg-red-500/10',
            isCollapsed && 'justify-center px-2 py-3'
          )}
        >
          <LogOut className={cn('flex-shrink-0', isCollapsed ? 'w-6 h-6' : 'w-5 h-5')} />

          {showLabels && (
            <span className="font-medium text-sm">Cerrar Sesión</span>
          )}

          {/* Tooltip en modo rail */}
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-full ml-3 px-4 py-2.5 bg-dark-900 dark:bg-dark-700 text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-dark-600"
            >
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-dark-900 dark:border-r-dark-700" />
              Cerrar Sesión
            </motion.div>
          )}
        </motion.button>
      </div>
    </nav>
  );
}

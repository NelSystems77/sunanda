import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList,
  FileText,
  Menu,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useSidebar } from '@/presentation/hooks';
import { cn } from '@/shared/utils';

/**
 * Navegación inferior para dispositivos móviles
 * Muestra 4 items principales + botón "Más" según rol del usuario
 * 
 * Roles:
 * - Admin: Dashboard, Clientes, Agenda, Servicios + Más (5 secundarios)
 * - Recepcionista: Agenda, Clientes, Servicios, Dashboard + Más (2 secundarios)
 * - Esteticista: Agenda, Clientes, Expedientes, Servicios + Más (1 secundario)
 */

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
  color: string;
}

interface NavItemsByRole {
  [key: string]: NavItem[];
}

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();

  // Configuración de items por rol (4 principales)
  const navItemsByRole: NavItemsByRole = {
    SUPER_ADMIN: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/dashboard',
        color: 'from-gold-500 to-gold-600'
      },
      {
        icon: Users,
        label: 'Clientes',
        path: '/dashboard/clients',
        color: 'from-blue-500 to-blue-600'
      },
      {
        icon: Calendar,
        label: 'Agenda',
        path: '/dashboard/appointments',
        badge: 3, // Ejemplo: 3 citas pendientes
        color: 'from-green-500 to-green-600'
      },
      {
        icon: ClipboardList,
        label: 'Servicios',
        path: '/dashboard/services',
        color: 'from-purple-500 to-purple-600'
      }
    ],
    ADMIN: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/dashboard',
        color: 'from-gold-500 to-gold-600'
      },
      {
        icon: Users,
        label: 'Clientes',
        path: '/dashboard/clients',
        color: 'from-blue-500 to-blue-600'
      },
      {
        icon: Calendar,
        label: 'Agenda',
        path: '/dashboard/appointments',
        badge: 3,
        color: 'from-green-500 to-green-600'
      },
      {
        icon: ClipboardList,
        label: 'Servicios',
        path: '/dashboard/services',
        color: 'from-purple-500 to-purple-600'
      }
    ],
    RECEPCIONISTA: [
      {
        icon: Calendar,
        label: 'Agenda',
        path: '/dashboard/appointments',
        badge: 5, // Recepcionista ve más citas
        color: 'from-green-500 to-green-600'
      },
      {
        icon: Users,
        label: 'Clientes',
        path: '/dashboard/clients',
        color: 'from-blue-500 to-blue-600'
      },
      {
        icon: ClipboardList,
        label: 'Servicios',
        path: '/dashboard/services',
        color: 'from-purple-500 to-purple-600'
      },
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/dashboard',
        color: 'from-gold-500 to-gold-600'
      }
    ],
    ESTETICISTA: [
      {
        icon: Calendar,
        label: 'Agenda',
        path: '/dashboard/appointments',
        badge: 2,
        color: 'from-green-500 to-green-600'
      },
      {
        icon: Users,
        label: 'Clientes',
        path: '/dashboard/clients',
        color: 'from-blue-500 to-blue-600'
      },
      {
        icon: FileText,
        label: 'Expedientes',
        path: '/dashboard/records',
        color: 'from-orange-500 to-orange-600'
      },
      {
        icon: ClipboardList,
        label: 'Servicios',
        path: '/dashboard/services',
        color: 'from-purple-500 to-purple-600'
      }
    ]
  };

  // Obtener items según rol (fallback a ADMIN si no hay rol)
  const userRole = user?.role || 'ADMIN';
  const navItems = navItemsByRole[userRole] || navItemsByRole.ADMIN;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-700 z-50 safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        {/* 4 Items principales */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 transition-all duration-200',
                'active:scale-95',
                // Min tap target 48px (iOS guidelines)
                'min-h-[48px]',
                active
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              )}
            >
              {/* Active indicator - Gradiente superior */}
              {active && (
                <div className={cn(
                  'absolute top-0 left-0 right-0 h-1 rounded-b-full',
                  `bg-gradient-to-r ${item.color}`
                )} />
              )}

              {/* Icon con badge */}
              <div className="relative">
                <Icon 
                  className={cn(
                    'transition-all duration-200',
                    active ? 'w-6 h-6' : 'w-5 h-5'
                  )} 
                />
                
                {/* Badge de notificaciones */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span 
                className={cn(
                  'text-[10px] font-medium transition-all duration-200',
                  active ? 'font-semibold' : 'font-normal'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Botón "Más" - Abre sidebar overlay */}
        <button
          onClick={toggleSidebar}
          className={cn(
            'relative flex flex-col items-center justify-center gap-0.5 transition-all duration-200',
            'text-gray-400 hover:text-gray-200 active:scale-95',
            'min-h-[48px]'
          )}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium">Más</span>
          
          {/* Indicador de opciones disponibles */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-gold-500 rounded-full opacity-60" />
        </button>
      </div>
    </nav>
  );
};

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Bell, LogOut, User as UserIcon, Settings, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAuth } from '@/presentation/hooks/useAuth';
import { cn } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';

export interface HeaderProps {
  user?: {
    name: string;
    email: string;
    photoURL?: string;
    role: string;
  };
  notifications?: number;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onMenuToggle?: (isOpen: boolean) => void;
}

export function Header({
  user,
  notifications = 0,
  onNotificationClick,
  onProfileClick,
  onMenuToggle,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('common');

  // Detectar si estamos en una ruta pública o admin
  const isPublicRoute = ['/', '/services', '/booking'].includes(location.pathname);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada correctamente');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-700 bg-dark-900/95 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="sm" />
          </Link>

          {/* Public Navigation (Desktop) */}
          {isPublicRoute && (
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={location.pathname === '/' ? 'bg-dark-800' : ''}
                >
                  {t('navigation.home')}
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  variant="ghost"
                  size="sm"
                  className={location.pathname === '/services' ? 'bg-dark-800' : ''}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t('navigation.services')}
                </Button>
              </Link>
              <Link to="/booking">
                <Button
                  variant="primary"
                  size="sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('navigation.bookNow')}
                </Button>
              </Link>
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Toggle (always visible) */}
            <LanguageToggle />

            {/* Notifications (only for logged users) */}
            {user && (
              <button
                onClick={onNotificationClick}
                className="relative p-2 rounded-lg hover:bg-dark-800 transition-colors"
              >
                <Bell className="w-5 h-5 text-dark-400" />
                {notifications > 0 && (
                  <Badge
                    variant="danger"
                    size="sm"
                    className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center"
                  >
                    {notifications > 99 ? '99+' : notifications}
                  </Badge>
                )}
              </button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile or Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-800 transition-colors"
                >
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-dark-400">{user.role}</p>
                  </div>
                  <Avatar src={user.photoURL} name={user.name} size="sm" showStatus status="online" />
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-dark-800 rounded-lg shadow-lg border border-dark-700 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-dark-700">
                          <p className="text-sm font-medium text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-dark-400 truncate">
                            {user.email}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onProfileClick?.();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-dark-300 hover:bg-dark-700 transition-colors"
                        >
                          <UserIcon className="w-4 h-4" />
                          Mi Perfil
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate(ROUTES.SETTINGS);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-dark-300 hover:bg-dark-700 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Configuración
                        </button>

                        <div className="border-t border-dark-700 my-2" />

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-dark-700 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar Sesión
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : isPublicRoute && (
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">
                  <UserIcon className="h-4 w-4 mr-2" />
                  {t('navigation.login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-dark-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-dark-400" />
            ) : (
              <Menu className="w-6 h-6 text-dark-400" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-dark-700"
            >
              <div className="py-4 space-y-4">
                {/* Public Navigation (Mobile) */}
                {isPublicRoute && (
                  <div className="space-y-2">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn('w-full justify-start', location.pathname === '/' && 'bg-dark-800')}
                      >
                        {t('navigation.home')}
                      </Button>
                    </Link>
                    <Link to="/services" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn('w-full justify-start', location.pathname === '/services' && 'bg-dark-800')}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {t('navigation.services')}
                      </Button>
                    </Link>
                    <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {t('navigation.bookNow')}
                      </Button>
                    </Link>
                    <div className="border-t border-dark-700 my-2" />
                  </div>
                )}

                {user && (
                  <div className="flex items-center gap-3 px-2">
                    <Avatar src={user.photoURL} name={user.name} size="md" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-dark-400">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between px-2">
                  <span className="text-sm text-dark-400">Idioma</span>
                  <LanguageToggle />
                </div>

                <div className="flex items-center justify-between px-2">
                  <span className="text-sm text-dark-400">Tema</span>
                  <ThemeToggle />
                </div>

                {user && (
                  <button
                    onClick={onNotificationClick}
                    className={cn(
                      'w-full flex items-center justify-between px-2 py-2 rounded-lg',
                      'hover:bg-dark-800 transition-colors'
                    )}
                  >
                    <span className="text-sm text-dark-400">
                      Notificaciones
                    </span>
                    {notifications > 0 && (
                      <Badge variant="danger" size="sm">
                        {notifications > 99 ? '99+' : notifications}
                      </Badge>
                    )}
                  </button>
                )}

                {user ? (
                  <>
                    <div className="border-t border-dark-700 my-2" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2 py-2 text-red-400 hover:bg-dark-800 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Cerrar Sesión</span>
                    </button>
                  </>
                ) : isPublicRoute && (
                  <Link to={ROUTES.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <UserIcon className="h-4 w-4 mr-2" />
                      {t('navigation.login')}
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/presentation/context/AuthStore';
import { Logo } from '@/presentation/components/layout/Logo';
import { Input } from '@/presentation/components/ui/Input';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { ROUTES } from '@/shared/constants';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast.success('¡Bienvenido/a!');
      navigate(from, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Helmet>
      <title>Iniciar Sesión - SUNANDA Spa</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gold-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h2 className="text-2xl font-serif font-bold text-dark-900 dark:text-white mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('email')}
              type="email"
              label="Correo Electrónico"
              placeholder="tu@email.com"
              error={errors.email?.message}
              leftIcon={<Mail className="w-5 h-5" />}
              disabled={isLoading}
              autoComplete="email"
              fullWidth
            />

            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="••••••••"
              error={errors.password?.message}
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
              disabled={isLoading}
              autoComplete="current-password"
              fullWidth
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-gray-600 dark:text-gray-400">Recordarme</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-gold-600 dark:text-gold-400 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              size="lg"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes una cuenta?{' '}
            <Link
              to="/"
              className="text-gold-600 dark:text-gold-400 font-semibold hover:underline"
            >
              Contacta al administrador
            </Link>
          </div>
        </Card>

        {/* Credenciales de prueba */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
             Sistema de Gestion de Estetica y Spa
          </p>
          <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
            <p>
              <strong>Disfrutarás de</strong> Control total de pacientes, ingresos, agendas.
            </p>
            <p className="text-blue-600 dark:text-blue-500 italic">
              Dev By NelSystems
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
}

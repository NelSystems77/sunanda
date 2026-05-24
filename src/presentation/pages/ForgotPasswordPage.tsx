import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthService } from '@/core/infrastructure/firebase/AuthService';
import { Logo } from '@/presentation/components/layout/Logo';
import { Input } from '@/presentation/components/ui/Input';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { ROUTES } from '@/shared/constants';

const schema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await AuthService.resetPassword(data.email);
      setSent(true);
    } catch {
      toast.error('No se pudo enviar el correo. Verifica que el email esté registrado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            Recuperar Contraseña
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Te enviamos un enlace para restablecer tu contraseña
          </p>
        </div>

        <Card padding="lg">
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                Correo enviado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Revisá tu bandeja de entrada en{' '}
                <span className="font-medium text-gold-600 dark:text-gold-400">
                  {getValues('email')}
                </span>
                {' '}y seguí el enlace para crear una nueva contraseña.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Si no lo ves, revisá la carpeta de spam.
              </p>
            </div>
          ) : (
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
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                size="lg"
              >
                Enviar enlace de recuperación
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 text-sm text-gold-600 dark:text-gold-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

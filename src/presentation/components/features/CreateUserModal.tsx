import { useState } from 'react';
import { X, User, Mail, Lock, Phone } from 'lucide-react';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '@/core/infrastructure/firebase/config';
import { userService } from '@/core/infrastructure/services/UserService';
import { UserRole, getManageableRoles, getRoleLabel } from '@/core/domain/enums/roles';
import { Button } from '../ui/Button';
import { useAuth } from '@/presentation/hooks/useAuth';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateUserModal({ onClose, onSuccess }: Props) {
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: UserRole.ESTETICISTA,
  });

  const availableRoles = currentUser?.role
    ? getManageableRoles(currentUser.role as UserRole)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.displayName || !form.email || !form.password || !form.role) {
      toast.error('Completá todos los campos obligatorios');
      return;
    }
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    // Instancia secundaria para no cerrar la sesión del admin actual
    const secondaryApp = initializeApp(firebaseConfig, `create-user-${Date.now()}`);
    const secondaryAuth = getAuth(secondaryApp);

    try {
      const credential = await createUserWithEmailAndPassword(
        secondaryAuth,
        form.email,
        form.password
      );

      await userService.create(credential.user.uid, {
        email: form.email,
        displayName: form.displayName,
        role: form.role,
        phoneNumber: form.phoneNumber || undefined,
        isActive: true,
      });

      toast.success(`Usuario ${form.displayName} creado correctamente`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg: Record<string, string> = {
        'auth/email-already-in-use': 'Ese correo ya está registrado en el sistema',
        'auth/invalid-email': 'Correo electrónico inválido',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      };
      toast.error(msg[err.code] || 'Error al crear el usuario');
    } finally {
      await deleteApp(secondaryApp);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-700 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white">Nuevo Usuario</h2>
          <button
            onClick={onClose}
            className="p-1 text-dark-400 hover:text-white hover:bg-dark-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">
              Nombre completo <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                name="displayName"
                type="text"
                value={form.displayName}
                onChange={handleChange}
                placeholder="Ej: Grettel Morales"
                required
                className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">
              Correo electrónico <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
                className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-500"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">
              Contraseña <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="mínimo 6 caracteres"
                required
                className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-500"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+506 8888-8888"
                className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-500"
              />
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">
              Rol <span className="text-red-400">*</span>
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-dark-900 border border-dark-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              {availableRoles.map(role => (
                <option key={role} value={role}>
                  {getRoleLabel(role)}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Crear Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Client } from '@/core/domain/interfaces/Client';
import { Gender } from '@/core/domain/enums';

const clientSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phoneNumber: z.string().min(8, 'Número de teléfono inválido'),
  dateOfBirth: z.string().min(1, 'Fecha de nacimiento requerida'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  skinType: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export interface ClientFormProps {
  client?: Client;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClientForm({ client, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? {
          ...client,
          dateOfBirth: client.dateOfBirth.toISOString().split('T')[0],
          allergies: client.allergies?.join(', '),
          medications: client.medications?.join(', '),
        }
      : {
          gender: 'FEMALE',
          country: 'Costa Rica',
        },
  });

  const handleFormSubmit = async (data: ClientFormData) => {
    const formattedData = {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
      allergies: data.allergies ? data.allergies.split(',').map((a) => a.trim()) : [],
      medications: data.medications ? data.medications.split(',').map((m) => m.trim()) : [],
    };

    await onSubmit(formattedData);
  };

  const genderOptions = [
    { value: Gender.FEMALE, label: 'Femenino' },
    { value: Gender.MALE, label: 'Masculino' },
    { value: Gender.OTHER, label: 'Otro' },
  ];

  const skinTypeOptions = [
    { value: '', label: 'Seleccionar...' },
    { value: 'Normal', label: 'Normal' },
    { value: 'Seca', label: 'Seca' },
    { value: 'Grasa', label: 'Grasa' },
    { value: 'Mixta', label: 'Mixta' },
    { value: 'Sensible', label: 'Sensible' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Información Personal */}
      <div>
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
          Información Personal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('firstName')}
            label="Nombre"
            placeholder="María"
            error={errors.firstName?.message}
            disabled={isLoading}
            required
            fullWidth
          />

          <Input
            {...register('lastName')}
            label="Apellido"
            placeholder="González"
            error={errors.lastName?.message}
            disabled={isLoading}
            required
            fullWidth
          />

          <Input
            {...register('email')}
            type="email"
            label="Correo Electrónico"
            placeholder="maria@email.com"
            error={errors.email?.message}
            disabled={isLoading}
            required
            fullWidth
          />

          <Input
            {...register('phoneNumber')}
            label="Teléfono"
            placeholder="8888-8888"
            error={errors.phoneNumber?.message}
            disabled={isLoading}
            required
            fullWidth
          />

          <Input
            {...register('dateOfBirth')}
            type="date"
            label="Fecha de Nacimiento"
            error={errors.dateOfBirth?.message}
            disabled={isLoading}
            required
            fullWidth
          />

          <Select
            {...register('gender')}
            label="Género"
            options={genderOptions}
            error={errors.gender?.message}
            disabled={isLoading}
            required
            fullWidth
          />
        </div>
      </div>

      {/* Dirección */}
      <div>
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
          Dirección
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('address')}
            label="Dirección"
            placeholder="Calle Principal, Casa 123"
            error={errors.address?.message}
            disabled={isLoading}
            fullWidth
            className="md:col-span-2"
          />

          <Input
            {...register('city')}
            label="Ciudad"
            placeholder="San José"
            error={errors.city?.message}
            disabled={isLoading}
            fullWidth
          />

          <Input
            {...register('country')}
            label="País"
            placeholder="Costa Rica"
            error={errors.country?.message}
            disabled={isLoading}
            fullWidth
          />
        </div>
      </div>

      {/* Información Médica */}
      <div>
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
          Información Médica
        </h3>
        <div className="space-y-4">
          <Select
            {...register('skinType')}
            label="Tipo de Piel"
            options={skinTypeOptions}
            error={errors.skinType?.message}
            disabled={isLoading}
            fullWidth
          />

          <Textarea
            {...register('medicalHistory')}
            label="Historial Médico"
            placeholder="Enfermedades, cirugías previas, condiciones relevantes..."
            error={errors.medicalHistory?.message}
            disabled={isLoading}
            fullWidth
          />

          <Input
            {...register('allergies')}
            label="Alergias"
            placeholder="Separadas por comas (ej: polen, frutos secos)"
            error={errors.allergies?.message}
            disabled={isLoading}
            fullWidth
          />

          <Input
            {...register('medications')}
            label="Medicamentos"
            placeholder="Separados por comas"
            error={errors.medications?.message}
            disabled={isLoading}
            fullWidth
          />

          <Textarea
            {...register('notes')}
            label="Notas Adicionales"
            placeholder="Cualquier información adicional relevante..."
            error={errors.notes?.message}
            disabled={isLoading}
            fullWidth
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-dark-700">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {client ? 'Actualizar' : 'Crear'} Cliente
        </Button>
      </div>
    </form>
  );
}

import { AuthService } from '@/core/infrastructure/firebase/AuthService';
import { UserRepository } from '@/core/infrastructure/repositories/UserRepository';
import { User, CreateUserDTO } from '@/core/domain/interfaces/User';
import { UserRole } from '@/core/domain/enums/roles';

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  specialties?: string[];
  bio?: string;
}

export class RegisterUseCase {
  private userRepository = new UserRepository();

  async execute(input: RegisterInput): Promise<User> {
    // 1. Verificar que el email no exista
    const emailExists = await this.userRepository.emailExists(input.email);
    if (emailExists) {
      throw new Error('Este correo ya está registrado');
    }

    // 2. Crear usuario en Firebase Auth
    const firebaseUser = await AuthService.register({
      email: input.email,
      password: input.password,
      displayName: input.displayName,
    });

    try {
      // 3. Crear documento del usuario en Firestore
      const userDTO: CreateUserDTO = {
        email: input.email,
        password: input.password,
        displayName: input.displayName,
        role: input.role,
        phoneNumber: input.phoneNumber,
        specialties: input.specialties,
        bio: input.bio,
      };

      const user = await this.userRepository.create(firebaseUser.uid, userDTO);

      return user;
    } catch (error) {
      // Si falla la creación en Firestore, eliminar usuario de Auth
      // Nota: Esto requeriría Firebase Admin SDK en producción
      console.error('Error creating user in Firestore:', error);
      throw new Error('Error al crear el usuario. Por favor, intenta nuevamente.');
    }
  }
}

import { AuthService } from '@/core/infrastructure/firebase/AuthService';
import { UserRepository } from '@/core/infrastructure/repositories/UserRepository';
import { User } from '@/core/domain/interfaces/User';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: User;
  token: string;
}

export class LoginUseCase {
  private userRepository = new UserRepository();

  async execute(input: LoginInput): Promise<LoginOutput> {
    // 1. Autenticar con Firebase
    const firebaseUser = await AuthService.login(input);

    // 2. Obtener datos del usuario de Firestore
    let user = await this.userRepository.getById(firebaseUser.uid);

    if (!user) {
      throw new Error('Usuario no encontrado en la base de datos');
    }

    // 3. Verificar que el usuario esté activo
    if (!user.isActive) {
      await AuthService.logout();
      throw new Error('Esta cuenta ha sido desactivada. Contacta al administrador.');
    }

    // 4. Actualizar último login
    await this.userRepository.updateLastLogin(user.id);

    // 5. Obtener token
    const token = await AuthService.getCurrentUserToken();

    if (!token) {
      throw new Error('Error al obtener token de autenticación');
    }

    return {
      user,
      token,
    };
  }
}

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth';
import { auth } from '../firebase/config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

export class AuthService {
  /**
   * Iniciar sesión con email y contraseña
   */
  static async login(credentials: LoginCredentials): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      return userCredential.user;
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Registrar nuevo usuario
   */
  static async register(data: RegisterData): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Actualizar perfil con nombre
      await updateProfile(userCredential.user, {
        displayName: data.displayName,
      });

      return userCredential.user;
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Enviar email de recuperación de contraseña
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Actualizar perfil del usuario
   */
  static async updateUserProfile(data: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      await updateProfile(auth.currentUser, data);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Cambiar contraseña
   */
  static async changePassword(newPassword: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Obtener usuario actual
   */
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Obtener token del usuario actual
   */
  static async getCurrentUserToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  }

  /**
   * Manejar errores de Firebase Auth
   */
  private static handleAuthError(error: AuthError): Error {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/requires-recent-login': 'Por seguridad, vuelve a iniciar sesión',
    };

    const message = errorMessages[error.code] || 'Error de autenticación';
    return new Error(message);
  }
}

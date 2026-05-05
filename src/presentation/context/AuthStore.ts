import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/core/domain/interfaces/User';
import { LoginUseCase } from '@/core/application/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '@/core/application/use-cases/auth/LogoutUseCase';
import { UserRepository } from '@/core/infrastructure/repositories/UserRepository';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/core/infrastructure/firebase/config';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initialize: () => void;
}

const loginUseCase = new LoginUseCase();
const logoutUseCase = new LogoutUseCase();
const userRepository = new UserRepository();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const result = await loginUseCase.execute({ email, password });

          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await logoutUseCase.execute();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error al cerrar sesión';
          set({ error: message });
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      initialize: () => {
        // CRITICAL: Si hay sesión persistida, marcar como autenticado INMEDIATAMENTE
        const currentState = get();
        if (currentState.user && currentState.isAuthenticated) {
          console.log('✅ Sesión persistida encontrada:', currentState.user.email);
          set({ isLoading: false });
        }

        // Escuchar cambios de Firebase en segundo plano
        onAuthStateChanged(auth, async (firebaseUser) => {
          console.log('🔥 Firebase Auth State Changed:', firebaseUser?.email || 'null');
          
          if (firebaseUser) {
            try {
              const user = await userRepository.getById(firebaseUser.uid);
              
              if (user && user.isActive) {
                const token = await firebaseUser.getIdToken();
                console.log('✅ Usuario cargado desde Firebase:', user.email);
                set({
                  user,
                  token,
                  isAuthenticated: true,
                  isLoading: false,
                });
              } else {
                console.warn('⚠️ Usuario inactivo o no encontrado');
                await logoutUseCase.execute();
                set({
                  user: null,
                  token: null,
                  isAuthenticated: false,
                  isLoading: false,
                });
              }
            } catch (error) {
              console.error('❌ Error cargando usuario:', error);
              // NO limpiar store en error temporal
              set({ isLoading: false });
            }
          } else {
            // Solo limpiar si NO hay sesión persistida local
            const persistedState = get();
            if (!persistedState.user) {
              console.log('🚫 No hay usuario en Firebase ni en localStorage');
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
              });
            } else {
              console.log('💾 Manteniendo sesión local mientras Firebase sincroniza');
              set({ isLoading: false });
            }
          }
        });
      },
    }),
    {
      name: 'sunanda-auth',
      // CRITICAL: Persistir TODO el state necesario
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

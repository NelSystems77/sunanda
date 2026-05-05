import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark', // ← CAMBIADO: Ahora el tema por defecto es OSCURO
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          // Aplicar al DOM
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: newTheme };
        }),
      setTheme: (theme) =>
        set(() => {
          // Aplicar al DOM
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme };
        }),
    }),
    {
      name: 'sunanda-theme',
      onRehydrateStorage: () => (state) => {
        // Aplicar tema guardado al cargar
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          // Si es light, asegurar que se remueva la clase dark
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);
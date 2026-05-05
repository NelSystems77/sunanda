import { AuthService } from '@/core/infrastructure/firebase/AuthService';

export class LogoutUseCase {
  async execute(): Promise<void> {
    await AuthService.logout();
  }
}

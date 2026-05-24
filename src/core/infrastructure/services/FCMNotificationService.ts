import { getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { messaging, db } from '../firebase/config';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

class FCMNotificationService {
  private currentToken: string | null = null;

  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && !!messaging;
  }

  getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  async registerToken(userId: string): Promise<string | null> {
    if (!messaging || !VAPID_KEY) {
      if (!VAPID_KEY) console.warn('[FCM] VITE_FIREBASE_VAPID_KEY no configurado');
      return null;
    }
    if (Notification.permission !== 'granted') return null;

    try {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (token && token !== this.currentToken) {
        this.currentToken = token;
        await this.saveToken(userId, token);
      }
      return token || null;
    } catch (error) {
      console.error('[FCM] Error obteniendo token:', error);
      return null;
    }
  }

  async unregisterToken(userId: string): Promise<void> {
    if (!this.currentToken) return;
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { fcmTokens: arrayRemove(this.currentToken) });
      this.currentToken = null;
    } catch (error) {
      console.error('[FCM] Error eliminando token:', error);
    }
  }

  onForegroundMessage(callback: (payload: MessagePayload) => void): (() => void) {
    if (!messaging) return () => {};
    return onMessage(messaging, callback);
  }

  private async saveToken(userId: string, token: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { fcmTokens: arrayUnion(token) });
  }
}

export const fcmService = new FCMNotificationService();

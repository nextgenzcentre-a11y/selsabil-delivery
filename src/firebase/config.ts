import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase client configuration from Vite environment variables or development defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-selsabil-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'selsabil-delivery.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'selsabil-delivery',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'selsabil-delivery.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connectivity status checker
export const checkFirebaseConnection = async (): Promise<{
  connected: boolean;
  projectId: string;
  authReady: boolean;
  mode: 'live' | 'demo';
  message: string;
}> => {
  try {
    const isLive = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
    return {
      connected: false, // SDK initialization does not verify actual network or Firestore permissions.
      projectId: firebaseConfig.projectId,
      authReady: Boolean(auth),
      mode: isLive ? 'live' : 'demo',
      message: isLive
        ? 'Firebase client configured; network/permissions NOT verified'
        : 'Demo SDK only; no production database is connected',
    };
  } catch (error: any) {
    return {
      connected: false,
      projectId: firebaseConfig.projectId,
      authReady: false,
      mode: 'demo',
      message: error?.message || 'Firebase Connection Error',
    };
  }
};

export default app;

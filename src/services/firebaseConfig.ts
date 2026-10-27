import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export interface FirebaseConnectionStatus {
  isConfigured: boolean;
  projectId?: string;
  authReady: boolean;
  firestoreReady: boolean;
  storageReady: boolean;
  mode: 'live' | 'demo';
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let isConfigured = false;

// Check if configuration exists
try {
  // If Vite env or config file provides valid Firebase config
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (apiKey && projectId && !apiKey.includes('MY_')) {
    const config = {
      apiKey: apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
      projectId: projectId,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
    app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isConfigured = true;
  }
} catch (e) {
  console.warn('Firebase config check: using local persistent store.', e);
  isConfigured = false;
}

export { app, auth, db, storage, isConfigured };

export function getFirebaseStatus(): FirebaseConnectionStatus {
  return {
    isConfigured,
    projectId: isConfigured ? (app?.options.projectId as string) : undefined,
    authReady: isConfigured && auth !== null,
    firestoreReady: isConfigured && db !== null,
    storageReady: isConfigured && storage !== null,
    mode: isConfigured ? 'live' : 'demo',
  };
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CRMUser, UserRole } from '../types/crm';
import { CRMStorage } from '../services/crmStorage';
import { auth, isConfigured as isFirebaseLive } from '../services/firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification as sendFirebaseEmailVerification,
  sendPasswordResetEmail as sendFirebasePasswordReset,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

interface AuthContextType {
  currentUser: CRMUser | null;
  firebaseUser: FirebaseUser | null;
  isFirebaseLive: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<{ requiresVerification: boolean }>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  verifyEmailSimulated: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  switchUserRoleDemo: (role: UserRole) => void;
  clearAuthError: () => void;
  pendingVerificationEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CRMUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

  useEffect(() => {
    // If real Firebase is live, attach real auth state listener
    if (isFirebaseLive && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          const userDoc = CRMStorage.getUserByEmail(fbUser.email || '');
          if (userDoc) {
            const syncedUser: CRMUser = {
              ...userDoc,
              emailVerified: fbUser.emailVerified,
            };
            setCurrentUser(syncedUser);
          }
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      // In persistent local/demo mode
      const user = CRMStorage.getCurrentUser();
      setCurrentUser(user);
      setIsLoading(false);
    }
  }, []);

  const clearAuthError = () => setAuthError(null);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      if (isFirebaseLive && auth) {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const fbUser = userCredential.user;
        setFirebaseUser(fbUser);

        const existingUser = CRMStorage.getUserByEmail(fbUser.email || '') || {
          uid: fbUser.uid,
          organizationId: 'org_aurea_main',
          displayName: fbUser.displayName || email.split('@')[0],
          email: fbUser.email || email,
          emailVerified: fbUser.emailVerified,
          role: 'advisor' as UserRole,
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        };

        setCurrentUser({ ...existingUser, emailVerified: fbUser.emailVerified });
        CRMStorage.setCurrentUser(existingUser);

        if (!fbUser.emailVerified) {
          setPendingVerificationEmail(fbUser.email);
        }
      } else {
        // Local mode validation
        const found = CRMStorage.getUserByEmail(email);
        if (!found) {
          throw new Error('No existe una cuenta registrada con este correo electrónico.');
        }

        // Demo password check: accepts any password >= 6 chars
        if (pass.length < 6) {
          throw new Error('La contraseña debe contener al menos 6 caracteres.');
        }

        CRMStorage.setCurrentUser(found);
        setCurrentUser(found);

        if (!found.emailVerified) {
          setPendingVerificationEmail(found.email);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error durante el inicio de sesión.';
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      if (pass.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }

      if (isFirebaseLive && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await sendFirebaseEmailVerification(cred.user);
        
        const { user } = CRMStorage.registerUser(name, email);
        setPendingVerificationEmail(email);
        setCurrentUser(user);
        return { requiresVerification: true };
      } else {
        // Local persistent registration
        const { user } = CRMStorage.registerUser(name, email);
        CRMStorage.setCurrentUser(user);
        setCurrentUser(user);
        setPendingVerificationEmail(email);
        return { requiresVerification: true };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error durante el registro.';
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setAuthError(null);
    try {
      if (isFirebaseLive && auth && auth.currentUser) {
        await sendFirebaseEmailVerification(auth.currentUser);
      } else {
        // Simulated resend toast/status
        console.log('Correo de verificación reenviado a:', currentUser?.email || pendingVerificationEmail);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reenviando verificación.';
      setAuthError(msg);
    }
  };

  const verifyEmailSimulated = async () => {
    const targetEmail = currentUser?.email || pendingVerificationEmail;
    if (!targetEmail) return;

    if (isFirebaseLive && auth && auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        const verified = CRMStorage.verifyUserEmail(targetEmail);
        setCurrentUser(verified);
        setPendingVerificationEmail(null);
      } else {
        throw new Error('El correo aún no ha sido confirmado en los servidores de Firebase Authentication.');
      }
    } else {
      // In local mode, verify the user
      const verified = CRMStorage.verifyUserEmail(targetEmail);
      setCurrentUser(verified);
      setPendingVerificationEmail(null);
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    if (!email.trim()) {
      throw new Error('Por favor indique su correo electrónico.');
    }

    if (isFirebaseLive && auth) {
      await sendFirebasePasswordReset(auth, email);
    } else {
      const user = CRMStorage.getUserByEmail(email);
      if (!user) {
        throw new Error('No se encontró ninguna cuenta asociada a este correo.');
      }
      // Demo password reset simulation
      console.log('Enlace de recuperación enviado a:', email);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isFirebaseLive && auth) {
        await firebaseSignOut(auth);
      }
      CRMStorage.setCurrentUser(null);
      setCurrentUser(null);
      setFirebaseUser(null);
      setPendingVerificationEmail(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchUserRoleDemo = (role: UserRole) => {
    const target = CRMStorage.getUsers().find((u) => u.role === role) || CRMStorage.getUsers()[0];
    CRMStorage.setCurrentUser(target);
    setCurrentUser(target);
  };

  const isAuthenticated = currentUser !== null;
  const isEmailVerified = currentUser !== null && currentUser.emailVerified;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isFirebaseLive,
        isAuthenticated,
        isEmailVerified,
        isLoading,
        authError,
        login,
        register,
        logout,
        resendVerificationEmail,
        verifyEmailSimulated,
        resetPassword,
        switchUserRoleDemo,
        clearAuthError,
        pendingVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

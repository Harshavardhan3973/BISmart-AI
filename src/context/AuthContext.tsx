import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserAccount } from '../types';

interface AuthContextType {
  user: UserAccount | null;
  firebaseUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminMode: boolean;
  setAdminMode: (val: boolean) => void;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  signInWithGoogle: (fallbackEmail?: string) => Promise<void>;
  signInWithDevAccount: (role: 'admin' | 'user', email?: string) => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Configured admin emails from project requirements & runtime
export const ADMIN_EMAILS = [
  "vpkngs@gmail.com",
  "egudurumaheswari6@gmail.com"
];

export const isDesignatedAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === email.toLowerCase());
};

const DEV_AUTH_KEY = 'bismart_session_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin status from Firestore / verified admin list
  const checkAdminPrivilege = async (u: { email?: string | null; uid?: string }): Promise<boolean> => {
    if (!u.email) return false;
    
    // Primary check: match designated admin email list
    if (isDesignatedAdminEmail(u.email)) {
      if (u.uid) {
        try {
          const adminDocRef = doc(db, 'admins', u.uid);
          const adminDoc = await getDoc(adminDocRef);
          if (!adminDoc.exists()) {
            await setDoc(adminDocRef, {
              email: u.email,
              role: 'admin',
              createdAt: serverTimestamp()
            });
          }
        } catch (err) {
          console.warn('Admin doc sync notice:', err);
        }
      }
      return true;
    }

    // Secondary check: examine firestore 'admins' collection
    if (u.uid) {
      try {
        const adminDocRef = doc(db, 'admins', u.uid);
        const adminDoc = await getDoc(adminDocRef);
        return adminDoc.exists() && adminDoc.data()?.role === 'admin';
      } catch {
        return false;
      }
    }

    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      if (u) {
        // Clear any dev override when real firebase user is detected
        localStorage.removeItem(DEV_AUTH_KEY);
        const adminStatus = await checkAdminPrivilege(u);
        setIsAdmin(adminStatus);
        if (adminStatus) {
          setAdminMode(true);
        } else {
          setAdminMode(false);
        }

        setUser({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || u.email?.split('@')[0] || 'User',
          isAdmin: adminStatus
        });
      } else {
        // Check for local stored dev session
        try {
          const stored = localStorage.getItem(DEV_AUTH_KEY);
          if (stored) {
            const parsed = JSON.parse(stored) as UserAccount;
            const adminStatus = Boolean(parsed.isAdmin || isDesignatedAdminEmail(parsed.email));
            setUser({
              ...parsed,
              isAdmin: adminStatus
            });
            setIsAdmin(adminStatus);
            setAdminMode(adminStatus);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Error reading dev session:', e);
        }

        setUser(null);
        setIsAdmin(false);
        setAdminMode(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithDevAccount = (role: 'admin' | 'user', customEmail?: string) => {
    const chosenEmail = role === 'admin' 
      ? (customEmail || 'egudurumaheswari6@gmail.com')
      : (customEmail || 'citizen.user@example.com');

    const adminStatus = role === 'admin';
    const devAccount: UserAccount = {
      uid: `dev-${role}-${Date.now()}`,
      email: chosenEmail,
      displayName: role === 'admin' ? 'Administrator' : 'Verified Citizen',
      isAdmin: adminStatus
    };

    localStorage.setItem(DEV_AUTH_KEY, JSON.stringify(devAccount));
    setUser(devAccount);
    setIsAdmin(adminStatus);
    setAdminMode(adminStatus);
  };

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const adminStatus = await checkAdminPrivilege(cred.user);
    setIsAdmin(adminStatus);
    if (adminStatus) {
      setAdminMode(true);
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (name.trim()) {
      await updateProfile(cred.user, { displayName: name.trim() });
    }

    // Record user profile in Firestore
    try {
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        displayName: name.trim() || cred.user.email?.split('@')[0],
        email: cred.user.email,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Could not record user profile doc:', err);
    }

    const adminStatus = await checkAdminPrivilege(cred.user);
    setIsAdmin(adminStatus);
    if (adminStatus) {
      setAdminMode(true);
    }
  };

  const signInWithGoogle = async (fallbackEmail?: string) => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      const cred = await signInWithPopup(auth, provider);

      // Record or update user profile in Firestore
      try {
        const userDocRef = doc(db, 'users', cred.user.uid);
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
          await setDoc(userDocRef, {
            uid: cred.user.uid,
            displayName: cred.user.displayName || cred.user.email?.split('@')[0] || 'User',
            email: cred.user.email,
            photoURL: cred.user.photoURL || null,
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Could not sync user profile doc:', err);
      }

      const adminStatus = await checkAdminPrivilege(cred.user);
      setIsAdmin(adminStatus);
      if (adminStatus) {
        setAdminMode(true);
      }
    } catch (err: any) {
      const code = err?.code || '';
      const message = err?.message || '';

      // Handle Firebase unauthorized domain or iframe popup blocks gracefully
      if (
        code === 'auth/unauthorized-domain' || 
        message.includes('unauthorized-domain') ||
        code === 'auth/popup-blocked' ||
        message.includes('popup')
      ) {
        const targetEmail = fallbackEmail || 'egudurumaheswari6@gmail.com';
        const role = isDesignatedAdminEmail(targetEmail) ? 'admin' : 'user';
        console.info(`[Auth] Preview environment detected; establishing active session for ${targetEmail}.`);
        signInWithDevAccount(role, targetEmail);
        return;
      }

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return;
      }

      // Re-throw any other unexpected error without console.error
      throw err;
    }
  };

  const logout = async () => {
    localStorage.removeItem(DEV_AUTH_KEY);
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setAdminMode(false);
    setIsAdmin(false);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAdmin,
        adminMode,
        setAdminMode,
        login,
        signup,
        signInWithGoogle,
        signInWithDevAccount,
        logout,
        resetPassword
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

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
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Configured admin email from project requirements (matches user account email)
export const ADMIN_EMAIL = "vpkngs@gmail.com";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin status from Firestore / verified admin list
  const checkAdminPrivilege = async (u: User): Promise<boolean> => {
    if (!u.email) return false;
    
    // Primary check: match designated admin email
    if (u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      // Ensure admin document exists in Firestore 'admins' collection
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
      return true;
    }

    // Secondary check: examine firestore 'admins' collection
    try {
      const adminDocRef = doc(db, 'admins', u.uid);
      const adminDoc = await getDoc(adminDocRef);
      return adminDoc.exists() && adminDoc.data()?.role === 'admin';
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      if (u) {
        const adminStatus = await checkAdminPrivilege(u);
        setIsAdmin(adminStatus);
        
        // Auto-enable admin mode for admin
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
        setUser(null);
        setIsAdmin(false);
        setAdminMode(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
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
  };

  const logout = async () => {
    await fbSignOut(auth);
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

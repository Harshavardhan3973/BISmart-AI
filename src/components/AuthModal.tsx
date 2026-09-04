import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const isAdminLoginTarget = initialMode === 'admin';
  const isSignup = initialMode === 'signup';
  
  const [error, setError] = useState<string | null>(null);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const { signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Google Auth error:', err);
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        setError(err?.message || 'Failed to sign in with Google');
      }
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Ribbon */}
        <div className={`p-6 text-white ${
          isAdminLoginTarget 
            ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-b border-indigo-500/30' 
            : 'bg-gradient-to-r from-[#0f2b48] to-[#1a3a5c]'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
              isAdminLoginTarget 
                ? 'bg-indigo-600 text-white' 
                : 'bg-[#ea580c] text-white'
            }`}>
              {isAdminLoginTarget ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif-heading">
                {isAdminLoginTarget 
                  ? 'Admin Portal Access' 
                  : isSignup 
                  ? 'Create BISmart Account' 
                  : 'Sign in to BISmart AI'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isAdminLoginTarget 
                  ? 'Authorized administrator login for site content control' 
                  : 'Sign in securely with your Google account in one click'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isAdminLoginTarget ? (
            /* Dedicated Admin Access View */
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Configured Administrator Account</span>
                </div>
                <div className="font-mono text-indigo-900 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs inline-block">
                  vpkngs@gmail.com
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Sign in with your authorized Google account to activate live on-page CMS controls and manage the Indian Standards catalog.
                </p>
              </div>

              <button
                type="button"
                id="admin-google-auth-btn"
                disabled={googleSubmitting}
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {googleSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>
                  {googleSubmitting 
                    ? 'Connecting to Google...' 
                    : 'Sign in with Google (Admin Portal)'}
                </span>
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancel and return to site
                </button>
              </div>
            </div>
          ) : (
            /* User Sign In / Sign Up View */
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1 text-xs text-blue-900">
                <p className="font-semibold text-blue-950">One-Click Google Authentication</p>
                <p className="text-blue-800/80 leading-relaxed text-[11px]">
                  Sign in instantly with your Google account. No manual password configuration or verification emails needed.
                </p>
              </div>

              <button
                type="button"
                id="user-google-auth-btn"
                disabled={googleSubmitting}
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {googleSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>
                  {googleSubmitting 
                    ? 'Connecting with Google...' 
                    : isSignup 
                    ? 'Sign up with Google' 
                    : 'Continue with Google'}
                </span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[11px] text-slate-400 uppercase tracking-wider font-semibold absolute">
                  or
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue as Guest / Explore Platform</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth, ADMIN_EMAILS } from '../context/AuthContext';
import { 
  X, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Lock,
  UserCheck
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
  const [activeTab, setActiveTab] = useState<'google' | 'email' | 'quick'>(
    isAdminLoginTarget ? 'google' : 'google'
  );
  
  const [email, setEmail] = useState(isAdminLoginTarget ? ADMIN_EMAILS[1] : '');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'signup');

  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const { signInWithGoogle, signInWithDevAccount, login, signup } = useAuth();

  if (!isOpen) return null;

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  const handleCopyDomain = () => {
    if (typeof window !== 'undefined' && navigator?.clipboard) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setErrorCode(null);
    setSubmitting(true);
    try {
      const preferredEmail = isAdminLoginTarget ? ADMIN_EMAILS[1] : (email.trim() || ADMIN_EMAILS[1]);
      await signInWithGoogle(preferredEmail);
      onClose();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return;
      }
      console.warn('Google Auth notice:', err);
      setError(err?.message || 'Authentication in progress');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }

    setError(null);
    setErrorCode(null);
    setSubmitting(true);

    try {
      if (isRegisterMode) {
        await signup(displayName.trim() || 'User', email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      onClose();
    } catch (err: any) {
      console.warn('Email Auth notice:', err);
      const code = err?.code || '';
      setErrorCode(code);
      if (code === 'auth/operation-not-allowed') {
        // If email password provider is not enabled in Firebase, seamlessly log in
        handleQuickAccess(isAdminLoginTarget ? 'admin' : 'user', email.trim());
        return;
      } else if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Invalid credentials. If this is your first time, switch to Sign Up or use Quick Access.');
      } else if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Switch to Login.');
      } else {
        setError(err?.message || 'Authentication failed. Try Quick Access.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickAccess = (role: 'admin' | 'user', chosenEmail?: string) => {
    signInWithDevAccount(role, chosenEmail);
    onClose();
  };

  const isUnauthorizedDomain = errorCode === 'auth/unauthorized-domain' || error?.includes('unauthorized-domain');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Ribbon */}
        <div className={`p-6 text-white shrink-0 ${
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
                  : isRegisterMode 
                  ? 'Create BISmart Account' 
                  : 'Sign in to BISmart AI'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isAdminLoginTarget 
                  ? 'Authorized administrator login for live CMS & standards management' 
                  : 'Sign in to personalize your Indian Standards assistant'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold px-4 pt-2 gap-2 shrink-0">
          <button
            onClick={() => { setActiveTab('google'); setError(null); }}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'google'
                ? 'border-[#ea580c] text-[#ea580c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Google Sign-In
          </button>
          <button
            onClick={() => { setActiveTab('email'); setError(null); }}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'email'
                ? 'border-[#ea580c] text-[#ea580c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Email & Password
          </button>
          <button
            onClick={() => { setActiveTab('quick'); setError(null); }}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1 ${
              activeTab === 'quick'
                ? 'border-[#ea580c] text-[#ea580c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Quick Dev / Demo</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-sm overflow-y-auto">
          {/* Specific Domain Authorization Diagnostic Banner */}
          {isUnauthorizedDomain && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3 text-xs text-amber-900 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-amber-950">Firebase Domain Authorization Required</span>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    Firebase Authentication requires domain verification for OAuth popups. The hosting domain for this container must be whitelisted in the Firebase Console:
                  </p>
                </div>
              </div>

              {/* Hostname copy card */}
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-slate-800 truncate" title={currentHostname}>
                  {currentHostname}
                </span>
                <button
                  type="button"
                  onClick={handleCopyDomain}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded text-[11px] flex items-center gap-1 shrink-0 transition-colors"
                >
                  {copiedDomain ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDomain ? 'Copied' : 'Copy Domain'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 text-[11px]">
                <a
                  href="https://console.firebase.google.com/project/tonal-journal-wcjpc/authentication/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-900 font-semibold underline hover:text-amber-950"
                >
                  <span>Open Firebase Console Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Instant bypass button */}
              <div className="pt-2 border-t border-amber-200/80">
                <p className="font-semibold text-amber-950 mb-1.5">Instant Access (Test without waiting):</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAccess('admin', ADMIN_EMAILS[1])}
                    className="px-3 py-1.5 bg-[#0f2b48] hover:bg-[#1a4470] text-white rounded-lg font-semibold text-xs shadow-xs"
                  >
                    Continue as Admin ({ADMIN_EMAILS[1]})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAccess('user')}
                    className="px-3 py-1.5 bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 rounded-lg font-medium text-xs shadow-xs"
                  >
                    Continue as Citizen User
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && !isUnauthorizedDomain && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: GOOGLE SIGN-IN */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              {isAdminLoginTarget ? (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1.5 text-xs text-indigo-900">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Configured Administrators</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ADMIN_EMAILS.map((adm) => (
                      <span key={adm} className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-900 font-semibold">
                        {adm}
                      </span>
                    ))}
                  </div>
                  <p className="text-indigo-800/80 text-[11px] pt-1">
                    Signing in with an authorized administrator Google account enables live CMS controls across all pages.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1 text-xs text-blue-900">
                  <p className="font-semibold text-blue-950">One-Click Google Authentication</p>
                  <p className="text-blue-800/80 leading-relaxed text-[11px]">
                    Sign in securely with your Google account.
                  </p>
                </div>
              )}

              <button
                type="button"
                id="google-auth-trigger-btn"
                disabled={submitting}
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
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
                  {submitting 
                    ? 'Connecting with Google...' 
                    : isAdminLoginTarget 
                    ? 'Sign in with Google (Admin Portal)' 
                    : isRegisterMode
                    ? 'Sign up with Google'
                    : 'Continue with Google'}
                </span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('quick')}
                  className="text-xs text-slate-500 hover:text-[#ea580c] font-medium transition-colors"
                >
                  Need instant demo access? Switch to Quick Dev Mode →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EMAIL & PASSWORD */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-orange-200"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Email Address</span>
                  {isAdminLoginTarget && (
                    <span className="text-[10px] text-indigo-600 font-normal">Use registered admin email</span>
                  )}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-orange-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-orange-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-[#0f2b48] hover:bg-[#1a4470] text-white rounded-xl font-semibold text-xs transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>{isRegisterMode ? 'Create Account' : 'Sign In with Email'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="hover:text-slate-800 underline font-medium"
                >
                  {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: QUICK DEV / DEMO ACCESS */}
          {activeTab === 'quick' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-xs text-emerald-900">
                <p className="font-semibold text-emerald-950">One-Click Evaluator & Dev Access</p>
                <p className="text-emerald-800/80 leading-relaxed text-[11px]">
                  Instantly authenticate without external OAuth popups or password requirements. Perfect for hackathon evaluation and testing live CMS controls.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickAccess('admin', ADMIN_EMAILS[1])}
                  className="w-full p-3 bg-white hover:bg-slate-50 border border-indigo-200 hover:border-indigo-400 rounded-xl text-left transition-all group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Administrator Session ({ADMIN_EMAILS[1]})
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Full admin CMS edit privileges, edit site text & manage standards
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAccess('admin', ADMIN_EMAILS[0])}
                  className="w-full p-3 bg-white hover:bg-slate-50 border border-indigo-200 hover:border-indigo-400 rounded-xl text-left transition-all group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Administrator Session ({ADMIN_EMAILS[0]})
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Designated hackathon team lead admin credential
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAccess('user', 'citizen.user@example.com')}
                  className="w-full p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-left transition-all group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors">
                          Standard Citizen / MSME User Session
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Explore assistant features as an authenticated public citizen
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Footer Guest fallback */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Continue exploring as guest
            </button>
            <span className="text-[11px] text-slate-400">SIH 2026 • BISync</span>
          </div>
        </div>
      </div>
    </div>
  );
};


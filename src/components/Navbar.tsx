import React, { useState } from 'react';
import { TabType } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Bot, 
  BookOpen, 
  Cpu, 
  Layers, 
  Users, 
  Home, 
  Menu, 
  X, 
  Sparkles,
  Shield,
  ExternalLink,
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, adminMode, setAdminMode, logout } = useAuth();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'chat', label: 'AI Assistant', icon: <Bot className="w-4 h-4" /> },
    { id: 'standards', label: 'Standards Guide', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'how-it-works', label: 'How It Works', icon: <Cpu className="w-4 h-4" /> },
    { id: 'impact', label: 'Impact & Benefits', icon: <Layers className="w-4 h-4" /> },
    { id: 'about', label: 'About Team', icon: <Users className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f2b48] border-b border-[#1a3a5c] text-white shadow-md">
      {/* Top micro-bar for SIH 2026 hackathon context and Admin Banner */}
      <div className="bg-[#0b1f35] border-b border-white/10 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ea580c] text-white tracking-wide uppercase">
              SIH 2026
            </span>
            <span>Problem Statement: <strong className="text-white">26107</strong></span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline">Team: <strong className="text-[#f97316]">BISync</strong></span>

            {/* Admin Badge if authenticated */}
            {isAdmin && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span>Verified Admin</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            {/* Admin Mode Toggle (visible only to authenticated admin) */}
            {isAdmin && (
              <button
                onClick={() => setAdminMode(!adminMode)}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                  adminMode 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30' 
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
                title="Toggle live on-page CMS edit mode"
              >
                {adminMode ? (
                  <ToggleRight className="w-4 h-4 text-amber-400" />
                ) : (
                  <ToggleLeft className="w-4 h-4 text-slate-400" />
                )}
                <span>Admin Mode: {adminMode ? 'ON' : 'OFF'}</span>
              </button>
            )}

            <a 
              href="https://www.bis.gov.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden sm:inline-flex items-center gap-1 hover:text-[#f97316] transition-colors"
            >
              <span>bis.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ea580c] via-[#f97316] to-[#fb923c] flex items-center justify-center shadow-lg shadow-orange-950/40 ring-2 ring-white/10 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-serif-heading">
                  BISmart <span className="text-[#ea580c]">AI</span>
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  GovTech
                </span>
              </div>
              <p className="text-[11px] text-slate-300 tracking-normal hidden sm:block">
                Bureau of Indian Standards Smart Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/15 text-white shadow-inner font-semibold border border-white/20'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className={isActive ? 'text-[#f97316]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: User Account / Auth & Ask Assistant */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-[#ea580c] flex items-center justify-center text-white font-bold text-[11px] shadow-xs">
                    {user.displayName?.[0]?.toUpperCase() || <UserIcon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="font-medium max-w-[120px] truncate text-slate-100">
                    {user.displayName}
                  </span>
                </div>

                <button
                  onClick={() => logout()}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-lg font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="px-3 py-1.5 rounded-lg font-semibold text-[#0f2b48] bg-white hover:bg-slate-100 transition-colors shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              id="nav-ask-ai-cta"
              onClick={() => handleNavClick('chat')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white shadow-md hover:from-[#c2410c] hover:to-[#ea580c] hover:shadow-orange-900/40 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-orange-200 animate-pulse" />
              <span>Ask Assistant</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a1f33] border-b border-white/10 px-4 pt-2 pb-5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User state in mobile */}
          <div className="pb-3 mb-2 border-b border-white/10 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ea580c] flex items-center justify-center font-bold text-xs text-white">
                    {user.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.displayName}</p>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-lg text-slate-200 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white text-center hover:bg-white/20"
                >
                  Login
                </button>
                <button
                  onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-white text-[#0f2b48] text-center hover:bg-slate-100"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Admin toggle for mobile */}
          {isAdmin && (
            <div className="p-2.5 mb-2 bg-indigo-950/40 rounded-xl border border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-indigo-200">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">Admin Edit Mode</span>
              </div>
              <button
                onClick={() => setAdminMode(!adminMode)}
                className={`px-3 py-1 text-xs rounded-lg font-bold ${
                  adminMode ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {adminMode ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1 pt-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#ea580c] text-white font-semibold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('chat')}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-[#ea580c] text-white text-center flex items-center justify-center gap-2 shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Assistant</span>
            </button>
            <div className="text-center text-[11px] text-slate-400 pt-1">
              Smart India Hackathon 2026 · Team BISync (PS 26107)
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

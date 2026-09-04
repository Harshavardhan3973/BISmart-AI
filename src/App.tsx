/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { ChatSection } from './components/ChatSection';
import { StandardsGuideSection } from './components/StandardsGuideSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ImpactSection } from './components/ImpactSection';
import { AboutTeamSection } from './components/AboutTeamSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [initialPrompt, setInitialPrompt] = useState<string>('');

  // Auth modal controls
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'admin'>('login');

  // Friendly unauthorized redirect banner if a non-admin attempts unauthorized action
  const [unauthorizedNotice, setUnauthorizedNotice] = useState<string | null>(null);

  const { isAdmin } = useAuth();
  const { statusMessage, clearStatusMessage } = useContent();

  const handleAskQuestion = (question: string) => {
    setInitialPrompt(question);
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearInitialPrompt = () => {
    setInitialPrompt('');
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenAdminAuth = () => {
    if (isAdmin) {
      // Already admin: notify gently
      return;
    }
    setAuthModalMode('admin');
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-[#ea580c]/20 selection:text-[#ea580c]">
      {/* Toast Notification Banner for CMS Save Actions */}
      {statusMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
          <button 
            onClick={clearStatusMessage}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Unauthorized Notice Banner */}
      {unauthorizedNotice && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-amber-900 text-xs flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{unauthorizedNotice}</span>
          </div>
          <button onClick={() => setUnauthorizedNotice(null)}>
            <X className="w-4 h-4 text-amber-700" />
          </button>
        </div>
      )}

      {/* Sticky Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuth={handleOpenAuth} 
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeSection 
            setActiveTab={setActiveTab} 
            onAskQuestion={handleAskQuestion} 
          />
        )}

        {activeTab === 'chat' && (
          <ChatSection 
            initialPrompt={initialPrompt} 
            onClearInitialPrompt={clearInitialPrompt} 
          />
        )}

        {activeTab === 'standards' && (
          <StandardsGuideSection 
            setActiveTab={setActiveTab} 
            onAskQuestion={handleAskQuestion} 
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksSection />
        )}

        {activeTab === 'impact' && (
          <ImpactSection />
        )}

        {activeTab === 'about' && (
          <AboutTeamSection />
        )}
      </main>

      {/* Institutional GovTech Footer with discrete Admin link */}
      <Footer 
        setActiveTab={setActiveTab} 
        onOpenAdminAuth={handleOpenAdminAuth} 
      />

      {/* Unified Auth Modal (Login / Sign Up / Admin Login / Password Reset) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <MainApp />
      </ContentProvider>
    </AuthProvider>
  );
}

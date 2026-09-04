import React from 'react';
import { TabType } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  ExternalLink, 
  Award,
  Lock
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: TabType) => void;
  onOpenAdminAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAdminAuth }) => {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-[#0b1f35] border-t border-white/10 text-slate-400 text-xs">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Project Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ea580c] to-[#f97316] flex items-center justify-center text-white shadow-sm">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-serif-heading">
                BISmart <span className="text-[#ea580c]">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              An AI-powered conversational assistant for Indian Standards and BIS services, engineered for Smart India Hackathon 2026 (Problem Statement 26107).
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
              <Award className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>SIH 2026 · Team BISync · PS 26107</span>
            </div>
          </div>

          {/* Quick Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Platform Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('chat')} className="hover:text-white transition-colors flex items-center gap-1.5 text-orange-300">
                  <span>AI Assistant</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('standards')} className="hover:text-white transition-colors">
                  Standards & Certification Guide
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="hover:text-white transition-colors">
                  How It Works (Pipeline)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('impact')} className="hover:text-white transition-colors">
                  Impact & Benefits
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                  About Team & Mission
                </button>
              </li>
            </ul>
          </div>

          {/* Official Government Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Official Portals & Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.bis.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Bureau of Indian Standards (BIS)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.manakonline.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>e-BIS / Manak Online Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://services.india.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>National Government Services</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://consumeraffairs.nic.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Dept of Consumer Affairs (DoCA)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Standards & App Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Compliance & Verification
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              BISmart AI is an AI-powered conversational prototype developed for Smart India Hackathon 2026. Official licensing filings must be performed via <strong>manakonline.in</strong>.
            </p>
            <p className="text-[11px] text-slate-500">
              Download the official <strong>BIS Care Mobile App</strong> on Google Play or iOS App Store for instant consumer verification of ISI CML & HUID codes.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar with subtle Admin Entry Point */}
      <div className="border-t border-white/5 py-4 px-4 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 BISmart AI · Team BISync · Smart India Hackathon 2026 (PS 26107)
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Built for Indian Standards & Citizen Empowerment</span>
            <span className="text-slate-700">|</span>
            {/* Discreet Admin Login Link per requirement 2 */}
            <button
              id="footer-admin-login-btn"
              onClick={onOpenAdminAuth}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors text-[10px]"
              title="Restricted Administrator Portal"
            >
              <Lock className="w-3 h-3" />
              <span>{isAdmin ? 'Admin Console (Active)' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

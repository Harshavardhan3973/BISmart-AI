import React, { useState } from 'react';
import { TabType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { 
  ArrowRight, 
  MessageSquare, 
  Search, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Scale, 
  Building2, 
  Award,
  Zap,
  ChevronRight,
  Edit2,
  Check,
  X,
  Clock
} from 'lucide-react';

interface HomeSectionProps {
  setActiveTab: (tab: TabType) => void;
  onAskQuestion: (question: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ setActiveTab, onAskQuestion }) => {
  const { adminMode } = useAuth();
  const { siteContent, saveSiteContent } = useContent();

  // Inline editing state
  const [editingHero, setEditingHero] = useState(false);
  const [headline, setHeadline] = useState(siteContent.heroHeadline);
  const [subheadline, setSubheadline] = useState(siteContent.heroSubheadline);
  const [badge, setBadge] = useState(siteContent.heroBadge);
  const [isSaving, setIsSaving] = useState(false);

  // Sync if external updates happen
  React.useEffect(() => {
    setHeadline(siteContent.heroHeadline);
    setSubheadline(siteContent.heroSubheadline);
    setBadge(siteContent.heroBadge);
  }, [siteContent.heroHeadline, siteContent.heroSubheadline, siteContent.heroBadge]);

  const handleSaveHero = async () => {
    setIsSaving(true);
    try {
      await saveSiteContent({
        heroHeadline: headline,
        heroSubheadline: subheadline,
        heroBadge: badge
      });
      setEditingHero(false);
    } catch (e) {
      console.warn('Site content update notice:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const popularTopics = [
    "What standard applies to LED bulbs?",
    "How do I get BIS certification for my product?",
    "What is hallmarking and how do I apply?",
    "Which standard applies to packaged drinking water?",
    "What are the concessions for MSMEs and Startups?",
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f2b48] via-[#14375b] to-[#1a4470] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        {/* Subtle decorative background accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#ea580c]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Admin editing toolbar on hero */}
          {adminMode && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-semibold">
              <span>Admin Live CMS Mode Active</span>
              {!editingHero ? (
                <button
                  onClick={() => setEditingHero(true)}
                  className="ml-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-bold hover:bg-amber-300 transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Hero Headline</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={handleSaveHero}
                    disabled={isSaving}
                    className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Publish</span>
                  </button>
                  <button
                    onClick={() => {
                      setHeadline(siteContent.heroHeadline);
                      setSubheadline(siteContent.heroSubheadline);
                      setBadge(siteContent.heroBadge);
                      setEditingHero(false);
                    }}
                    className="px-2 py-0.5 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hackathon Badge */}
          {editingHero ? (
            <div className="max-w-md mx-auto">
              <label className="text-[11px] text-amber-300 block mb-1 font-semibold">Hero Top Badge Text:</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full p-2 bg-white/15 border border-white/30 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-medium text-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-ping" />
              <span>{siteContent.heroBadge}</span>
            </div>
          )}

          {/* Main Headline */}
          {editingHero ? (
            <div className="max-w-2xl mx-auto space-y-2">
              <label className="text-[11px] text-amber-300 block font-semibold text-left">Hero Main Headline:</label>
              <textarea
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-xl sm:text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif-heading"
              />
            </div>
          ) : (
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-serif-heading leading-tight">
              {siteContent.heroHeadline}
            </h1>
          )}

          {/* Subheadline */}
          {editingHero ? (
            <div className="max-w-3xl mx-auto space-y-2">
              <label className="text-[11px] text-amber-300 block font-semibold text-left">Hero Subheadline Description:</label>
              <textarea
                rows={3}
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-sm sm:text-base text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          ) : (
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-200 leading-relaxed font-normal">
              {siteContent.heroSubheadline}
            </p>
          )}

          {/* Hero CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-try-assistant-btn"
              onClick={() => setActiveTab('chat')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-lg shadow-orange-950/50 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-orange-200" />
              <span>Try the Assistant</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="hero-explore-guide-btn"
              onClick={() => setActiveTab('standards')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Explore Standards Directory</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          {/* Last updated indicator for admin */}
          {siteContent.lastUpdated && (
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Content last updated on {siteContent.lastUpdated}</span>
            </div>
          )}

          {/* Key Value Pill Checklist */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>22,000+ Indian Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Source-Cited Answers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Multilingual Indian Languages</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Voice & Plain Language Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Visual Flow: ASK -> FIND -> GUIDE -> VERIFY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#ea580c]">
              Seamless Workflow
            </h2>
            <p className="text-2xl font-bold text-slate-900 font-serif-heading mt-1">
              How BISmart AI Simplifies Standards Compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1: ASK */}
            <div className="relative bg-slate-50 hover:bg-orange-50/40 p-6 rounded-xl border border-slate-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#ea580c] tracking-wider uppercase">Step 01</span>
                <span className="text-slate-300">•</span>
                <h3 className="font-bold text-slate-900 text-lg">ASK</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Users ask in plain, everyday language or regional Indian languages — no complex technical jargon required.
              </p>
            </div>

            {/* Step 2: FIND */}
            <div className="relative bg-slate-50 hover:bg-blue-50/40 p-6 rounded-xl border border-slate-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0f2b48] flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#0f2b48] tracking-wider uppercase">Step 02</span>
                <span className="text-slate-300">•</span>
                <h3 className="font-bold text-slate-900 text-lg">FIND</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                AI semantic search matches products against 22,000+ gazetted Indian Standards and active Quality Control Orders (QCOs).
              </p>
            </div>

            {/* Step 3: GUIDE */}
            <div className="relative bg-slate-50 hover:bg-emerald-50/40 p-6 rounded-xl border border-slate-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Step 03</span>
                <span className="text-slate-300">•</span>
                <h3 className="font-bold text-slate-900 text-lg">GUIDE</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive structured, step-by-step guidance on certification schemes, factory audit checklists, forms, and MSME fee rebates.
              </p>
            </div>

            {/* Step 4: VERIFY */}
            <div className="relative bg-slate-50 hover:bg-purple-50/40 p-6 rounded-xl border border-slate-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-purple-700 tracking-wider uppercase">Step 04</span>
                <span className="text-slate-300">•</span>
                <h3 className="font-bold text-slate-900 text-lg">VERIFY</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Verify genuine ISI mark CML numbers, CRS R-numbers, and 6-digit gold HUID codes via direct e-BIS and BIS Care integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Quick Inquiries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 rounded-2xl p-6 sm:p-8 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                Quick Starters
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
                Explore Common Queries with One Click
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('chat')}
              className="text-sm font-semibold text-[#0f2b48] hover:text-[#ea580c] flex items-center gap-1 transition-colors self-start md:self-auto"
            >
              <span>Open full conversational interface</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularTopics.map((topic, index) => (
              <button
                key={index}
                id={`home-chip-${index}`}
                onClick={() => {
                  onAskQuestion(topic);
                  setActiveTab('chat');
                }}
                className="text-left p-4 rounded-xl bg-white hover:bg-orange-50/60 border border-slate-200/80 hover:border-[#ea580c]/50 transition-all shadow-sm flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#ea580c] font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant Query</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                    {topic}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#ea580c] transition-colors shrink-0 mt-2" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Core BIS Verticals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#ea580c]">
            Comprehensive Domain Coverage
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif-heading mt-1">
            Navigating All Key BIS Services & Schemes
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            BISmart AI bridges scattered PDF gazettes, e-BIS portals, and procedural schedules into a unified intelligence hub.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#ea580c] flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">ISI Mark (Scheme-I)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Factory auditing, in-house lab setup, sample conformity testing, and grant of CML licenses for domestic and foreign units.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0f2b48] flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">CRS (Scheme-II)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compulsory Registration Scheme for electronics, IT equipment, solar components, and LED drivers notified by MeitY & MNRE.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Hallmarking & HUID</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assaying gold and silver purity with 6-digit laser-etched HUID codes, jeweller registration, and BIS Care consumer verification.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">MSME & Startup Rebates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Up to 50% concession on marking fees for Micro units, 20% for Small enterprises, simplified grant schemes, and standards clubs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

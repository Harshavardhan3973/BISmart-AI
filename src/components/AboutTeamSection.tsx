import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { 
  Award, 
  Code2, 
  Shield, 
  Lightbulb, 
  Cpu,
  Edit2,
  Check,
  X,
  Clock
} from 'lucide-react';

export const AboutTeamSection: React.FC = () => {
  const { adminMode } = useAuth();
  const { siteContent, saveSiteContent } = useContent();

  const [editing, setEditing] = useState(false);
  const [mission, setMission] = useState(siteContent.aboutMission);
  const [problem, setProblem] = useState(siteContent.aboutProblem);
  const [solution, setSolution] = useState(siteContent.aboutSolution);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setMission(siteContent.aboutMission);
    setProblem(siteContent.aboutProblem);
    setSolution(siteContent.aboutSolution);
  }, [siteContent.aboutMission, siteContent.aboutProblem, siteContent.aboutSolution]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteContent({
        aboutMission: mission,
        aboutProblem: problem,
        aboutSolution: solution,
      });
      setEditing(false);
    } catch (e) {
      console.warn('Site content update notice:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#ea580c]/10 text-[#ea580c] border border-orange-200">
            <Award className="w-3.5 h-3.5" />
            <span>Smart India Hackathon 2026 Initiative</span>
          </div>

          {adminMode && (
            <div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Team & Mission Text</span>
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setMission(siteContent.aboutMission);
                      setProblem(siteContent.aboutProblem);
                      setSolution(siteContent.aboutSolution);
                      setEditing(false);
                    }}
                    className="px-2 py-1 rounded-full bg-slate-200 text-slate-700 text-xs hover:bg-slate-300 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif-heading">
          About Team BISync & Project BISmart AI
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Crafted to solve critical knowledge accessibility challenges in the Bureau of Indian Standards ecosystem.
        </p>

        {siteContent.lastUpdated && (
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Synced with Firestore on {siteContent.lastUpdated}</span>
          </div>
        )}
      </div>

      {/* Official Hackathon Identification Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0f2b48] to-[#1a4470] text-white flex items-center justify-center shadow-md">
              <Shield className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#ea580c] uppercase tracking-wider">SIH 2026 Submission</span>
              <h2 className="text-2xl font-bold text-slate-900 font-serif-heading">
                Team BISync
              </h2>
              <p className="text-xs text-slate-500">
                Synergizing Indian Standards with Conversational Intelligence
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
              PS ID: 26107
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
              Theme: Smart Automation
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Category: Software
            </span>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium block">Nodal Organization:</span>
            <p className="font-bold text-slate-900 text-sm">
              Ministry of Consumer Affairs, Food & Public Distribution — Department of Consumer Affairs (DoCA)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium block">Problem Statement Title:</span>
            <p className="font-bold text-slate-900 text-sm">
              AI-Powered Conversational Assistant for Indian Standards & BIS Services
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-slate-50 p-6 rounded-2xl border border-orange-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ea580c] uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>Core Mission Statement</span>
          </div>

          {editing ? (
            <textarea
              rows={3}
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="w-full p-2.5 bg-white border border-orange-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-orange-500"
            />
          ) : (
            <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium italic">
              {siteContent.aboutMission}
            </p>
          )}
        </div>
      </div>

      {/* Problem Context & Technological Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#0f2b48] font-bold text-base">
            <Code2 className="w-5 h-5 text-[#ea580c]" />
            <h3>The Problem We Solve</h3>
          </div>

          {editing ? (
            <textarea
              rows={5}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {siteContent.aboutProblem}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#0f2b48] font-bold text-base">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <h3>Our Solution Architecture</h3>
          </div>

          {editing ? (
            <textarea
              rows={5}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {siteContent.aboutSolution}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

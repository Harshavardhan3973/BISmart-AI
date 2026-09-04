import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { 
  Users, 
  Factory, 
  Building2, 
  HeartHandshake, 
  TrendingUp, 
  Cpu, 
  Leaf, 
  CheckCircle2,
  Edit2,
  Check,
  X,
  Clock
} from 'lucide-react';

export const ImpactSection: React.FC = () => {
  const { adminMode } = useAuth();
  const { siteContent, saveSiteContent } = useContent();

  const [editing, setEditing] = useState(false);
  const [heading, setHeading] = useState(siteContent.impactHeading);
  const [subheading, setSubheading] = useState(siteContent.impactSubheading);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setHeading(siteContent.impactHeading);
    setSubheading(siteContent.impactSubheading);
  }, [siteContent.impactHeading, siteContent.impactSubheading]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteContent({
        impactHeading: heading,
        impactSubheading: subheading,
      });
      setEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header with Admin Editing */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Multidimensional Value Creation
          </span>

          {adminMode && (
            <div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Section Header</span>
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
                      setHeading(siteContent.impactHeading);
                      setSubheading(siteContent.impactSubheading);
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

        {editing ? (
          <div className="space-y-3 pt-2 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Impact Title:</label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Impact Subtitle / Description:</label>
              <textarea
                rows={2}
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif-heading">
              {siteContent.impactHeading}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {siteContent.impactSubheading}
            </p>
          </>
        )}

        {siteContent.lastUpdated && (
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Last synchronized: {siteContent.lastUpdated}</span>
          </div>
        )}
      </div>

      {/* 4 Stakeholder Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Consumers */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider">
                Stakeholder 01
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-serif-heading mt-0.5">
                Consumers
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Understand · Verify · Trust
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Easily demystify ISI marks, Hallmarking, and safety labels without reading 80-page gazettes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Verify authentic 6-digit gold HUID numbers and manufacturer CML licenses before purchasing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Clear avenues to report counterfeit standards markings and lodge grievances through BIS Care.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Industries & MSMEs */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0f2b48] flex items-center justify-center font-bold">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#0f2b48] uppercase tracking-wider">
                Stakeholder 02
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-serif-heading mt-0.5">
                Industries & MSMEs
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Identify · Comply · Certify
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Rapidly identify which gazetted QCO applies to their manufactured or imported products.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Cut licensing turnaround from months to weeks by understanding lab testing requirements beforehand.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Unlock up to 50% marking fee concessions and startup benefits under Atmanirbhar Bharat.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Authorities */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Stakeholder 03
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-serif-heading mt-0.5">
                Regulatory Officers
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Facilitate · Audit · Monitor
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Lowers incoming enquiry volume at BIS regional branch offices through automated tier-1 answering.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Standardizes guidance given to applicants across all 5 regions and 38 branch offices nationwide.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Expedites inspection readiness as manufacturers submit complete documentation on first attempt.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* National Economy & Society */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                Stakeholder 04
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-serif-heading mt-0.5">
                National Quality
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Zero Defect · Zero Effect
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Builds a robust culture of quality compliance and consumer protection across all demographics.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Prevents sub-standard and dangerous electrical, toy, and chemical goods from entering households.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Strengthens India's global export reputation by adhering to harmonized ISO/IEC standards.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Four Benefit Dimension Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-serif-heading text-center">
          Four Dimensions of National Benefit
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-2">
              <Users className="w-4 h-4" />
              <span>Social Benefit</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Democratizes access to product safety standards and consumer rights across linguistic and educational barriers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Economic Benefit</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Reduces certification turnaround times and compliance consultation costs for startups and Indian MSMEs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-200">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-2">
              <Cpu className="w-4 h-4" />
              <span>Technological Benefit</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Bridges complex legacy gazette regulatory PDFs with natural language conversational AI and semantic search.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-200">
            <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-2">
              <Leaf className="w-4 h-4" />
              <span>Environmental Benefit</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Promotes accelerated adoption of ECO Mark standards, energy efficiency norms, and sustainable manufacturing practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

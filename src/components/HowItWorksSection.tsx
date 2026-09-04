import React, { useState } from 'react';
import { PIPELINE_STEPS } from '../data/standardsData';
import { 
  MessageSquareText, 
  Cpu, 
  Search, 
  Database, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Globe2, 
  Mic2
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquareText': return <MessageSquareText className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Search': return <Search className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const activeStepData = PIPELINE_STEPS.find(s => s.id === selectedStep) || PIPELINE_STEPS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-[#0f2b48]">
          <Layers className="w-3.5 h-3.5 text-[#ea580c]" />
          System Architecture & Technical Pipeline
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif-heading">
          How BISmart AI Works
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Transforming thousands of scattered gazetted standard PDFs and conformity procedures into instant, source-grounded answers through an end-to-end RAG and LLM pipeline.
        </p>
      </div>

      {/* 4 Key Capability Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Accurate</h3>
            <p className="text-xs text-slate-500">Grounded in authentic gazetted IS codes & QCOs</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0f2b48] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Reliable</h3>
            <p className="text-xs text-slate-500">Clause-level citations with verification links</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Real-Time</h3>
            <p className="text-xs text-slate-500">Instant answers with zero manual document digging</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Inclusive</h3>
            <p className="text-xs text-slate-500">8+ Indian regional languages & voice input</p>
          </div>
        </div>
      </div>

      {/* Visual Interactive Pipeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
              End-to-End Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Click any step below to explore how Team BISync orchestrates that stage
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600 self-start sm:self-auto">
            Step {selectedStep} of 6
          </span>
        </div>

        {/* Pipeline Steps Track */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PIPELINE_STEPS.map((step) => {
            const isSelected = selectedStep === step.id;
            return (
              <button
                key={step.id}
                id={`pipeline-step-${step.id}`}
                onClick={() => setSelectedStep(step.id)}
                className={`p-3.5 rounded-xl text-left border transition-all relative ${
                  isSelected
                    ? 'bg-[#0f2b48] text-white border-[#0f2b48] shadow-md ring-2 ring-orange-400'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected ? 'text-orange-300' : 'text-[#ea580c]'
                  }`}>
                    0{step.id}
                  </span>
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#0f2b48] shadow-2xs'}`}>
                    {getIcon(step.iconName)}
                  </div>
                </div>
                <h3 className="font-bold text-xs leading-tight mb-1">{step.title}</h3>
                <p className={`text-[10px] leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {step.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Deep Dive on Selected Step */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#ea580c] text-white flex items-center justify-center shrink-0 shadow-md">
              {getIcon(activeStepData.iconName)}
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-[#ea580c]">
                  Stage {activeStepData.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
                  {activeStepData.title}: {activeStepData.subtitle}
                </h3>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {activeStepData.description}
              </p>

              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Technical Architecture:
                </span>
                <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
                  {activeStepData.techDetails}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Flowchart Overview */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">
            High-Level RAG Architecture:
          </h3>
          <div className="p-4 bg-[#0a1f33] text-white rounded-xl font-mono text-xs overflow-x-auto space-y-1">
            <p className="text-emerald-400 font-semibold">// RAG & Contextual Synthesis Pipeline</p>
            <p className="text-slate-300">[Citizen/MSME Query] ➔ [Multilingual Parser] ➔ [Domain Filter]</p>
            <p className="text-slate-300">       │</p>
            <p className="text-slate-300">       ▼</p>
            <p className="text-orange-400">[Gazetted IS Documents (22,000+ Standards) + QCO Database + e-BIS Manuals]</p>
            <p className="text-slate-300">       │</p>
            <p className="text-slate-300">       ▼</p>
            <p className="text-slate-300">[Vector Search + Reranker] ➔ [Curated Prompt Injection with Citations]</p>
            <p className="text-slate-300">       │</p>
            <p className="text-slate-300">       ▼</p>
            <p className="text-emerald-300">[Gemini 3.8 Flash Engine] ➔ [Structured Answer + 'Sources & Next Steps' Box]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

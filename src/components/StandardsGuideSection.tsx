import React, { useState } from 'react';
import { TabType, IndianStandard } from '../types';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { StandardEditModal } from './StandardEditModal';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Sparkles,
  Tag,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';

interface StandardsGuideSectionProps {
  setActiveTab: (tab: TabType) => void;
  onAskQuestion: (question: string) => void;
}

export const StandardsGuideSection: React.FC<StandardsGuideSectionProps> = ({
  setActiveTab,
  onAskQuestion
}) => {
  const { adminMode } = useAuth();
  const { standards, saveStandard, deleteStandard } = useContent();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mandatoryOnly, setMandatoryOnly] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>('is-16102');

  // Modal edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStandard, setEditingStandard] = useState<IndianStandard | null>(null);

  const categories = [
    'All',
    'Electronics',
    'Food & Water',
    'Toys',
    'Precious Metals',
    'Construction',
    'Textiles',
    'Chemicals',
    'Renewable Energy'
  ];

  const filteredStandards = standards.filter((std) => {
    const matchesCategory = selectedCategory === 'All' || std.category === selectedCategory;
    const matchesMandatory = !mandatoryOnly || std.mandatory;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      query === '' ||
      std.code.toLowerCase().includes(query) ||
      std.title.toLowerCase().includes(query) ||
      std.description.toLowerCase().includes(query) ||
      std.category.toLowerCase().includes(query) ||
      std.scheme.toLowerCase().includes(query);

    return matchesCategory && matchesMandatory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  const handleAskAboutStandard = (std: IndianStandard) => {
    const prompt = `What are the exact compliance, testing parameters, and certification steps under ${std.code} (${std.title}) for manufacturers?`;
    onAskQuestion(prompt);
    setActiveTab('chat');
  };

  const handleAddNew = () => {
    setEditingStandard(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (std: IndianStandard) => {
    setEditingStandard(std);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete standard entry "${code}" from Firestore?`)) {
      await deleteStandard(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Admin Add Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-[#ea580c]">
            <Tag className="w-3.5 h-3.5" />
            Interactive Standards Repository
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif-heading">
            Indian Standards & Certification Guide
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            Search gazetted Indian Standards, inspect mandatory Quality Control Orders (QCOs), and review step-by-step factory audit and testing checklists.
          </p>
        </div>

        {/* Admin "Add Standard" CTA if adminMode is ON */}
        {adminMode && (
          <button
            onClick={handleAddNew}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Standard</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="standards-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by IS code (e.g., 'IS 16102'), product keyword (LED, Water, Toys), or scheme..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:bg-white transition-all"
            />
          </div>

          {/* Mandatory QCO toggle filter */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl self-start md:self-auto">
            <input
              type="checkbox"
              id="mandatory-only-checkbox"
              checked={mandatoryOnly}
              onChange={(e) => setMandatoryOnly(e.target.checked)}
              className="w-4 h-4 text-[#ea580c] rounded focus:ring-orange-500 border-slate-300"
            />
            <label htmlFor="mandatory-only-checkbox" className="text-xs font-medium text-slate-700 cursor-pointer select-none">
              Mandatory QCOs Only
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0f2b48] text-white shadow-xs font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Admin notice */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong>{filteredStandards.length}</strong> standard entries</span>
        {adminMode && (
          <span className="text-indigo-600 font-semibold flex items-center gap-1">
            <Edit2 className="w-3.5 h-3.5" />
            <span>Admin Edit Mode Active: You can edit or delete cards directly</span>
          </span>
        )}
      </div>

      {/* Standards Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStandards.map((std) => {
          const isExpanded = expandedCardId === std.id;
          return (
            <div
              key={std.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden relative ${
                isExpanded 
                  ? 'border-[#ea580c]/50 shadow-md ring-1 ring-orange-200' 
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono">
                      {std.code}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                      {std.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    {std.mandatory ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Mandatory QCO
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
                        Voluntary
                      </span>
                    )}

                    {/* Admin Action Controls */}
                    {adminMode && (
                      <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
                        <button
                          onClick={() => handleEdit(std)}
                          className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit this Standard"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(std.id, std.code)}
                          className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete this Standard"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {std.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                    {std.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                    {std.scheme}
                  </span>
                </div>
              </div>

              {/* Expand/Collapse Trigger */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  id={`accordion-btn-${std.id}`}
                  onClick={() => toggleExpand(std.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0f2b48] hover:text-[#ea580c] transition-colors"
                >
                  <span>{isExpanded ? 'Hide Certification Checklist' : 'View 4-Step Certification Checklist'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleAskAboutStandard(std)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#ea580c] hover:text-[#c2410c] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>

              {/* Expandable Accordion Content */}
              {isExpanded && (
                <div className="p-5 bg-orange-50/20 border-t border-slate-200 space-y-4 animate-in fade-in duration-200 text-xs">
                  {/* Scope */}
                  <div>
                    <h3 className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                      Applicable Scope & Coverage:
                    </h3>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      {std.scope?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Certification Procedure Steps */}
                  <div>
                    <h3 className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                      Step-by-Step Certification Workflow:
                    </h3>
                    <div className="space-y-2">
                      {std.certificationSteps?.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                          <span className="w-4 h-4 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700 leading-tight">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents & MSME Rebate */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800 block mb-1">Key Documents:</span>
                      <ul className="list-disc pl-3 text-slate-600 space-y-0.5">
                        {std.keyDocuments?.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="font-semibold text-emerald-800 block mb-1">MSME & Startup Benefits:</span>
                      <p className="text-slate-600">{std.msmeBenefits}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredStandards.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No Indian Standards matched your search criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setMandatoryOnly(false);
            }}
            className="mt-3 text-xs font-semibold text-[#ea580c] hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* Edit / Create Standard Modal */}
      <StandardEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={saveStandard}
        initialData={editingStandard}
      />
    </div>
  );
};

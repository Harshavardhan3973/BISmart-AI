import React, { useState } from 'react';
import { IndianStandard } from '../types';
import { X, Plus, Save, AlertCircle } from 'lucide-react';

interface StandardEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (std: IndianStandard) => Promise<void>;
  initialData?: IndianStandard | null;
}

export const StandardEditModal: React.FC<StandardEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [code, setCode] = useState(initialData?.code || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<any>(initialData?.category || 'Electronics');
  const [mandatory, setMandatory] = useState(initialData?.mandatory ?? true);
  const [qcoNotification, setQcoNotification] = useState(initialData?.qcoNotification || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [scheme, setScheme] = useState(initialData?.scheme || 'Scheme-I (Mandatory ISI Mark Certification)');
  const [scopeText, setScopeText] = useState(initialData?.scope?.join('\n') || '');
  const [stepsText, setStepsText] = useState(initialData?.certificationSteps?.join('\n') || '');
  const [documentsText, setDocumentsText] = useState(initialData?.keyDocuments?.join('\n') || '');
  const [msmeBenefits, setMsmeBenefits] = useState(initialData?.msmeBenefits || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim() || !description.trim()) {
      setError('Please provide standard code, title, and description.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const id = initialData?.id || `is-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

    const newStandard: IndianStandard = {
      id,
      code: code.trim(),
      title: title.trim(),
      category,
      mandatory,
      qcoNotification: qcoNotification.trim() || undefined,
      description: description.trim(),
      scheme: scheme.trim(),
      scope: scopeText.split('\n').map(s => s.trim()).filter(Boolean),
      certificationSteps: stepsText.split('\n').map(s => s.trim()).filter(Boolean),
      keyDocuments: documentsText.split('\n').map(s => s.trim()).filter(Boolean),
      msmeBenefits: msmeBenefits.trim() || 'Standard MSME fee concessions applicable under BIS guidelines.'
    };

    try {
      await onSave(newStandard);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save standard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              {initialData ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold font-serif-heading">
                {initialData ? `Edit Standard: ${initialData.code}` : 'Add New Indian Standard'}
              </h3>
              <p className="text-xs text-slate-400">
                Changes will be saved to Firestore and immediately visible to public users
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Standard Code (e.g. IS 16102)</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="IS 1234:2024"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Food & Water">Food & Water</option>
                <option value="Toys">Toys</option>
                <option value="Precious Metals">Precious Metals</option>
                <option value="Construction">Construction</option>
                <option value="Textiles">Textiles</option>
                <option value="Chemicals">Chemicals</option>
                <option value="Renewable Energy">Renewable Energy</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Standard Title / Product Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Safety Specification for Self-Ballasted LED Lamps"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Conformity Scheme</label>
              <input
                type="text"
                required
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
                placeholder="e.g. Scheme-I (ISI Mark) or Scheme-II (CRS)"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Quality Control Order (QCO) Reference</label>
              <input
                type="text"
                value={qcoNotification}
                onChange={(e) => setQcoNotification(e.target.value)}
                placeholder="e.g. Electronics & IT Goods (Compulsory Registration Order)"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="mandatory-check"
              checked={mandatory}
              onChange={(e) => setMandatory(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="mandatory-check" className="font-medium text-slate-700">
              Mandatory QCO certification (Non-compliance prohibits sales in India)
            </label>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Description & Regulatory Intent</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of technical requirements, safety boundaries, and applicability..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Certification Steps (1 per line)</label>
            <textarea
              rows={3}
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              placeholder="Sample Submission: Send product models to BIS lab...&#10;Test Report Evaluation: Receive test report proving compliance...&#10;Online Filing: Apply on Manakonline under Scheme-II..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Key Required Documents (1 per line)</label>
            <textarea
              rows={2}
              value={documentsText}
              onChange={(e) => setDocumentsText(e.target.value)}
              placeholder="Laboratory Test Report&#10;Brand / Trademark Authorization Certificate&#10;Manufacturing unit layout"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">MSME & Startup Concessions</label>
            <input
              type="text"
              value={msmeBenefits}
              onChange={(e) => setMsmeBenefits(e.target.value)}
              placeholder="e.g. 50% concession on minimum annual marking fees for Micro units."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{initialData ? 'Update Standard' : 'Save Standard'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

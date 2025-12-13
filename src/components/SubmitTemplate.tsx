import { useState } from 'react';
import { X } from 'lucide-react';
import { submitContent } from '../utils/api';
import { showToast, validateRequired, handleNetworkError } from '../utils/errorHandling';

interface SubmitTemplateProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitTemplate({ onClose, onSuccess }: SubmitTemplateProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Bug Report');
  const [template, setTemplate] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const validationError = validateRequired({ title, category, template });
    if (validationError) {
      setError(validationError);
      showToast({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);

    try {
      const data = {
        title,
        category,
        template,
        repoLink,
      };

      await submitContent('template', data, submittedBy || 'Anonymous');
      showToast({ type: 'success', message: 'Template submitted successfully! It will appear after admin approval.' });
      onSuccess();
    } catch (err: any) {
      const errorMsg = handleNetworkError(err);
      setError(errorMsg);
      showToast({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b border-slate-200">
          <h2 className="text-slate-900">Submit Template</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Template Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Bug Report Template"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="Bug Report">Bug Report</option>
              <option value="Triage">Triage</option>
              <option value="Planning">Planning</option>
              <option value="Checklist">Checklist</option>
              <option value="Reporting">Reporting</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Template Content *</label>
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Enter your template content in markdown format..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              rows={15}
              required
            />
            <p className="text-slate-500 text-xs mt-1">
              Use markdown formatting for best results
            </p>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">GitHub Repository Link (optional)</label>
            <input
              type="url"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-slate-500 text-xs mt-1">
              Link to a GitHub repository with this template (if applicable)
            </p>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Your Name (optional)</label>
            <input
              type="text"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
              placeholder="Anonymous"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Template'}
          </button>
        </form>
      </div>
    </div>
  );
}

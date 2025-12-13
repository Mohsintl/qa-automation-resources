import { useState } from 'react';
import { X } from 'lucide-react';
import { submitContent } from '../utils/api';
import { showToast, validateRequired, handleNetworkError } from '../utils/errorHandling';

interface SubmitBoilerplateProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitBoilerplate({ onClose, onSuccess }: SubmitBoilerplateProps) {
  const [title, setTitle] = useState('');
  const [framework, setFramework] = useState('');
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [code, setCode] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const validationError = validateRequired({ title, framework, language, description, code });
    if (validationError) {
      setError(validationError);
      showToast({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);

    try {
      const data = {
        title,
        framework,
        language,
        description,
        repoLink,
        code,
      };

      await submitContent('boilerplate', data, submittedBy || 'Anonymous');
      showToast({ type: 'success', message: 'Boilerplate submitted successfully! It will appear after admin approval.' });
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
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b border-slate-200 z-10">
          <h2 className="text-slate-900">Submit Boilerplate</h2>
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
            <label className="block text-slate-700 mb-2 text-sm">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Selenium Java TestNG Boilerplate"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Framework *</label>
              <input
                type="text"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                placeholder="e.g., Selenium, Playwright, Cypress"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2 text-sm">Language *</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., Java, TypeScript, Python"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this boilerplate and what it includes..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Repository Link (optional)</label>
            <input
              type="url"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Code/Setup Instructions *</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your boilerplate code, setup instructions, or configuration files..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              rows={15}
              required
            />
            <p className="text-slate-500 text-xs mt-1">
              Include setup instructions, dependencies, and example code
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
            {loading ? 'Submitting...' : 'Submit Boilerplate'}
          </button>
        </form>
      </div>
    </div>
  );
}

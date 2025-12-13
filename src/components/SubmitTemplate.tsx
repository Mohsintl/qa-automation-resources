import { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
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

  // Character limits
  const TITLE_MAX = 100;

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
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-template-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 z-10 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 id="submit-template-title" className="text-xl font-semibold">
              Submit Template
            </h2>
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              type="button"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">
            Share your testing templates with the community
          </p>
        </div>

        <div className="p-6">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3" role="alert">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium text-sm">Submission Error</p>
                <p className="text-red-700 text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-slate-900 mb-3">Template Information</legend>
          <div>
            <label htmlFor="title" className="block text-slate-700 mb-2 text-sm font-medium">Template Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
              placeholder="e.g., Bug Report Template"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-slate-500 text-xs">A clear, descriptive title</p>
              <span className={`text-xs ${title.length >= TITLE_MAX ? 'text-red-600' : 'text-slate-400'}`}>
                {title.length}/{TITLE_MAX}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-slate-700 mb-2 text-sm font-medium">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label htmlFor="template" className="block text-slate-700 mb-2 text-sm font-medium">Template Content *</label>
            <textarea
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Enter your template content in markdown format...\n\n## Example:\n**Title:** [Brief description]\n\n**Steps:**\n1. Step one\n2. Step two"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
              rows={15}
              required
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-slate-500 text-xs">💡 Use markdown formatting for best results</p>
              <span className="text-xs text-slate-400">{template.length} characters</span>
            </div>
          </div>

          <div>
            <label htmlFor="repoLink" className="block text-slate-700 mb-2 text-sm font-medium">GitHub Repository Link (optional)</label>
            <input
              id="repoLink"
              type="url"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-slate-500 text-xs mt-1">
              🔗 Link to a repository with this template (if applicable)
            </p>
          </div>

          <div>
            <label htmlFor="submittedBy" className="block text-slate-700 mb-2 text-sm font-medium">Your Name (optional)</label>
            <input
              id="submittedBy"
              type="text"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
              placeholder="Your name or Anonymous"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-slate-500 text-xs mt-1">
              Leave blank to submit anonymously
            </p>
          </div>
          </fieldset>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white pt-6 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Template'
              )}
            </button>
            <p className="text-center text-slate-500 text-xs mt-3">
              Your submission will be reviewed before being published
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { X } from 'lucide-react';
import { submitContent } from '../utils/api';
import { showToast, validateRequired, handleNetworkError } from '../utils/errorHandling';

interface SubmitTestScriptProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitTestScript({ onClose, onSuccess }: SubmitTestScriptProps) {
  const [app, setApp] = useState('');
  const [framework, setFramework] = useState('Selenium (Java)');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const validationError = validateRequired({ app, framework, title, description, language, code });
    if (validationError) {
      setError(validationError);
      showToast({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);

    try {
      const data = {
        app,
        framework,
        title,
        description,
        language,
        code,
      };

      await submitContent('testscript', data, submittedBy || 'Anonymous');
      showToast({ type: 'success', message: 'Test script submitted successfully! It will appear after admin approval.' });
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
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b border-slate-200 z-10">
          <h2 className="text-slate-900">Submit Test Script</h2>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Application Name *</label>
              <input
                type="text"
                value={app}
                onChange={(e) => setApp(e.target.value)}
                placeholder="e.g., Google Search, Amazon"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2 text-sm">Framework *</label>
              <input
                type="text"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                placeholder="e.g., Selenium (Java), Playwright (TypeScript)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Script Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Automated Search Test"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Description *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this script tests"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Programming Language *</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="csharp">C#</option>
              <option value="ruby">Ruby</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Code *</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your complete test script code here..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              rows={20}
              required
            />
            <p className="text-slate-500 text-xs mt-1">
              Please include comments in your code to help others understand it
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
            {loading ? 'Submitting...' : 'Submit Test Script'}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { submitContent } from '../utils/api';

interface SubmitTestCaseProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitTestCase({ onClose, onSuccess }: SubmitTestCaseProps) {
  const [app, setApp] = useState('');
  const [category, setCategory] = useState('');
  const [testCases, setTestCases] = useState([{
    id: 'TC001',
    title: '',
    priority: 'High',
    preconditions: '',
    steps: [''],
    expected: ''
  }]);
  const [submittedBy, setSubmittedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function addTestCase() {
    const newId = `TC${String(testCases.length + 1).padStart(3, '0')}`;
    setTestCases([...testCases, {
      id: newId,
      title: '',
      priority: 'High',
      preconditions: '',
      steps: [''],
      expected: ''
    }]);
  }

  function addStep(tcIndex: number) {
    const newTestCases = [...testCases];
    newTestCases[tcIndex].steps.push('');
    setTestCases(newTestCases);
  }

  function updateTestCase(index: number, field: string, value: any) {
    const newTestCases = [...testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setTestCases(newTestCases);
  }

  function updateStep(tcIndex: number, stepIndex: number, value: string) {
    const newTestCases = [...testCases];
    newTestCases[tcIndex].steps[stepIndex] = value;
    setTestCases(newTestCases);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        app,
        category,
        cases: testCases.filter(tc => tc.title && tc.expected)
      };

      await submitContent('testcase', data, submittedBy || 'Anonymous');
      alert('Test case submitted successfully! It will appear after admin approval.');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b border-slate-200 z-10">
          <h2 className="text-slate-900">Submit Test Cases</h2>
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
                placeholder="e.g., Google, Amazon, Netflix"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2 text-sm">Category *</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., E-commerce, Social Media"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
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

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-slate-700">Test Cases</label>
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" /> Add Test Case
              </button>
            </div>

            <div className="space-y-6">
              {testCases.map((tc, tcIdx) => (
                <div key={tcIdx} className="bg-slate-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1 text-xs">Test Case ID</label>
                      <input
                        type="text"
                        value={tc.id}
                        onChange={(e) => updateTestCase(tcIdx, 'id', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-600 mb-1 text-xs">Title *</label>
                      <input
                        type="text"
                        value={tc.title}
                        onChange={(e) => updateTestCase(tcIdx, 'title', e.target.value)}
                        placeholder="Test case title"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 text-xs">Priority</label>
                    <select
                      value={tc.priority}
                      onChange={(e) => updateTestCase(tcIdx, 'priority', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    >
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 text-xs">Preconditions</label>
                    <input
                      type="text"
                      value={tc.preconditions}
                      onChange={(e) => updateTestCase(tcIdx, 'preconditions', e.target.value)}
                      placeholder="What needs to be true before testing"
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 text-xs">Steps to Execute</label>
                    {tc.steps.map((step, stepIdx) => (
                      <input
                        key={stepIdx}
                        type="text"
                        value={step}
                        onChange={(e) => updateStep(tcIdx, stepIdx, e.target.value)}
                        placeholder={`Step ${stepIdx + 1}`}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm mb-2"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => addStep(tcIdx)}
                      className="text-indigo-600 hover:text-indigo-700 text-xs"
                    >
                      + Add step
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 text-xs">Expected Result *</label>
                    <textarea
                      value={tc.expected}
                      onChange={(e) => updateTestCase(tcIdx, 'expected', e.target.value)}
                      placeholder="What should happen"
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Test Cases'}
          </button>
        </form>
      </div>
    </div>
  );
}

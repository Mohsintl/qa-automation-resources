import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { submitContent } from '../utils/api';
import { siteConfig } from '../config';

interface SubmitCheatSheetProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitCheatSheet({ onClose, onSuccess }: SubmitCheatSheetProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('automation');
  const [tags, setTags] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [sections, setSections] = useState(
    siteConfig.submissionTemplates[category as keyof typeof siteConfig.submissionTemplates] || 
    [{ title: '', items: [{ code: '', description: '' }] }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleCategoryChange(newCategory: string) {
    setCategory(newCategory);
    // Update sections based on category
    const templates = siteConfig.submissionTemplates[newCategory as keyof typeof siteConfig.submissionTemplates];
    setSections(templates || [{ title: '', items: [{ code: '', description: '' }] }]);
  }

  function addSection() {
    setSections([...sections, { title: '', items: [{ code: '', description: '' }] }]);
  }

  function removeSection(index: number) {
    if (sections.length > 1) {
      const newSections = sections.filter((_, i) => i !== index);
      setSections(newSections);
    }
  }

  function addItem(sectionIndex: number) {
    const newSections = [...sections];
    newSections[sectionIndex].items.push({ code: '', description: '' });
    setSections(newSections);
  }

  function removeItem(sectionIndex: number, itemIndex: number) {
    const newSections = [...sections];
    if (newSections[sectionIndex].items.length > 1) {
      newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
      setSections(newSections);
    }
  }

  function updateSection(index: number, field: string, value: string) {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  }

  function updateItem(sectionIndex: number, itemIndex: number, field: string, value: string) {
    const newSections = [...sections];
    newSections[sectionIndex].items[itemIndex] = {
      ...newSections[sectionIndex].items[itemIndex],
      [field]: value
    };
    setSections(newSections);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        title,
        description,
        category,
        tags: tags.split(',').map(t => t.trim()),
        sections: sections.filter(s => s.title && s.items.some(i => i.description)),
      };

      await submitContent('cheatsheet', data, submittedBy || 'Anonymous');
      alert('Cheat sheet submitted successfully! It will appear after admin approval.');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b border-slate-200 z-10">
          <h2 className="text-slate-900">Submit Cheat Sheet</h2>
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Category *</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="automation">Automation</option>
                <option value="strategy">QA Strategy</option>
                <option value="api">API Testing</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
              </select>
              <p className="text-slate-500 text-xs mt-1">Sections will update based on category</p>
            </div>

            <div>
              <label className="block text-slate-700 mb-2 text-sm">Tags (comma separated) *</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Selenium, Java, Testing"
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
              <label className="block text-slate-700">Sections</label>
              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" /> Add Section
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="bg-slate-50 p-4 rounded-lg space-y-3 relative">
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIdx)}
                      className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 rounded transition-colors"
                      title="Remove section"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                  
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(sectionIdx, 'title', e.target.value)}
                    placeholder="Section title (e.g., Basic Commands)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="bg-white p-3 rounded border border-slate-200 space-y-2 relative">
                      {section.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(sectionIdx, itemIdx)}
                          className="absolute top-2 right-2 p-1 hover:bg-red-50 rounded transition-colors"
                          title="Remove item"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>
                      )}
                      
                      <input
                        type="text"
                        value={item.code}
                        onChange={(e) => updateItem(sectionIdx, itemIdx, 'code', e.target.value)}
                        placeholder="Code example (optional)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(sectionIdx, itemIdx, 'description', e.target.value)}
                        placeholder="Description *"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addItem(sectionIdx)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add item to this section
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Cheat Sheet'}
          </button>
        </form>
      </div>
    </div>
  );
}
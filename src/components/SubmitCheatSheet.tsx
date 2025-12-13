import { useState } from 'react';
import { X, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { submitContent } from '../utils/api';
import { siteConfig } from '../config';
import { showToast, validateRequired, handleNetworkError } from '../utils/errorHandling';

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Character limits
  const TITLE_MAX = 100;
  const DESC_MAX = 200;

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

    // Validate required fields
    const validationError = validateRequired({ title, description, category });
    if (validationError) {
      setError(validationError);
      showToast({ type: 'error', message: validationError });
      return;
    }

    // Validate sections
    const validSections = sections.filter(s => s.title && s.items.some(i => i.description || i.code));
    if (validSections.length === 0) {
      const msg = 'Please add at least one section with content';
      setError(msg);
      showToast({ type: 'error', message: msg });
      return;
    }

    setLoading(true);

    try {
      const data = {
        title,
        description,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        sections: validSections,
      };

      await submitContent('cheatsheet', data, submittedBy || 'Anonymous');
      
      showToast({ 
        type: 'success', 
        message: 'Cheat sheet submitted successfully! It will appear after admin approval.' 
      });
      
      onSuccess();
    } catch (err: any) {
      const errorMsg = handleNetworkError(err);
      setError(errorMsg);
      showToast({ type: 'error', message: errorMsg });
      console.error('Submission error:', err);
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
      aria-labelledby="submit-cheatsheet-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 z-10 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 id="submit-cheatsheet-title" className="text-xl font-semibold">
              Submit Cheat Sheet
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
          <p className="text-indigo-100 text-sm mt-1">
            Share your testing knowledge with the community
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
            {/* Basic Information Section */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-slate-900 mb-3">Basic Information</legend>
              
              <div>
                <label htmlFor="title" className="block text-slate-700 mb-2 text-sm font-medium">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    fieldErrors.title 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-slate-300 focus:ring-indigo-500'
                  }`}
                  placeholder="e.g., Selenium WebDriver Commands"
                  required
                  aria-invalid={!!fieldErrors.title}
                  aria-describedby="title-error title-hint"
                />
                <div className="flex justify-between items-center mt-1">
                  <p id="title-hint" className="text-slate-500 text-xs">
                    A clear, descriptive title for your cheat sheet
                  </p>
                  <span className={`text-xs ${title.length >= TITLE_MAX ? 'text-red-600' : 'text-slate-400'}`}>
                    {title.length}/{TITLE_MAX}
                  </span>
                </div>
                {fieldErrors.title && (
                  <p id="title-error" className="text-red-600 text-xs mt-1">{fieldErrors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-slate-700 mb-2 text-sm font-medium">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                    fieldErrors.description 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-slate-300 focus:ring-indigo-500'
                  }`}
                  placeholder="Brief overview of what this cheat sheet covers..."
                  rows={3}
                  required
                  aria-invalid={!!fieldErrors.description}
                  aria-describedby="description-hint"
                />
                <div className="flex justify-between items-center mt-1">
                  <p id="description-hint" className="text-slate-500 text-xs">
                    What will users learn from this cheat sheet?
                  </p>
                  <span className={`text-xs ${description.length >= DESC_MAX ? 'text-red-600' : 'text-slate-400'}`}>
                    {description.length}/{DESC_MAX}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-slate-700 mb-2 text-sm font-medium">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="automation">Automation</option>
                    <option value="strategy">QA Strategy</option>
                    <option value="api">API Testing</option>
                    <option value="performance">Performance</option>
                    <option value="security">Security</option>
                  </select>
                  <p className="text-slate-500 text-xs mt-1">
                    📋 Sections will update based on category
                  </p>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-slate-700 mb-2 text-sm font-medium">
                    Tags *
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Selenium, Java, Testing"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    aria-describedby="tags-hint"
                  />
                  <p id="tags-hint" className="text-slate-500 text-xs mt-1">
                    Separate tags with commas
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="submittedBy" className="block text-slate-700 mb-2 text-sm font-medium">
                  Your Name (optional)
                </label>
                <input
                  id="submittedBy"
                  type="text"
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                  placeholder="Your name or Anonymous"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-slate-500 text-xs mt-1">
                  Leave blank to submit anonymously
                </p>
              </div>
            </fieldset>

            {/* Sections */}
            <fieldset className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <legend className="text-lg font-semibold text-slate-900">Content Sections</legend>
                <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                aria-label="Add new section"
              >
                <Plus className="w-4 h-4" /> Add Section
              </button>
            </div>

            <div className="space-y-5">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4 relative group">
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIdx)}
                      className="absolute top-3 right-3 p-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Remove section"
                      aria-label={`Remove section ${sectionIdx + 1}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                  
                  <div>
                    <label htmlFor={`section-title-${sectionIdx}`} className="sr-only">
                      Section {sectionIdx + 1} Title
                    </label>
                    <input
                      id={`section-title-${sectionIdx}`}
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIdx, 'title', e.target.value)}
                      placeholder={`Section ${sectionIdx + 1}: e.g., Basic Commands`}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="bg-white p-4 rounded-lg border border-slate-200 space-y-3 relative group/item hover:border-indigo-200 transition-colors">
                        {section.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(sectionIdx, itemIdx)}
                            className="absolute top-2 right-2 p-1 hover:bg-red-50 rounded transition-all opacity-0 group-hover/item:opacity-100"
                            title="Remove item"
                            aria-label={`Remove item ${itemIdx + 1} from section ${sectionIdx + 1}`}
                          >
                            <X className="w-3.5 h-3.5 text-red-600" />
                          </button>
                        )}
                        
                        <div>
                          <label htmlFor={`code-${sectionIdx}-${itemIdx}`} className="block text-slate-600 text-xs font-medium mb-1">
                            Code Example (optional)
                          </label>
                          <input
                            id={`code-${sectionIdx}-${itemIdx}`}
                            type="text"
                            value={item.code}
                            onChange={(e) => updateItem(sectionIdx, itemIdx, 'code', e.target.value)}
                            placeholder="driver.findElement(By.id('submit'))"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm bg-slate-50"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor={`desc-${sectionIdx}-${itemIdx}`} className="block text-slate-600 text-xs font-medium mb-1">
                            Description *
                          </label>
                          <input
                            id={`desc-${sectionIdx}-${itemIdx}`}
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(sectionIdx, itemIdx, 'description', e.target.value)}
                            placeholder="Explain what this code does..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addItem(sectionIdx)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add item to this section
                  </button>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white pt-6 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Cheat Sheet'
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
/**
 * Component for displaying individual cheat sheet cards with expandable details.
 * Features copy-to-clipboard functionality and responsive design.
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Copy, Check } from 'lucide-react';
import type { CheatSheet } from '../data/cheatSheets';

/**
 * Props for the CheatSheetCard component.
 */
interface CheatSheetCardProps {
  sheet: CheatSheet;
}

/**
 * Renders a cheat sheet card with expandable content and copy functionality.
 * @param sheet - The cheat sheet data to display
 */
export function CheatSheetCard({ sheet }: CheatSheetCardProps) {
  // State for expansion and copy feedback
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  /**
   * Copies code to clipboard and shows feedback.
   * @param code - The code string to copy
   * @param id - Unique identifier for the code block
   */
  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      // Reset copy feedback after 2 seconds
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-indigo-200">
      <div className="p-6">
        {/* Header section with icon and title */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-lg ${sheet.color} shadow-sm`} aria-hidden="true">
            {sheet.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl text-slate-900 font-semibold mb-1 leading-tight">{sheet.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{sheet.description}</p>
          </div>
        </div>

        {/* Tags section */}
        <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Tags">
          {sheet.tags.map(tag => (
            <span
              key={tag}
              role="listitem"
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Expand/collapse toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all duration-200 text-slate-700 font-medium shadow-sm"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Hide cheat sheet details' : 'View cheat sheet details'}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              View Cheat Sheet
            </>
          )}
        </button>

        {/* Expanded content section */}
        {isExpanded && (
          <div className="overflow-hidden transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-top-2 mt-4">
            <div className="pt-4 border-t border-slate-200 space-y-6">
              {/* Render each section of the cheat sheet */}
              {sheet.sections.map((section, sectionIdx) => (
                <section key={`section-${sectionIdx}`}>
                  <h4 className="text-base text-slate-900 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
                    {section.title}
                  </h4>
                  <ul className="space-y-3" role="list">
                    {/* Render each item in the section */}
                    {section.items.map((item, itemIdx) => {
                      const codeId = `code-${sectionIdx}-${itemIdx}`;
                      return (
                        <li key={`item-${itemIdx}`} className="text-slate-600 text-sm">
                          {item.code ? (
                            // Code block with copy button
                            <div className="relative group bg-slate-50 p-3 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors">
                              <button
                                onClick={() => copyToClipboard(item.code!, codeId)}
                                className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Copy code to clipboard"
                                title="Copy code"
                              >
                                {copiedCode === codeId ? (
                                  <Check className="w-3.5 h-3.5 text-green-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                                )}
                              </button>
                              <pre className="font-mono text-xs overflow-x-auto pr-8">
                                <code className="text-indigo-600">{item.code}</code>
                              </pre>
                              {item.description && (
                                <p className="text-slate-600 mt-2 font-sans text-xs leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          ) : (
                            // Plain text item
                            <div className="flex items-start gap-2 py-1">
                              <span className="text-indigo-500 mt-0.5 shrink-0 font-bold">•</span>
                              <span className="leading-relaxed">{item.description}</span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}

              {/* Resources section */}
              {sheet.resources && sheet.resources.length > 0 && (
                <section className="pt-4 border-t border-slate-200">
                  <h4 className="text-base text-slate-900 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
                    Resources
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {sheet.resources.map((resource, idx) => (
                      <a
                        key={`resource-${idx}`}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors border border-indigo-100"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {resource.label}
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { CheatSheet } from '../data/cheatSheets';

interface CheatSheetCardProps {
  sheet: CheatSheet;
}

export function CheatSheetCard({ sheet }: CheatSheetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header with icon and title */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${sheet.color}`}>
              {sheet.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 font-semibold">{sheet.title}</h3>
              <p className="text-slate-500 text-sm">{sheet.description}</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {sheet.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Toggle button for details */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-slate-700 font-medium"
          aria-expanded={isExpanded}
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

        {/* Expanded details section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
            {sheet.sections.map((section, sectionIdx) => (
              <div key={`section-${sectionIdx}`}>
                <h4 className="text-slate-900 font-semibold mb-2">{section.title}</h4>
                <ul className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <li key={`item-${itemIdx}`} className="text-slate-600 text-sm">
                      {item.code ? (
                        <div className="bg-slate-50 p-2 rounded border border-slate-200 font-mono text-xs overflow-x-auto">
                          <code className="text-indigo-600">{item.code}</code>
                          {item.description && (
                            <p className="text-slate-500 mt-1 font-sans text-xs">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-0.5 shrink-0">•</span>
                          <span>{item.description}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Resources section */}
            {sheet.resources && sheet.resources.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-slate-900 font-semibold mb-2">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {sheet.resources.map((resource, idx) => (
                    <a
                      key={`resource-${idx}`}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {resource.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

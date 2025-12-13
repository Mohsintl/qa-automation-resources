import { CheatSheetCard } from './CheatSheetCard';
import { cheatSheets } from '../data/cheatSheets';
import { SubmitCheatSheet } from './SubmitCheatSheet';
import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { getApprovedContent } from '../utils/api';
import { siteConfig } from '../config';
import { LoadingSkeleton } from './ui/loading-skeleton';
import type { CheatSheet } from '../data/cheatSheets';

interface CheatSheetGridProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
}

export function CheatSheetGrid({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
}: CheatSheetGridProps) {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [allSheets, setAllSheets] = useState<CheatSheet[]>(cheatSheets);
  const [loading, setLoading] = useState(true);

  // Load approved user-submitted cheat sheets on mount
  useEffect(() => {
    loadApprovedContent();

    // Listen for global content updates triggered from AdminPanel
    const onContentUpdated = () => loadApprovedContent();
    window.addEventListener('content-updated', onContentUpdated);
    return () => window.removeEventListener('content-updated', onContentUpdated);
  }, []);

  /**
   * Fetch user-submitted cheat sheets that have been approved.
   */
  async function loadApprovedContent(): Promise<void> {
    try {
      setLoading(true);
      const data = await getApprovedContent('cheatsheet');
      const approvedSheets = (data.items || []).map((item: any, index: number) => ({
        ...item,
        // Ensure unique IDs for approved items to prevent React key conflicts
        id: item.id || `approved-${index}-${Date.now()}`,
      }));
      setAllSheets([...cheatSheets, ...approvedSheets]);
    } catch (error) {
      console.error('Failed to load approved cheat sheets:', error);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Filter cheat sheets by category and search query.
   * Memoized to avoid unnecessary re-computation.
   */
  const filteredSheets = useMemo(() => {
    return allSheets.filter(sheet => {
      const categoryMatch = selectedCategory === 'all' || sheet.category === selectedCategory;
      const searchQuery_lower = searchQuery.toLowerCase();

      const searchMatch =
        !searchQuery ||
        sheet.title.toLowerCase().includes(searchQuery_lower) ||
        sheet.description.toLowerCase().includes(searchQuery_lower) ||
        sheet.tags.some(tag => tag.toLowerCase().includes(searchQuery_lower));

      return categoryMatch && searchMatch;
    });
  }, [allSheets, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with submit button */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Cheat Sheets</h2>
        <button
          onClick={() => setShowSubmitForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Submit
        </button>
      </div>

      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {siteConfig.categories.cheatsheet.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-all font-medium ${
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
            aria-pressed={selectedCategory === category.id}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading ? (
        <>
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton variant="card" count={6} />
          </div>
        </>
      ) : (
        <>
          {/* Results counter */}
          <p className="text-slate-600 mb-6 text-sm">
            {filteredSheets.length} cheat sheet{filteredSheets.length !== 1 ? 's' : ''}
          </p>

          {/* Cheat sheets grid */}
          {filteredSheets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSheets.map(sheet => (
                <CheatSheetCard key={sheet.id} sheet={sheet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500 text-lg mb-2">No cheat sheets found</p>
              <p className="text-slate-400 text-sm">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </>
      )}

      {/* Submit Form Modal */}
      {showSubmitForm && (
        <SubmitCheatSheet
          onClose={() => setShowSubmitForm(false)}
          onSuccess={() => {
            setShowSubmitForm(false);
            loadApprovedContent();
          }}
        />
      )}
    </div>
  );
}
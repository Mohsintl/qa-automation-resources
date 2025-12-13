import { Search } from 'lucide-react';
import { siteConfig } from '../config';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Hero({ searchQuery, setSearchQuery }: HeroProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-20 px-4 border-b border-slate-200">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {siteConfig.hero.title}
        </h1>
        <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          {siteConfig.description}
        </p>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={siteConfig.hero.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-slate-900 placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 hover:border-indigo-300 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

import { Search } from 'lucide-react';
import { siteConfig } from '../config';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Hero({ searchQuery, setSearchQuery }: HeroProps) {
  return (
    <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-4">{siteConfig.hero.title}</h2>
        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
          {siteConfig.description}
        </p>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={siteConfig.hero.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-slate-900 placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>
    </div>
  );
}

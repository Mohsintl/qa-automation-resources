import { Heart } from 'lucide-react';
import { siteConfig } from '../config';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by QA professionals, for QA professionals
          </p>
          <p className="text-slate-500 text-sm">
            © {siteConfig.currentYear} {siteConfig.companyName}. All cheat sheets are for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}

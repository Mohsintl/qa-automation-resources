import { BookOpen, Github, FileText, TestTube, Code, Shield } from 'lucide-react';
import { siteConfig } from '../config';

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  TestTube: <TestTube className="w-4 h-4" />,
  Code: <Code className="w-4 h-4" />,
};

export type SectionType = 'home' | 'about' | 'contact' | 'admin'; // example

type HeaderProps = {
  activeSection: SectionType;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionType>>;
  isAdmin: boolean;
  onAdminClick: () => void;
};

export function Header({
  activeSection,
  setActiveSection,
  isAdmin,
  onAdminClick,
}: HeaderProps) {
  const navItems = siteConfig.navigation.map(item => ({
    ...item,
    icon: iconMap[item.icon] || <BookOpen className="w-4 h-4" />,
  }));

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900">{siteConfig.title}</h1>
              <p className="text-slate-600 text-sm">{siteConfig.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <button
                onClick={() => setActiveSection('admin')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span className="hidden sm:inline">Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Login</span>
              </button>
            )}
            <a 
              href={siteConfig.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">Contribute</span>
            </a>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex gap-2 overflow-x-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeSection === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
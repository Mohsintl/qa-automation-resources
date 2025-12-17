/**
 * Main application component for the QA Automation Resource Website.
 * Manages global state, authentication, and renders the main layout.
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CheatSheetGrid } from './components/CheatSheetGrid';
import { TemplatesAndBoilerplates } from './components/TemplatesAndBoilerplates';
import { TestCases } from './components/TestCases';
import { TestScripts } from './components/TestScripts';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { Footer } from './components/Footer';
import { getSession, isAdmin } from './utils/auth';
import type { User } from '@supabase/supabase-js';

/**
 * Type definition for navigation sections.
 */
type SectionType = 'cheatsheets' | 'templates' | 'testcases' | 'testscripts' | 'admin';

/**
 * Props interface for the Header component.
 */
interface HeaderProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  isAdmin: boolean;
  onAdminClick: () => void;
}

/**
 * Root application component.
 * Handles authentication, section navigation, and conditional rendering.
 */
export default function App() {
  // State for filtering and search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // State for navigation and authentication
  const [activeSection, setActiveSection] = useState<SectionType>('cheatsheets');
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Verify current user's authentication status and admin privileges.
   */
  async function checkAuth(): Promise<void> {
    try {
      const session = await getSession();
      if (session?.user) {
        setUser(session.user);
        const hasAdminPrivileges = await isAdmin(session.user);
        setIsAdminUser(hasAdminPrivileges);
      }
    } catch (error) {
      console.error('Failed to check authentication:', error);
    }
  }

  /**
   * Handle successful authentication and hide login modal.
   */
  function handleAuthChange(): void {
    checkAuth();
    setShowAdminLogin(false);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Navigation header */}
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isAdmin={isAdminUser}
        onAdminClick={() => setShowAdminLogin(true)}
      />

      {/* Hero section with search */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Admin login modal */}
      {showAdminLogin && !user && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onSuccess={handleAuthChange}
        />
      )}

      {/* Main content sections */}
      {activeSection === 'cheatsheets' && (
        <CheatSheetGrid
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
        />
      )}

      {activeSection === 'templates' && <TemplatesAndBoilerplates searchQuery={searchQuery} />}

      {activeSection === 'testcases' && <TestCases searchQuery={searchQuery} />}

      {activeSection === 'testscripts' && <TestScripts searchQuery={searchQuery} />}

      {/* Admin panel - only for authenticated admins */}
      {activeSection === 'admin' && isAdminUser && user && (
        <AdminPanel user={user} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
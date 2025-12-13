/**
 * Site Configuration
 * All configurable values for the application
 */

export const siteConfig = {
  // Branding
  title: import.meta.env.VITE_SITE_TITLE || 'Testers Playbook',
  tagline: import.meta.env.VITE_SITE_TAGLINE || 'Your QA & Automation Reference',
  description: import.meta.env.VITE_SITE_DESCRIPTION || 'Comprehensive cheat sheets for test automation frameworks, QA strategies, best practices, and essential tools.',
  companyName: import.meta.env.VITE_COMPANY_NAME || 'Testers Playbook',
  currentYear: parseInt(import.meta.env.VITE_CURRENT_YEAR || '2025'),

  // Hero Section
  hero: {
    title: import.meta.env.VITE_HERO_TITLE || 'Quick Reference for QA Professionals',
    searchPlaceholder: 'Search cheat sheets...',
  },

  // External Links
  github: import.meta.env.VITE_GITHUB_URL || 'https://github.com',

  // Navigation
  navigation: [
    { id: 'cheatsheets', label: 'Cheat Sheets', icon: 'BookOpen' },
    { id: 'templates', label: 'Templates & Boilerplates', icon: 'FileText' },
    { id: 'testcases', label: 'Test Cases', icon: 'TestTube' },
    { id: 'testscripts', label: 'Test Scripts', icon: 'Code' },
  ],

  // Content Categories
  categories: {
    cheatsheet: [
      { id: 'all', label: 'All' },
      { id: 'automation', label: 'Automation' },
      { id: 'strategy', label: 'QA Strategy' },
      { id: 'api', label: 'API Testing' },
      { id: 'performance', label: 'Performance' },
      { id: 'security', label: 'Security' },
    ],
    template: [
      { id: 'all', label: 'All' },
      { id: 'bugReport', label: 'Bug Report' },
      { id: 'triage', label: 'Triage' },
      { id: 'planning', label: 'Planning' },
      { id: 'checklist', label: 'Checklist' },
      { id: 'specification', label: 'Specification' },
    ],
    testcase: [
      { id: 'all', label: 'All' },
      { id: 'functional', label: 'Functional' },
      { id: 'regression', label: 'Regression' },
      { id: 'integration', label: 'Integration' },
      { id: 'ecommerce', label: 'E-commerce' },
      { id: 'mobile', label: 'Mobile' },
    ],
    testscript: [
      { id: 'all', label: 'All' },
      { id: 'ui', label: 'UI Testing' },
      { id: 'api', label: 'API Testing' },
      { id: 'performance', label: 'Performance' },
      { id: 'mobile', label: 'Mobile' },
    ],
  },

  // Submission Form Templates
  submissionTemplates: {
    automation: [
      { title: 'Basic Commands', items: [{ code: '', description: '' }] },
      { title: 'Locators', items: [{ code: '', description: '' }] },
      { title: 'Waits & Timeouts', items: [{ code: '', description: '' }] },
    ],
    strategy: [
      { title: 'Best Practices', items: [{ code: '', description: '' }] },
      { title: 'Common Pitfalls', items: [{ code: '', description: '' }] },
      { title: 'Tips & Tricks', items: [{ code: '', description: '' }] },
    ],
    api: [
      { title: 'Request Methods', items: [{ code: '', description: '' }] },
      { title: 'Authentication', items: [{ code: '', description: '' }] },
      { title: 'Assertions', items: [{ code: '', description: '' }] },
    ],
    performance: [
      { title: 'Metrics', items: [{ code: '', description: '' }] },
      { title: 'Tools & Commands', items: [{ code: '', description: '' }] },
      { title: 'Best Practices', items: [{ code: '', description: '' }] },
    ],
    security: [
      { title: 'Common Vulnerabilities', items: [{ code: '', description: '' }] },
      { title: 'Security Tests', items: [{ code: '', description: '' }] },
      { title: 'Tools & Techniques', items: [{ code: '', description: '' }] },
    ],
  },
};

export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://your_project_id.supabase.co/functions/v1',
  functionName: import.meta.env.VITE_API_FUNCTION_NAME || 'make-server-6e41de3d',

  get endpoints() {
    return {
      submissions: `${this.baseUrl}/${this.functionName}/submissions`,
      adminPending: `${this.baseUrl}/${this.functionName}/admin/pending`,
      adminReview: `${this.baseUrl}/${this.functionName}/admin/review`,
      approvedContent: `${this.baseUrl}/${this.functionName}/approved`,
      adminSignup: `${this.baseUrl}/${this.functionName}/admin/signup`,
    };
  },
};

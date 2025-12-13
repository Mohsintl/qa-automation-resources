# QA Automation Resource Website - Setup Guide

## Overview
This project has been refactored to move all hardcoded values into a centralized, environment-variable-based configuration system. This ensures security, maintainability, and easy deployment across different environments.

## What Changed

### 🔒 Security Improvements
- **Removed hardcoded credentials** from `src/utils/supabase/info.tsx`
- All Supabase keys now loaded from environment variables
- API endpoints are now configurable
- `.env` files are git-ignored to prevent accidental credential commits

### 📋 Files Created/Modified

#### New Files:
1. **`src/config/index.ts`** - Centralized configuration
   - Environment variables (via `import.meta.env.VITE_*`)
   - Site branding (title, tagline, company name, year)
   - Navigation menu configuration
   - Content categories (cheatsheet, template, testcase, testscript)
   - Submission form templates
   - API configuration (dynamic endpoints)

2. **`.env.example`** - Template for required environment variables
3. **`.env.local`** - Pre-filled with current values (for local development)
4. **`.gitignore`** - Updated to protect `.env*` files

#### Modified Files:
- `src/utils/supabase/info.tsx` - Now uses env variables
- `src/utils/api.ts` - Endpoints from config
- `src/components/Header.tsx` - Branding & navigation from config
- `src/components/Hero.tsx` - Hero section text from config
- `src/components/Footer.tsx` - Company info from config
- `src/components/CheatSheetGrid.tsx` - Categories from config
- `src/components/SubmitCheatSheet.tsx` - Templates from config
- `src/components/TemplatesAndBoilerplates.tsx` - Categories import added
- `src/components/Templates.tsx` - Categories import added
- `src/components/TestCases.tsx` - Categories import added
- `src/components/TestScripts.tsx` - Categories import added

## Setup Instructions

### 1. Initial Setup
```powershell
npm install
```

### 2. Environment Configuration

#### For Local Development:
The `.env.local` file is already created with your current credentials. Just verify it exists:
```bash
# Check if .env.local exists
ls .env.local
```

If it doesn't exist, copy from the example:
```bash
cp .env.example .env.local
# Then edit .env.local with your actual values
```

#### For Production/Staging:
Use your platform's secret management:
- **Vercel/Netlify**: Use dashboard environment variables
- **Docker/Self-hosted**: Use `.env` file (not in git)
- **CI/CD**: Set secrets in GitHub Actions / GitLab CI / etc.

### 3. Required Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLIC_ANON_KEY=your_public_anon_key
VITE_SUPABASE_URL=https://your_project_id.supabase.co

# API Configuration
VITE_API_FUNCTION_NAME=make-server-6e41de3d
VITE_API_BASE_URL=https://your_project_id.supabase.co/functions/v1

# Site Branding (optional - has defaults)
VITE_SITE_TITLE=Testers Playbook
VITE_SITE_TAGLINE=Your QA & Automation Reference
VITE_SITE_DESCRIPTION=Comprehensive cheat sheets...
VITE_HERO_TITLE=Quick Reference for QA Professionals
VITE_GITHUB_URL=https://github.com
VITE_COMPANY_NAME=Testers Playbook
VITE_CURRENT_YEAR=2025
```

### 4. Running the Application

**Development:**
```powershell
npm run dev
# Opens at http://localhost:3000/
```

**Production Build:**
```powershell
npm run build
# Output in `build/` folder
```

**Preview Build:**
```powershell
npm run preview
```

## How Configuration Works

### Dynamic Values Flow:

1. **Environment Variables** (`.env.local` or `.env`)
   ↓
2. **Vite's `import.meta.env`** (Vite injects at build time)
   ↓
3. **`src/config/index.ts`** (Centralizes all config)
   ↓
4. **Components** (Import and use from config)

### Example: Changing Site Title

**Before (Hardcoded):**
```tsx
// src/components/Header.tsx
<h1>Testers Playbook</h1>  // ❌ Hardcoded
```

**After (Dynamic):**
```tsx
// src/components/Header.tsx
import { siteConfig } from '../config';
<h1>{siteConfig.title}</h1>  // ✅ From config

// To change:
// 1. Edit .env.local
VITE_SITE_TITLE=My Custom Title
// 2. Restart dev server (npm run dev)
```

## Configuration Structure

```typescript
siteConfig: {
  title: string
  tagline: string
  description: string
  companyName: string
  currentYear: number
  
  hero: {
    title: string
    searchPlaceholder: string
  }
  
  github: string
  
  navigation: Array<{
    id: string
    label: string
    icon: string  // Icon name from lucide-react
  }>
  
  categories: {
    cheatsheet: Array<{ id: string, label: string }>
    template: Array<{ id: string, label: string }>
    testcase: Array<{ id: string, label: string }>
    testscript: Array<{ id: string, label: string }>
  }
  
  submissionTemplates: {
    automation: Array<{ title: string, items: Array<...> }>
    strategy: Array<...>
    api: Array<...>
    // ... etc
  }
}

apiConfig: {
  baseUrl: string
  functionName: string
  endpoints: {
    submissions: string
    adminPending: string
    adminReview: string
    approvedContent: string
    adminSignup: string
  }
}
```

## Customization Guide

### Change Site Branding
Edit `.env.local`:
```env
VITE_SITE_TITLE=My QA Portal
VITE_SITE_TAGLINE=QA Resources Hub
VITE_COMPANY_NAME=My Company
VITE_CURRENT_YEAR=2025
```

### Add New Navigation Items
Edit `src/config/index.ts`:
```typescript
navigation: [
  { id: 'cheatsheets', label: 'Cheat Sheets', icon: 'BookOpen' },
  { id: 'myNewSection', label: 'My New Section', icon: 'Star' },  // ✅ Add here
  // ...
]
```

### Add New Categories
Edit `src/config/index.ts`:
```typescript
categories: {
  cheatsheet: [
    { id: 'all', label: 'All' },
    { id: 'myNewCategory', label: 'My New Category' },  // ✅ Add here
    // ...
  ]
}
```

### Change API Endpoints
Edit `.env.local`:
```env
VITE_API_BASE_URL=https://new-api.example.com/functions/v1
VITE_API_FUNCTION_NAME=new-function-name
```

## Security Best Practices

✅ **Do:**
- Keep `.env` and `.env.local` in `.gitignore`
- Use environment variables for all secrets
- Rotate credentials periodically
- Use `.env.example` for template documentation
- Review what's exposed in client-side config

❌ **Don't:**
- Commit `.env` files to git
- Put private keys in config (use server functions)
- Log sensitive values
- Expose service keys to frontend (use public anon keys)

## Troubleshooting

### "VITE_SUPABASE_PROJECT_ID is not defined"
- Ensure `.env.local` exists
- Check file is in project root (not in `src/`)
- Restart dev server after editing `.env.local`

### Build fails with missing env vars
- Copy `.env.example` to `.env` or `.env.local`
- Fill in all required values
- Run build again

### App loads but features don't work
- Verify all Supabase credentials are correct in `.env.local`
- Check browser DevTools console for error messages
- Ensure API endpoints are accessible

### Config values are undefined
- Vite only exposes env vars prefixed with `VITE_`
- Restart dev server after env changes
- Check that `.env.local` is in the root directory

## Build Verification

All changes have been tested:
- ✅ `npm install` - Dependencies installed
- ✅ `npm run build` - Production build succeeds (no TypeScript errors)
- ✅ `npm run dev` - Dev server starts at http://localhost:3000/

## Next Steps

1. **Customize branding** by editing `.env.local`
2. **Deploy** using your preferred platform (Vercel, Netlify, Docker, etc.)
3. **Set environment variables** in your hosting platform
4. **Monitor** the application for any hardcoded values you might find

---

For questions or issues, check the [Vite documentation](https://vitejs.dev/) or contact your team.

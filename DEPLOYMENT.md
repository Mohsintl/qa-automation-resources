# QA Automation Resource Website - Deployment Guide

## Quick Setup for CI/CD

### 1. Create GitHub Repository
```bash
# If you don't have a GitHub repo yet
gh repo create qa-automation-resources --public --source=. --remote=origin
# OR manually create on github.com and run:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel (Recommended - Free)

#### Option A: Vercel CLI (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables (in Vercel dashboard):
   ```
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLIC_ANON_KEY=your_anon_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_API_BASE_URL=your_api_url
   VITE_API_FUNCTION_NAME=your_function_name
   VITE_SITE_NAME=QA Automation Hub
   VITE_COMPANY_NAME=Your Company
   VITE_GITHUB_URL=https://github.com/yourrepo
   ```
6. Click "Deploy"

### 3. GitHub Secrets Setup

Add secrets to your GitHub repository for CI/CD:

1. Go to your repo: `Settings` → `Secrets and variables` → `Actions`
2. Click "New repository secret"
3. Add each secret from `.env.local`:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLIC_ANON_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_API_BASE_URL`
   - `VITE_API_FUNCTION_NAME`
   - `VITE_SITE_NAME`
   - `VITE_COMPANY_NAME`
   - `VITE_GITHUB_URL`

### 4. Custom Domain Setup

#### On Vercel:
1. Go to project → Settings → Domains
2. Add your domain (e.g., `qa-automation.com`)
3. Follow DNS configuration instructions
4. Update your domain registrar with provided records

#### DNS Records (typical):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

---

## Alternative: Deploy to Netlify

### Netlify CLI
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Netlify Dashboard
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables (same as Vercel)
6. Deploy

---

## Alternative: Deploy to Cloudflare Pages

```bash
# Install Wrangler CLI
npm i -g wrangler

# Login
wrangler login

# Deploy
npx wrangler pages deploy dist --project-name=qa-automation
```

---

## Post-Deployment Checklist

- [ ] Verify site loads correctly
- [ ] Test all forms (submission, admin login)
- [ ] Check environment variables are applied
- [ ] Test admin panel functionality
- [ ] Verify API calls work
- [ ] Test on mobile devices
- [ ] Configure custom domain
- [ ] Set up SSL certificate (auto on Vercel/Netlify)
- [ ] Add site to Google Search Console
- [ ] Set up analytics

---

## Automated Deployments

Once connected to GitHub:
- **Vercel/Netlify**: Auto-deploy on every push to `main`
- **Preview deployments**: Created for pull requests
- **Rollback**: One-click rollback to previous versions

---

## Environment Variables Priority

1. **Local development**: `.env.local` (not committed)
2. **Production**: Platform dashboard (Vercel/Netlify)
3. **CI/CD**: GitHub Secrets

Never commit `.env.local` - it's in `.gitignore`

---

## Monitoring

### Vercel Analytics (Free)
- Add to `package.json`: `@vercel/analytics`
- Import in `main.tsx`: 
  ```ts
  import { Analytics } from '@vercel/analytics/react';
  // Add <Analytics /> to your app
  ```

### Google Analytics
- Add tracking ID to environment variables
- Import and configure in app

---

## Troubleshooting

**Build fails**: Check environment variables are set correctly
**404 on refresh**: Configure routing in platform settings (already handled by Vite)
**API not working**: Verify CORS settings in Supabase
**Slow builds**: Enable caching in CI/CD settings

---

## Cost Breakdown

- **Vercel Free Tier**: 100GB bandwidth, unlimited sites
- **Netlify Free Tier**: 100GB bandwidth, 300 build minutes
- **Cloudflare Pages**: Unlimited bandwidth, 500 builds/month
- **Domain**: $10-15/year (only cost)
- **Supabase Free**: 500MB DB, 1GB file storage

Total monthly cost: **$0** (plus domain registration)

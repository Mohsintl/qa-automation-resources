
  # QA Automation Resource Website

A comprehensive platform for QA professionals featuring cheat sheets, templates, test cases, and automation resources. Built with React, TypeScript, and Node.js.

## 🏗️ Architecture

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Deployment:** GitHub Pages
- **Features:** Content browsing, user submissions, admin panel

### Backend
- **Framework:** Node.js + Express.js + TypeScript
- **Database:** Supabase (PostgreSQL + Auth)
- **Storage:** File-based KV store (easily replaceable with Redis/PostgreSQL)
- **Deployment:** Railway (or Vercel/Render)
- **Features:** REST API, admin operations, content management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- GitHub account (for deployment)

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/qa-automation-resources.git
cd qa-automation-resources

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

### 3. Development
```bash
# Start frontend (port 5173)
npm run dev

# Start backend (port 3001)
cd backend && npm run dev
```

### 4. Build for Production
```bash
# Build frontend
npm run build

# Build backend
cd backend && npm run build
```

## 🔧 Configuration

### Required Environment Variables

**Frontend (.env.local):**
```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLIC_ANON_KEY=your_public_key
VITE_SUPABASE_URL=https://your_project.supabase.co
VITE_API_BASE_URL=https://your-backend-url.com/api
```

**Backend (Railway/Vercel environment):**
```env
SUPABASE_URL=https://your_project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_key
ADMIN_SECRET=your_admin_secret
```

## 🚢 Deployment

### Frontend (GitHub Pages)
1. Push to GitHub main branch
2. GitHub Actions automatically builds and deploys
3. Available at: `https://yourusername.github.io/repository-name`

### Backend (Railway)
1. Create Railway account
2. Connect GitHub repository
3. Set environment variables in Railway dashboard
4. Deploy automatically on push to main

### Alternative Backend Deployments
- **Vercel:** Uncomment Vercel deployment in `.github/workflows/deploy.yml`
- **Render:** Use webhook deployment
- **Heroku:** Traditional git push deployment

## 📁 Project Structure

```
├── src/                    # Frontend React app
│   ├── components/         # Reusable UI components
│   ├── config/            # Configuration files
│   ├── utils/             # API and utility functions
│   └── data/              # Static data
├── backend/               # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts       # Main server
│   │   └── kv_store.ts    # Data storage
│   └── package.json
├── .github/workflows/     # CI/CD pipelines
└── public/               # Static assets
```

## 🔐 Admin Features

1. **Create Admin Account:**
   ```bash
   curl -X POST https://your-backend.com/api/admin/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"securepass","name":"Admin","adminSecret":"your_secret"}'
   ```

2. **Access Admin Panel:**
   - Login with admin credentials
   - Navigate to `/admin` route
   - Review and approve/reject submissions

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- **Live Site:** [GitHub Pages URL]
- **API Documentation:** [Backend URL]/health
- **Figma Design:** https://www.figma.com/design/0a09oIscgAhB47MfuzD6aM/QA-Automation-Resource-Website
  
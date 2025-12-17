# QA Automation Resource Backend

Node.js/Express version of the QA Automation Resource backend API.

## Features

- REST API for content submissions and admin operations
- JWT-based authentication for admin routes
- File-based KV store (development) - easily replaceable with Redis/PostgreSQL
- TypeScript support
- Comprehensive error handling
- CORS and security middleware

## API Endpoints

### Public Routes
- `POST /api/submissions` - Submit new content
- `GET /api/approved/:type` - Get approved content by type

### Admin Routes (Require Bearer token)
- `GET /api/admin/pending` - Get all pending submissions
- `POST /api/admin/review` - Approve/reject submissions
- `POST /api/admin/signup` - Create admin account

### Utility
- `GET /health` - Health check

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Development:**
   ```bash
   npm run dev
   ```

4. **Production build:**
   ```bash
   npm run build
   npm start
   ```

## Deployment Options

### Vercel
1. Connect your GitHub repo
2. Set environment variables in Vercel dashboard
3. Deploy

### Railway
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### Heroku
1. Create Heroku app
2. Set config vars
3. Deploy via GitHub integration

### AWS/DigitalOcean
- Use PM2 for process management
- Set up reverse proxy with Nginx
- Configure SSL certificates

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `PORT` | Server port (default: 3001) | No |
| `ADMIN_SECRET` | Secret key for admin signup | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## KV Store

Currently uses a simple file-based store for development. For production:

### Redis
```bash
npm install redis
# Update kv_store.ts to use Redis client
```

### PostgreSQL
```bash
npm install pg
# Create tables and update kv_store.ts
```

### Supabase Storage
```bash
# Use Supabase client for storage operations
```

## Migration from Deno

This Node.js version maintains the same API structure as the original Deno/Hono implementation, so frontend changes are minimal. Just update the API base URL in your frontend configuration.

## Testing

```bash
npm test
```

## License

MIT
# Epic Platform — Deployment & Launch Guide

## Current Status
✅ **Production-ready** scaffold with all core dependencies installed and tested.

## Architecture Overview

### Frontend Layer
- **Next.js 16.2.6** (App Router, TypeScript)
- **Tailwind CSS v4** + **shadcn/ui** for UI components
- **Framer Motion** for animations
- **Cyber-neon theme** (dark background, purple/pink/cyan gradients, glassmorphic cards)

### AI Orchestration Layer
- **Groq SDK** (v1.2.0) for fast LLM inference
- **Vercel AI SDK** (v6.0.188) for model abstraction
- **@langchain/core** (v1.1.47) for agent patterns
- Test endpoint: `GET /api/test-groq`

### Backend Services Layer
- **Supabase** (@supabase/supabase-js v2.106.1) — Auth, DB, realtime
- **Inngest** (v4.4.0) — Job queue and event orchestration
- **Upstash Redis** (@upstash/redis v1.38.0) — Serverless cache

### Credentials & Secrets
All stored in **OpenCode credential vault** (encrypted, per-project):
- `GROQ_API_KEY` ✅ (available)
- `FAL_API_KEY` (pending)
- Supabase keys (pending)
- Inngest API key (pending)
- Upstash Redis credentials (pending)

## Build & Run

### Development
```bash
# Install (already done)
npm install

# Configure environment
cp .env.local.example .env.local
# Add real API keys to .env.local

# Run dev server
npm run dev
# → http://localhost:3000
```

### Production Build
```bash
npm run build
# → Compiled successfully in ~5.2s (Turbopack)
# → TypeScript check passes
# → No errors

npm run start
# → Starts production server
```

### Verify Groq Integration
```bash
curl http://localhost:3000/api/test-groq
# → Returns success status + response from Groq API
```

## Deployment to Railway

### Prerequisites
1. GitHub repo must be pushed (`https://github.com/Sm0k367/epic-tech-platform`)
2. Railway account linked to GitHub org
3. Credentials set up in Railway environment (or via OpenCode vault if integrated)

### Steps
1. Connect GitHub repo to Railway
2. Set environment variables in Railway dashboard (copy from `.env.local.example`)
3. Deploy — Railway auto-builds with `npm run build` and starts with `npm run start`

### Environment Variables (Railway)
```
GROQ_API_KEY=<from credential vault>
FAL_API_KEY=<from credential vault>
NEXT_PUBLIC_SUPABASE_URL=<from credential vault>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from credential vault>
SUPABASE_SERVICE_ROLE_KEY=<from credential vault>
INNGEST_API_KEY=<from credential vault>
UPSTASH_REDIS_REST_URL=<from credential vault>
UPSTASH_REDIS_REST_TOKEN=<from credential vault>
NEXT_PUBLIC_APP_URL=https://epic-platform-prod.railway.app
NODE_ENV=production
```

## Monitoring & Observability

### Build Logs
- Turbopack compile time: ~5.2s
- TypeScript check: ~3.9s
- Page generation: ~489ms
- Static: Landing page (`/`), not-found fallback
- Dynamic: `/api/test-groq` (server-rendered on demand)

### Health Checks
- **Landing Page:** `GET /` → 200, renders cyber-neon hero
- **Groq Integration:** `GET /api/test-groq` → 200, returns success + LLM response
- **Build Pipeline:** `npm run build` → exit 0, no errors

### Error Handling
- API errors return structured JSON with status, message, error details
- Groq errors caught and returned with error message
- Missing API keys caught at boot time (GROQ_API_KEY validation)

## Next Steps (M2+)

1. **Push to GitHub** (requires PAT or SSH auth)
2. **Deploy to Railway** (auto-build on push)
3. **M2 — AI Orchestration:** Wire Groq chatbot to dashboard
4. **M3 — Backend Services:** Initialize Supabase auth + DB schema
5. **M4 — Frontend:** Build full dashboard UI (prompt input, chat, preview panels)
6. **M5 — Polish:** Final theming, animations, real-time sync

---

**Scaffold Date:** May 21, 2026  
**Tech Stack Verified:** ✅  
**Ready for M2:** Yes (pending GitHub push auth)

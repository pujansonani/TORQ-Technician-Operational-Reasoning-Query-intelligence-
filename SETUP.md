# TORQ Setup Guide

## Prerequisites

- Docker Desktop (v4.x+ with Docker Compose v2)
- Git
- A Groq API key (free tier works — or Anthropic/OpenAI as alternates)

---

## Step 1: Get API Keys

### Option A: Groq (Default — Recommended)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / log in (free tier: 30 req/min, 14,400/day)
3. Navigate to **API Keys** → **Create API Key**
4. Copy the key

### Option B: Anthropic Claude
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Navigate to **Settings → API Keys** → **Create Key**
3. Copy the key (requires billing setup)

### Option C: OpenAI
1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to **API Keys** → **Create new secret key**
3. Copy the key (requires billing setup)

---

## Step 2: Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and set your API key
# For Groq (default):
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your_actual_key_here
```

---

## Step 3: Run with Docker Compose

```bash
# Build and start everything (first run takes ~5-10 min for model download)
docker compose up --build

# The seed service will automatically:
# 1. Create database tables
# 2. Load 6 DTC knowledge base entries
# 3. Load 25 parts with demo prices
# 4. Generate 60 synthetic repair records
# 5. Index all diagnostic procedures into ChromaDB
```

### Services:
| Service  | URL                     | Purpose                    |
|----------|-------------------------|----------------------------|
| Frontend | http://localhost:3000    | TORQ Web UI                |
| Backend  | http://localhost:8000    | FastAPI API                |
| API Docs | http://localhost:8000/docs | Swagger UI                |
| Database | localhost:5432          | PostgreSQL                 |

---

## Step 4 (Optional): Use Supabase Instead of Local PostgreSQL

If you prefer Supabase for the database:

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database → Connection string → URI**
3. Copy the connection string (use the **Session mode** pooler)
4. In your `.env`:
   ```
   DATABASE_URL=postgresql+asyncpg://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. Remove the `db` service from `docker-compose.yml`
6. Remove the `depends_on: db` from `backend` and `seed` services

---

## Step 5: Load Your Own DTC Data

When you have your SAE J1939 CSV and diagnostic procedure files:

1. Place your CSV at `backend/seed/dtc_real.csv`
2. Update `backend/seed/seed_all.py` to parse your CSV format
3. Run the seed script:
   ```bash
   docker compose run --rm seed python -m seed.seed_all
   ```

---

## Step 6: Swap LLM Provider

Change one env var to switch providers:

```bash
# In .env:
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Restart backend:
docker compose restart backend
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `LLM_PROVIDER key missing` | Set the correct API key in `.env` |
| `Connection refused` on frontend | Backend may still be starting. Wait 30s and refresh |
| `Database not seeded` | Run `docker compose run --rm seed python -m seed.seed_all` |
| Slow first startup | The embedding model (~90MB) downloads on first build. Subsequent starts are instant |
| Port 5432 in use | Stop your local PostgreSQL or change the port mapping in `docker-compose.yml` |

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LLM_PROVIDER` | No | `groq` | LLM backend: `groq`, `anthropic`, or `openai` |
| `GROQ_API_KEY` | If provider=groq | — | Groq API key |
| `ANTHROPIC_API_KEY` | If provider=anthropic | — | Anthropic API key |
| `OPENAI_API_KEY` | If provider=openai | — | OpenAI API key |
| `DATABASE_URL` | Yes (auto in Docker) | — | PostgreSQL async connection string |
| `CHROMA_PERSIST_DIR` | No | `/app/chroma_data` | ChromaDB storage path |
| `CORS_ORIGINS` | No | `http://localhost:3000` | Allowed CORS origins |
| `DEBUG` | No | `false` | Enable debug logging |

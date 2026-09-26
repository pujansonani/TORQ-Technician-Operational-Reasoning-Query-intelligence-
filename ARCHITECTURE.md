# TORQ Architecture & Design Decisions

## Overview

TORQ is a **diagnostic copilot** — not a chatbot. It implements a structured,
evidence-based workflow: INPUT → UNDERSTAND → RETRIEVE → EVALUATE → TEST → UPDATE → CONFIRM.

The system **never** guesses a fix. It recommends the single most informative diagnostic test,
collects the result, updates its belief distribution, and repeats until a root cause is
confirmed with sufficient confidence.

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        Next.js Frontend                        │
│  ┌─────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────┐  │
│  │Dashboard │  │   Workflow   │  │ Diagnosis│  │  Report   │  │
│  │  Page    │  │    Page      │  │  Results │  │   Page    │  │
│  └────┬─────┘  └──────┬───────┘  └────┬─────┘  └─────┬─────┘  │
│       │               │               │              │         │
│  ┌────┴───────────────┴───────────────┴──────────────┴─────┐  │
│  │              Zustand Store + API Client                   │  │
│  └──────────────────────┬────────────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────────┘
                          │ REST API
┌─────────────────────────┼──────────────────────────────────────┐
│                     FastAPI Backend                              │
│  ┌──────────────────────┴─────────────────────────────────────┐ │
│  │                    API Routes Layer                          │ │
│  │  /diagnose  /test-result  /sessions  /report  /fleet        │ │
│  └──────────────────────┬─────────────────────────────────────┘ │
│                         │                                       │
│  ┌──────────────────────┴─────────────────────────────────────┐ │
│  │              Service Layer (Business Logic)                  │ │
│  │  ┌─────────────────┐  ┌──────────┐  ┌───────────────────┐  │ │
│  │  │ DiagnosticEngine│  │RAGService│  │  CostEstimator    │  │ │
│  │  │ • compute_priors│  │          │  │                   │  │ │
│  │  │ • select_nbt    │  │          │  │                   │  │ │
│  │  │ • bayes_update  │  │          │  │                   │  │ │
│  │  │ • confidence    │  │          │  │                   │  │ │
│  │  └────────┬────────┘  └────┬─────┘  └───────────────────┘  │ │
│  │           │               │                                  │ │
│  │  ┌────────┴────┐  ┌──────┴──────┐  ┌───────────────────┐   │ │
│  │  │ TORQ-Lock   │  │ ChromaDB    │  │  LLM Provider     │   │ │
│  │  │ Validator   │  │ (embedded)  │  │  (Groq/Claude/    │   │ │
│  │  └─────────────┘  └─────────────┘  │   OpenAI)         │   │ │
│  │                                     └───────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                         │                                       │
│  ┌──────────────────────┴─────────────────────────────────────┐ │
│  │                  PostgreSQL (Supabase)                       │ │
│  │  trucks │ dtc_kb │ repairs │ parts │ sessions │ events      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Why ChromaDB over a hosted vector DB (Pinecone, Weaviate)?

| Factor | ChromaDB (chosen) | Hosted (Pinecone/Weaviate) |
|--------|-------------------|---------------------------|
| Hackathon setup time | Zero — pip install, done | Account creation, API keys, region config |
| Cost | Free | Free tier limits may bite during demo |
| Latency | <5ms (local) | Network round-trip |
| Offline demo | ✅ Works anywhere | ❌ Needs internet |
| Production readiness | Good enough for <10K docs | Better for 100K+ docs |

**Bottom line:** For a hackathon with ~30-50 DTC documents, ChromaDB embedded is the right
call. It persists to disk and requires zero infrastructure. If TORQ scales to a full
Paccar DTC catalog (thousands of codes), migrating to a hosted vector DB is a one-file change
in `chroma_store.py`.

### 2. Why Groq as the default LLM?

| Factor | Groq | Anthropic Claude | OpenAI GPT-4o |
|--------|------|-----------------|---------------|
| Speed | ⚡ ~500 tok/s (fastest) | ~80 tok/s | ~100 tok/s |
| Cost | Free tier (30 req/min) | Paid only | Paid only |
| Model quality | Llama 3.3 70B — excellent | Best reasoning | Very good |
| Rate limits | Generous for demo | Low on free tier | Low on free tier |

**Bottom line:** Groq's free tier with Llama 3.3 70B gives the best demo experience — fast
responses, zero cost, and the model quality is excellent for structured diagnostic analysis.
The provider abstraction (`LLM_PROVIDER` env var) means switching to Claude or GPT-4o is a
one-line config change.

### 3. Why PostgreSQL/Supabase over SQLite?

| Factor | PostgreSQL/Supabase | SQLite |
|--------|-------------------|--------|
| JSONB support | Native, indexed, queryable | JSON stored as text |
| Array columns | Native `text[]` for dtc_codes | Requires workarounds |
| Concurrent writes | Full ACID with row-level locking | Single-writer limitation |
| Aggregate queries | Full SQL power for fleet intelligence | Works but slower |
| Judge impression | "Production-grade" | "Prototype" |

**Bottom line:** The data model uses JSONB (possible_causes, diagnostic_steps) and array
columns (dtc_codes, compatible_models) extensively. PostgreSQL handles these natively.
Supabase provides a free hosted PostgreSQL with zero DevOps.

### 4. Why local embeddings over OpenAI embeddings API?

- **Zero API cost** — no per-token charges
- **No network dependency** — works offline and in demo environments
- **Reproducible** — same model, same embeddings every time
- **Fast** — all-MiniLM-L6-v2 runs in <100ms for typical queries
- **Trade-off:** 384-dimension embeddings vs OpenAI's 1536. For our corpus size (~50 docs),
  this is a non-issue.

### 5. TORQ-Lock: Why validate numeric specs?

LLMs confidently hallucinate numeric specifications. In a diagnostic context, a wrong torque
value or pressure spec could cause:
- Overtightened bolts → cracked components
- Wrong pressure settings → system failure
- Incorrect voltage thresholds → missed faults

TORQ-Lock cross-checks every numeric value (torque, pressure, voltage, temperature) against
verified values in `dtc_kb.possible_causes.verified_specs`. If there's no match within ±15%
tolerance, the value is stripped and replaced with "check manufacturer specification."

This is not just a nice-to-have — it's a **safety feature** that differentiates TORQ from
naive LLM wrappers.

### 6. Bayesian Diagnostic Engine vs. "Ask the LLM"

Most AI diagnostic tools send the symptom to an LLM and display whatever it returns. TORQ
uses the LLM as a **summarizer**, not a **decision-maker**.

The diagnostic decisions (which test to run next, how confident we are, when to escalate)
are made by a deterministic Bayesian algorithm:

1. **Priors** from the knowledge base (not the LLM)
2. **Test selection** via information-gain heuristic (not the LLM)
3. **Belief updates** via Bayes' theorem (not the LLM)
4. **Confidence thresholds** that trigger escalation (not the LLM)

The LLM's role is limited to:
- Generating human-readable summaries of the diagnostic situation
- Analyzing symptom text for nuance the keyword matcher might miss
- Explaining "why this test" in natural language

This architecture means TORQ's recommendations are **traceable, auditable, and reproducible**
— critical for a workshop tool where decisions affect vehicle safety.

---

## Security Notes

- No API keys are hardcoded anywhere. All secrets are loaded from environment variables.
- The backend validates that required keys exist at startup and fails with a clear error if
  they're missing.
- CORS is configured to only allow the frontend origin.
- All LLM outputs pass through TORQ-Lock before being shown to the user.

---

## Scaling Notes (for judges who ask "what about production?")

| Component | Current (hackathon) | Production path |
|-----------|-------------------|-----------------|
| Vector DB | ChromaDB embedded | Migrate to Qdrant or Pinecone |
| Database | Supabase free tier | Supabase Pro or managed PostgreSQL |
| LLM | Groq free tier | Groq paid or self-hosted Llama |
| Embeddings | Local CPU | GPU-accelerated or API embeddings |
| Frontend | Next.js dev server | Vercel or containerized |
| Auth | None (demo) | Supabase Auth or Auth0 |

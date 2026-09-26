# TORQ — AI Diagnostic Copilot for Truck Service Technicians

> **Hackathon MVP** — Systematic, evidence-based fault diagnosis for heavy-duty trucks.
> Built for the Paccar Innovation Hackathon 2026.

---

## Quick Start

```bash
# 1. Clone and configure
cp .env.example .env
# Edit .env → add your GROQ_API_KEY (free at console.groq.com)

# 2. Start everything
docker compose up --build

# 3. Open the app
# → http://localhost:3000
```

See [SETUP.md](SETUP.md) for detailed instructions.

---

## What TORQ Does

1. **Technician inputs** a natural-language symptom + DTC fault code + vehicle info
2. **TORQ retrieves** relevant diagnostic procedures from a vector knowledge base (RAG)
3. **Scores candidate root causes** using a Bayesian prior model
4. **Recommends the single most informative diagnostic test** (information-gain heuristic)
5. **Technician runs the test** and enters the result (pass/fail or measurement)
6. **TORQ updates beliefs** via Bayesian inference, re-ranks causes, recommends the next test
7. **Repeats until confident** → shows confirmed cause, repair cost estimate, exportable report
8. **If confidence stays low** → tells the technician to escalate to dealer/DAVIE4

### What TORQ Does NOT Do

- ❌ Guess a fix from symptoms alone
- ❌ Present unverified LLM output as diagnostic guidance
- ❌ Show numeric specs (torque, voltage, pressure) without cross-checking against verified data
- ❌ Skip the evidence-gathering step

---

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design decisions and tradeoffs.

**Key components:**
- **Diagnostic Engine**: Bayesian probability model with information-gain test selection
- **TORQ-Lock™ Validator**: Cross-checks all numeric specs against verified manufacturer data
- **RAG Pipeline**: ChromaDB + sentence-transformers for knowledge retrieval
- **LLM Abstraction**: Provider-agnostic — swap between Groq/Anthropic/OpenAI with one env var

---

## Screens

| Screen | Description |
|--------|-------------|
| **Dashboard** | Vehicle selector, symptom input, DTC code entry |
| **Guided Workflow** | Step-by-step test recommendations with live confidence bars |
| **Report** | Exportable Markdown/PDF diagnostic summary with cost estimate |

---

## Demo DTC Codes

| Code | Description |
|------|-------------|
| `SPN-100-FMI-4` | Engine Oil Pressure — Voltage Below Normal |
| `SPN-110-FMI-0` | Engine Coolant Temperature — Above Normal |
| `SPN-190-FMI-0` | Engine Speed — Overspeed |
| `SPN-520322-FMI-7` | SCR Catalyst Conversion Efficiency |
| `SPN-91-FMI-4` | Accelerator Pedal — Voltage Below Normal |
| `SPN-3226-FMI-5` | DPF Differential Pressure — Below Normal |

> ⚠️ All data is synthetic and clearly labeled as demo data. No proprietary Paccar content
> is included. Real DTC CSVs and diagnostic procedures should replace the seed data before
> any real deployment.

---

## Tier 3 Roadmap (Not Built)

These features are noted for future development:

- **Full offline local LLM** — Run Llama locally via Ollama for air-gapped workshops
- **WhatsApp integration** — Field technicians report symptoms via WhatsApp → TORQ processes
- **Regional language input** — Hindi, Spanish, Portuguese symptom descriptions
- **Real OBD-II hardware** — Direct J1939 CAN bus integration for live DTC reads
- **Kubernetes deployment** — Production-grade orchestration with auto-scaling

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Recharts, RHF+Zod |
| Backend | FastAPI, Python 3.11, Pydantic v2, SQLAlchemy async |
| LLM | Groq (Llama 3.3 70B) — swappable to Claude/OpenAI |
| Embeddings | sentence-transformers all-MiniLM-L6-v2 (local) |
| Vector Store | ChromaDB (embedded, persisted) |
| Database | PostgreSQL (via Supabase or Docker) |
| Infrastructure | Docker Compose |

---

## License

Hackathon project — all rights reserved.

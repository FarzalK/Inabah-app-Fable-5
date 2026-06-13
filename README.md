# Inābah — إنابة

> *"Account yourselves before you are held to account."* — ʿUmar ibn al-Khaṭṭāb

Inābah is a personal Islamic spiritual companion built around two foundational practices: **Muhāsabah** (daily self-accounting) and **Murāqabah** (conscious awareness of Allah). It is grounded in the classical scholarship of Imam al-Ghazali's *Ihya Ulum al-Din*, Ibn al-Qayyim's *Madarij al-Salikeen*, and Ibn Rajab al-Hanbali.

This repository is a best-practices rebuild of [FarzalK/Inabah-app](https://github.com/FarzalK/Inabah-app).

---

## Features

### Muhāsabah
- Guided nightly session across 6 categories: Salah, Dhikr, Speech, Gaze & Consumption, Treatment of Others, Time & Intention
- AI-generated reflection grounded in Quran and authentic hadith (primary sources), with classical scholars supplementary
- Heart-state rating per category (Heedless → Mindful) and overall nafs station (Ammārah → Mutmaʾinnah)
- Resolution for tomorrow, shown as a callback at the start of the next session
- Draft autosave per slide — resume if you leave mid-session
- Adjustable categories per session

### Murāqabah
- All 99 Names of Allah with meaning, ayah, scholarly note, and contemplation prompt
- Contextual name suggestion based on your last Muhāsabah pattern
- Session timer (5–20 min), optional breathing guide, fading Quranic whispers
- Exit reflection: heart state + optional note

### Dashboard & History
- Nafs station gauge with trend, Muhāsabah progress charts, Murāqabah summary
- Cached AI summary — regenerates only after a new session
- Mutmaʾinnah gate: requires a 7-day streak and 14 sessions in 30 days, not just high scores
- Full tabbed session history; onboarding with a personalised AI direction letter

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS variables |
| Auth + DB | Supabase (`@supabase/ssr`, RLS on every table) |
| AI | Anthropic Claude API (server-side only) |
| Validation | zod on every AI route (request and model response) |
| Tests | Vitest (scoring engine) |
| CI | GitHub Actions — lint, typecheck, test, build |

---

## Architecture notes

- **Per-user data isolation** — every table has row-level security keyed on `(select auth.uid())` (evaluated once per statement, not per row).
- **Atomic rate limiting** — AI endpoints call the `increment_rate_limit()` Postgres function: a single `INSERT … ON CONFLICT` per request, fail-closed on errors, per-user per-minute windows.
- **Privacy** — `ANTHROPIC_API_KEY` never leaves the server, and AI routes never write user-derived content (answers, reflections, model output) to server logs.
- **AI source hierarchy** — system prompts enforce: Quran first (The Clear Quran translation), then authentic hadith with narrator and collection, then classical scholars only where primary sources don't speak directly. Model responses are schema-validated before they reach the client.
- **Scoring engine** — `lib/scoring.ts` is pure and unit-tested: recency-weighted session scores, streak/consistency computation, and the Mutmaʾinnah consistency gate.

---

## Getting started

### Prerequisites
- Node.js 20+
- A Supabase project (or the local Supabase CLI stack)
- An Anthropic API key

### Setup

```bash
git clone https://github.com/FarzalK/Inabah-App-Fable-5.git
cd Inabah-App-Fable-5
npm install

cp .env.example .env.local   # then fill in real values

# Apply the database schema to your Supabase project
supabase link --project-ref <your-project-ref>
supabase db push

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (zero warnings expected) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |

---

## Disclaimer

Inābah is a personal practice companion. It is **not** a substitute for a qualified shaykh, **not** a fatwa source, and **not** therapy.

## License

MIT

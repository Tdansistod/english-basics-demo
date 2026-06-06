# English Basics

An AI-powered English grammar and vocabulary tutor built for Spanish native speakers.

The app targets the patterns that most often trip Spanish speakers up in English — article misuse, preposition carry-overs, false friends (actualmente ≠ actually, realize ≠ carry out, embarrassed ≠ pregnant), verb tense confusion, and SVO → SOV word order interference. Free-write exercises are graded by an LLM with plain-language explanations that lean on Spanish comparisons when they help the rule stick.

## Features

- **Six focused categories** — Articles, Prepositions, Verb tenses, Word order, Common mistakes, Idioms.
- **Multiple-choice drills** graded server-side for instant feedback and zero AI latency on the simple questions.
- **Free-write prompts** every fifth question. The AI returns the exact phrases that are wrong, why each is wrong, a polished natural version, and a short praise line.
- **Spanish-aware tutoring** — the system prompt assumes an Argentinian learner (voseo, lunfardo influence, typical *actualmente* ≠ *actually* mix-ups) and surfaces cross-language comparisons when they aid recall.
- **End-of-session report** synthesised by the model: an overall rating, summary, concrete strengths, recurring weaknesses, and the single most impactful thing to drill next.
- **Session history** persisted as JSON on disk and browsable from the UI.
- **Demo-mode rate limiting** — auto-detected per request; localhost is unrestricted, any real host (Railway, tunnels, public domains) is capped at 5 AI calls per minute per IP.
- **Reasoning-model safe** — JSON extraction handles `<think>...</think>` blocks and stray markdown fences from the upstream model.

## Stack

- **Backend** — Node.js, Express, the official `openai` SDK pointed at any OpenAI-compatible endpoint (MiniMax, OpenAI, Groq, etc.).
- **Frontend** — vanilla JS, no build step. Static files served from `public/`.
- **Storage** — local JSON files under `sessions/`.

## Setup

```bash
git clone <repo-url> english-basics
cd english-basics
npm install
cp .env.example .env
# open .env and paste your OPENAI_API_KEY (any OpenAI-compatible provider: MiniMax, OpenAI, Groq, etc.)
npm run dev
```

The app starts on `http://localhost:3002`. If you skip the `cp` step the server creates `.env` from `.env.example` on first boot and prints a reminder to add the key before restarting.

### Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | — | **Required.** Any OpenAI-compatible API key (MiniMax, OpenAI, Groq, etc.). |
| `MINIMAX_BASE_URL` | `https://api.minimax.io/v1` | Override the API base URL. |
| `MINIMAX_MODEL` | `MiniMax-M3` | Used for the final session report. |
| `MINIMAX_FAST_MODEL` | `MiniMax-M2.5-highspeed` | Used for per-sentence free-write checks. |
| `PORT` | `3002` | HTTP port. |

## How it works

1. Pick a category and session length (5 or 10 questions). Every fifth slot is reserved for a free-write prompt; the rest are multiple-choice.
2. MC questions are graded locally against the bundled question bank — no API round-trip, no extra latency.
3. Free-write answers are sent to the fast model with a strict JSON schema. The response is parsed and normalised, then shown to the learner as a list of mistakes, a polished sentence, and a praise line.
4. On session end, the full transcript is sent to the larger model for the report. The record is written to `sessions/<id>.json` and the UI renders a strengths / weaknesses / next-step breakdown.

## Project layout

```
english-basics/
├── server.js          # Express app, API routes, AI prompts, rate limiter
├── questions.js       # Question bank + CATEGORIES
├── public/
│   ├── index.html     # Single-page UI
│   ├── app.js         # Client state, view rendering, API calls
│   └── style.css      # Theme: warm dark, Fraunces + JetBrains Mono
├── sessions/          # JSON record per completed session
├── .env.example
└── package.json
```

## License

MIT.

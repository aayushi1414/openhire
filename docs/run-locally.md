# Run Locally

## Prerequisites

Make sure you have:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/installation) — or install via `npm install -g pnpm`
- [PostgreSQL](https://www.postgresql.org/) database — or a hosted one like [Neon](https://neon.tech/)
- [Retell AI](https://www.retellai.com/) API key
- [OpenAI](https://platform.openai.com/) API key

---

## Step 1 — Clone the repo

```bash
git clone https://github.com/brijeshmarch16/openhire.git
cd openhire
```

## Step 2 — Install dependencies

```bash
pnpm install
```

## Step 3 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in each value:

| Variable | What to put here |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |
| `BETTER_AUTH_URL` | `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` and paste the output |
| `DATABASE_URL` | Your Postgres connection string (e.g. from [Neon](https://neon.tech/)) |
| `RETELL_API_KEY` | From [Retell AI dashboard](https://dashboard.retellai.com/apiKey) |
| `OPENAI_API_KEY` | From [OpenAI platform](https://platform.openai.com/api-keys) |

## Step 4 — Run database migrations

```bash
pnpm db:migrate
```

## Step 5 — Seed the database

```bash
pnpm db:seed
```

This creates the default interviewers needed for the app.

## Step 6 — Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you're good to go.

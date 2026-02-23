# Run Locally

## Before you start

Make sure you have:

- **Node.js 18+** — [download](https://nodejs.org/)
- **pnpm** — `npm install -g pnpm`
- **A Postgres database** — free option: [Neon](https://neon.tech/) (no local setup needed)
- API keys for **Retell AI** and **OpenAI**

---

## Setup

**1. Clone and enter the repo**

```bash
git clone https://github.com/brijeshmarch16/openhire.git
cd openhire
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Create your `.env` file**

```bash
cp .env.example .env
```

Open `.env` and fill in each value:

| Variable | What to put here |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |
| `BETTER_AUTH_URL` | `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` and paste the output |
| `DATABASE_URL` | Your Postgres connection string (e.g. from Neon) |
| `RETELL_API_KEY` | From [Retell AI dashboard](https://dashboard.retellai.com/apiKey) |
| `OPENAI_API_KEY` | From [OpenAI platform](https://platform.openai.com/api-keys) |

**4. Run database migrations**

```bash
pnpm db:migrate
```

**5. Start the dev server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you're good to go.

# Deploy

Two options depending on your setup:

- [Deploy with Vercel](#deploy-with-vercel) — fully managed, no server needed
- [Deploy with Docker](#deploy-with-docker) — self-host on your own server

---

## Deploy with Vercel

### Prerequisites

Make sure you have:

- A [GitHub](https://github.com/) account
- [Retell AI](https://www.retellai.com/) API key
- [OpenAI](https://platform.openai.com/) API key

---

### Step 1 — Fork the repo

Fork [brijeshmarch16/openhire](https://github.com/brijeshmarch16/openhire) on GitHub.

### Step 2 — Deploy to Vercel

Go to [vercel.com](https://vercel.com/), click **Add New Project**, and import your forked repo.

### Step 3 — Add a Neon Postgres database

In your Vercel project, go to the **Storage** tab, click **Create Database**, and select **Neon Postgres**. Vercel creates the database and automatically sets `DATABASE_URL` in your environment variables.

### Step 4 — Add environment variables

In your Vercel project, go to **Settings → Environment Variables** and add:

| Variable | What to put here |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL (e.g. `https://your-app.vercel.app`) |
| `BETTER_AUTH_URL` | Your Vercel URL |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` and paste the output |
| `RETELL_API_KEY` | From [Retell AI dashboard](https://dashboard.retellai.com/apiKey) |
| `OPENAI_API_KEY` | From [OpenAI platform](https://platform.openai.com/api-keys) |

### Step 5 — Set the build command

In your Vercel project, go to **Settings → Build & Development Settings** and set the **Build Command** to:

```bash
pnpm db:migrate && pnpm db:seed && pnpm build
```

This runs migrations and seeds the database automatically on every deploy. The seed script is safe to run multiple times — it skips if data already exists.

### Step 6 — Redeploy

Trigger a redeployment in Vercel — your app will go live.

---

## Deploy with Docker

### Prerequisites

Make sure you have:

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js](https://nodejs.org/) (v18 or higher) and [pnpm](https://pnpm.io/installation) — needed to run migrations locally before starting the container
- A PostgreSQL database — self-hosted or [Neon](https://neon.tech/), etc.
- [Retell AI](https://www.retellai.com/) API key
- [OpenAI](https://platform.openai.com/) API key

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/brijeshmarch16/openhire.git
cd openhire
```

### Step 2 — Install dependencies

```bash
pnpm install
```

### Step 3 — Enable standalone output

Open `next.config.js` and uncomment the `output` line:

```js
const nextConfig = {
  output: "standalone",
  // ...
};
```

This tells Next.js to produce a self-contained build that Docker can run without `node_modules`.

### Step 4 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in each value:

| Variable | What to put here |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://your-server-ip:3000` |
| `BETTER_AUTH_URL` | `http://your-server-ip:3000` |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` and paste the output |
| `DATABASE_URL` | Your Postgres connection string |
| `RETELL_API_KEY` | From [Retell AI dashboard](https://dashboard.retellai.com/apiKey) |
| `OPENAI_API_KEY` | From [OpenAI platform](https://platform.openai.com/api-keys) |

### Step 5 — Run database migrations

```bash
pnpm db:migrate
```

### Step 6 — Seed the database

```bash
pnpm db:seed
```

This creates the default interviewers needed for the app.

### Step 7 — Start the app

```bash
docker-compose up --build -d
```

Open `http://your-server-ip:3000` — you're good to go.


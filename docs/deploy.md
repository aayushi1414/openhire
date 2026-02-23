# Deploy

Two options depending on your setup:

- **[Docker](#option-1--docker)** — self-host on your own server
- **[Vercel + Neon](#option-2--vercel--neon)** — fully managed, no server needed

---

## Option 1 — Docker

Best if you want to run everything on your own server.

**1. Clone the repo**

```bash
git clone https://github.com/brijeshmarch16/openhire.git
cd openhire
```

**2. Set up environment variables**

```bash
cp .env.example .env
```

Fill in your `.env` — use the [env var table](./run-locally.md#setup) in the run-locally guide as reference. Set `DATABASE_URL` to an external Postgres instance (e.g. [Neon](https://neon.tech/)) — Docker does not include a bundled database.

**3. Run database migrations**

```bash
pnpm db:migrate
```

**4. Start the app**

```bash
docker-compose up -d
```

The app will be running at `http://your-server-ip:3000`.

---

## Option 2 — Vercel + Neon

Best if you want a fast, zero-config deployment with no server to manage.

**1. Fork the repo**

Fork [brijeshmarch16/openhire](https://github.com/brijeshmarch16/openhire) on GitHub.

**2. Create a Neon database**

Sign up at [neon.tech](https://neon.tech/), create a new project, and copy the connection string.

**3. Deploy to Vercel**

Go to [vercel.com](https://vercel.com/), click **Add New Project**, and import your forked repo. Vercel detects Next.js automatically.

**4. Add environment variables**

In your Vercel project, go to **Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL (e.g. `https://your-app.vercel.app`) |
| `BETTER_AUTH_URL` | Your Vercel URL |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` and paste the output |
| `DATABASE_URL` | Your Neon connection string |
| `RETELL_API_KEY` | From [Retell AI dashboard](https://dashboard.retellai.com/apiKey) |
| `OPENAI_API_KEY` | From [OpenAI platform](https://platform.openai.com/api-keys) |

**5. Run database migrations**

The easiest way is to run migrations from your local machine against the Neon database. With your `.env` pointing at Neon:

```bash
pnpm db:migrate
```

**6. Redeploy**

Trigger a redeployment in Vercel — your app will go live with all env vars applied.

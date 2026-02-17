# Openhire

_Open-source AI interviewing platform. Self-hosted, no vendor lock-in._

<!-- Here's a [demo](https://www.loom.com/share/762fd7d12001490bbfdcf3fac37ff173?sid=9a5b2a5a-64df-4c4c-a0e7-fc9765691f81) of the app in action. -->

## Features

Generate questions from a job description → share a link → AI conducts the interview → get scored insights.

- **🎯 Interview Creation:** Instantly generate tailored interview questions from any job description.
- **🔗 One-Click Sharing:** Generate and share unique interview links with candidates in seconds.
- **🎙️ AI Voice Interviews:** Let our AI conduct natural, conversational interviews that adapt to candidate responses.
- **📊 Smart Analysis:** Get detailed insights and scores for each interview response, powered by advanced AI.
- **📈 Comprehensive Dashboard:** Track all candidate performances and overall stats.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | Better Auth (self-hosted) |
| Database | Postgres + Drizzle ORM |
| AI Voice | Retell AI |
| AI Analysis | OpenAI |
| Deployment | Docker / Vercel |

## Quickstart

1. **Clone the repo and copy the env template**

```bash
git clone https://github.com/brijeshmarch16/openhire.git
cd openhire
cp .env.example .env
```

2. **Add your API keys to `.env`** — see the [Environment Variables](#environment-variables) table below.

3. **Generate a secret for Better Auth** and set it as `BETTER_AUTH_SECRET`:

```bash
openssl rand -base64 32
```

4. **Set `BETTER_AUTH_URL`** to the base URL of your app (e.g. `http://localhost:3000`).

5. **Start Postgres** (Docker) or point `DATABASE_URL` at an existing Postgres instance (e.g. [Neon](https://neon.tech/)):

```bash
docker-compose up -d postgres
```

6. **Install dependencies and push the schema:**

```bash
pnpm install
pnpm db:push
```

7. **Start the dev server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Base URL of your app (e.g. `http://localhost:3000`) |
| `DATABASE_URL` | Postgres connection string |
| `RETELL_API_KEY` | API key from [Retell AI dashboard](https://dashboard.retellai.com/apiKey) |
| `OPENAI_API_KEY` | API key from [OpenAI platform](https://platform.openai.com/api-keys) |

## Self Hosting

**Option 1 — Docker (fully self-hosted):** Run the entire stack on your own server. The bundled `docker-compose.yml` starts both the app and a Postgres database — no external services needed.

```bash
docker-compose up -d
```

**Option 2 — Vercel + Neon:** Deploy the app to [Vercel](https://vercel.com/) and use [Neon](https://neon.tech/) for serverless Postgres. Set `DATABASE_URL` to your Neon connection string in the Vercel environment variables.

## Contributing

Contributions are welcome — fork the repo, make your changes, and open a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for details. Stars are appreciated!

## License

The software code is licensed under the MIT License.

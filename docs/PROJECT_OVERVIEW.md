# Openhire — Project Overview

> This document is the single entry point for new contributors. Read it top-to-bottom before touching any code.

---

## What Is Openhire?

Openhire is an open-source, AI-powered hiring platform that lets companies run fully automated voice interviews with candidates. It was originally developed as **FoloUp** and is being actively evolved into a self-hostable, vendor-independent alternative.

**Core user journey:**

1. Recruiter creates an interview (name, objective, questions, duration, AI interviewer persona)
2. A shareable link is generated and sent to the candidate
3. Candidate opens the link, enters their name/email, and starts a voice call with an AI interviewer
4. The AI conducts the interview using Retell AI's voice call infrastructure
5. When the call ends, a webhook fires and triggers OpenAI-powered analysis
6. Recruiter reviews per-candidate analytics (score, communication grade, question summaries) on the dashboard

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16, App Router, TypeScript | `--webpack` flag due to Turbopack incompatibilities |
| Auth | `@clerk/nextjs` v6 with Organizations | **Migration target: Better Auth** |
| Database | Supabase JS SDK (`@supabase/supabase-js`) | Used as Postgres REST wrapper only — no RLS/realtime |
| ORM | Prisma installed as devDep, **not used** | **Migration target: Drizzle ORM** |
| UI | shadcn/ui + Radix UI + MUI + Tailwind CSS | MUI used only for charts (`@mui/x-charts`) |
| AI — Voice | Retell AI (`retell-sdk`, `retell-client-js-sdk`) | Manages voice calls and webhooks |
| AI — Text | OpenAI GPT-4o (`openai`, `langchain`) | Question generation, transcript analysis, insights |
| State | React Context + TanStack React Query | Contexts for auth-scoped data; React Query where needed |
| Forms | React Hook Form + Zod | All dashboard forms |
| Linter | Biome | Replaces ESLint + Prettier |
| Package Manager | npm / yarn | `yarn dev` to start |
| Containers | Docker + Docker Compose | App only; no DB service yet |

---

## Folder Structure

```
openhire/
├── src/
│   ├── app/
│   │   ├── (client)/              # Authenticated recruiter app
│   │   │   ├── dashboard/         # Main dashboard + interviewers tab
│   │   │   │   ├── page.tsx
│   │   │   │   └── interviewers/page.tsx
│   │   │   ├── interviews/
│   │   │   │   └── [interviewId]/page.tsx  # Per-interview response list
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   │   └── layout.tsx         # ClerkProvider + Navbar + SideMenu
│   │   │
│   │   ├── (user)/                # Public candidate-facing routes
│   │   │   ├── call/[interviewId]/page.tsx  # Candidate interview call UI
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── analyze-communication/route.ts
│   │   │   ├── create-interview/route.ts
│   │   │   ├── create-interviewer/route.ts
│   │   │   ├── generate-insights/route.ts
│   │   │   ├── generate-interview-questions/route.ts
│   │   │   ├── get-call/route.ts
│   │   │   ├── register-call/route.ts
│   │   │   ├── response-webhook/route.ts
│   │   │   └── auth/[...all]/     # Empty — ready for Better Auth handler
│   │   │
│   │   ├── globals.css
│   │   └── layout.tsx             # Root layout (fonts, metadata)
│   │
│   ├── components/
│   │   ├── call/                  # Candidate-side call UI components
│   │   ├── dashboard/
│   │   │   ├── interview/         # Interview card, create modal, edit form
│   │   │   └── interviewer/       # Interviewer card, create button
│   │   ├── loaders/               # Full-page, inline, and mini spinners
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── navbar.tsx
│   │   ├── sideMenu.tsx
│   │   └── providers.tsx          # Composed React context tree
│   │
│   ├── contexts/
│   │   ├── clients.context.tsx    # Current user + organization
│   │   ├── interviews.context.tsx # Interview list for current org
│   │   ├── interviewers.context.tsx
│   │   └── responses.context.tsx
│   │
│   ├── services/                  # All database access goes here
│   │   ├── clients.service.ts
│   │   ├── interviews.service.ts
│   │   ├── interviewers.service.ts
│   │   ├── responses.service.ts
│   │   ├── feedback.service.ts
│   │   └── analytics.service.ts
│   │
│   ├── lib/
│   │   ├── prompts/               # OpenAI prompt templates
│   │   │   ├── analytics.ts
│   │   │   ├── communication-analysis.ts
│   │   │   ├── generate-insights.ts
│   │   │   └── generate-questions.ts
│   │   ├── auth/                  # Empty — ready for Better Auth config
│   │   ├── db/schema/             # Empty — ready for Drizzle schema
│   │   ├── constants.ts           # Retell agent prompt, interviewer presets
│   │   ├── enum.tsx               # CandidateStatus enum
│   │   ├── compose.tsx            # Context provider composition utility
│   │   ├── logger.ts
│   │   └── utils.ts
│   │
│   ├── types/
│   │   ├── database.types.ts      # Supabase-generated types (to be replaced)
│   │   ├── interview.ts
│   │   ├── interviewer.ts
│   │   ├── response.ts
│   │   ├── organization.ts
│   │   └── user.ts
│   │
│   └── actions/
│       └── parse-pdf.ts           # Server action: parse uploaded CV/resume
│
├── supabase_schema.sql            # Source of truth for DB schema
├── Dockerfile                     # App container (Node 18, yarn build)
├── docker-compose.yml             # App service only (no DB yet)
├── .env.example
├── biome.json
├── tailwind.config.ts
└── next.config.js
```

---

## Data Model

Six tables, all in a single Postgres database. Foreign key relationships shown below.

```
organization
  └── user (organization_id → organization.id)
  └── interview (organization_id → organization.id)
        └── response (interview_id → interview.id)
        └── feedback (interview_id → interview.id)

interviewer
  └── interview (interviewer_id → interviewer.id)
```

### Table Reference

#### `organization`
| Column | Type | Notes |
|---|---|---|
| id | text (UUID) | Primary key |
| created_at | timestamptz | |
| name | text | Company name |
| image_url | text | Logo URL |
| allowed_responses_count | integer | Response quota for plan |
| plan | enum | `free`, `pro`, `free_trial_over` |

#### `user`
| Column | Type | Notes |
|---|---|---|
| id | text | Primary key (Clerk user ID) |
| created_at | timestamptz | |
| email | text | |
| organization_id | text | FK → organization.id |

#### `interviewer`
| Column | Type | Notes |
|---|---|---|
| id | serial | Primary key |
| created_at | timestamptz | |
| agent_id | text | Retell AI agent ID |
| name | text | e.g. "Explorer Lisa" |
| description | text | |
| image | text | Path to avatar image |
| audio | text | Path to sample audio |
| empathy | integer | 0–10 |
| exploration | integer | 0–10 |
| rapport | integer | 0–10 |
| speed | integer | 0–10 |

#### `interview`
| Column | Type | Notes |
|---|---|---|
| id | text (UUID) | Primary key |
| created_at | timestamptz | |
| name | text | |
| description | text | AI-generated |
| objective | text | Recruiter-written |
| organization_id | text | FK → organization.id |
| user_id | text | FK → user.id |
| interviewer_id | integer | FK → interviewer.id |
| is_active | boolean | Accepting new responses? |
| is_anonymous | boolean | Skip candidate name/email? |
| is_archived | boolean | Soft delete |
| logo_url | text | |
| theme_color | text | Hex color |
| url | text | Full interview URL |
| readable_slug | text | Human-readable URL slug |
| questions | jsonb | `[{id, question, follow_up_count}]` |
| quotes | jsonb[] | Notable candidate quotes |
| insights | text[] | AI-generated aggregate insights |
| respondents | text[] | List of candidate emails |
| question_count | integer | |
| response_count | integer | |
| time_duration | text | e.g. "15 minutes" |

#### `response`
| Column | Type | Notes |
|---|---|---|
| id | serial | Primary key |
| created_at | timestamptz | |
| interview_id | text | FK → interview.id |
| name | text | Candidate name |
| email | text | |
| call_id | text | Retell call ID |
| candidate_status | text | `NO_STATUS`, `NOT_SELECTED`, `POTENTIAL`, `SELECTED` |
| duration | integer | Call duration in seconds |
| details | jsonb | Full Retell call object |
| analytics | jsonb | OpenAI analysis result |
| is_analysed | boolean | |
| is_ended | boolean | |
| is_viewed | boolean | Recruiter viewed? |
| tab_switch_count | integer | Anti-cheat metric |

#### `feedback`
| Column | Type | Notes |
|---|---|---|
| id | serial | Primary key |
| created_at | timestamptz | |
| interview_id | text | FK → interview.id |
| email | text | Candidate email |
| feedback | text | Free-text feedback |
| satisfaction | integer | 1–5 rating |

---

## Key Flows

### 1. Create Interview (Recruiter)
```
Dashboard → "Create Interview" button
  → /api/generate-interview-questions (OpenAI → questions + description)
  → User reviews/edits questions
  → /api/create-interview (saves to DB, generates URL + readable_slug)
  → Interview card appears on dashboard
```

### 2. Share Interview (Recruiter)
```
Interview card → "Share" button
  → Copy shareable URL: /{readable_slug} or /call/{interviewId}
  → Send to candidates
```

### 3. Candidate Call
```
Candidate opens URL
  → Enters name + email (unless is_anonymous)
  → /api/register-call (registers Retell call with dynamic variables)
  → Retell WebRTC call starts in browser
  → AI interviewer conducts voice interview
  → Candidate ends call
  → Retell webhook fires → /api/response-webhook
```

### 4. Post-Call Analysis
```
Retell: call_analyzed event → /api/response-webhook
  → Fetches transcript and call details
  → /api/get-call → analytics.service.ts
      → OpenAI: overall score, communication grade, question summaries, soft skills
      → /api/analyze-communication → communication score + quotes
  → Saves analytics to response.analytics (jsonb)
  → Updates interview.insights if enough responses
```

### 5. Dashboard Review (Recruiter)
```
/dashboard → lists all interviews for org
  → Click interview → /interviews/[interviewId]
  → Lists all responses with score, duration, status
  → Click response → view full analytics, transcript, recording
  → Update candidate_status (SELECTED / POTENTIAL / NOT_SELECTED)
```

---

## Authentication (Current: Clerk)

The app uses Clerk for all authentication. Key integration points:

| Clerk Feature | Used In | Purpose |
|---|---|---|
| `ClerkProvider` | `(client)/layout.tsx` | Wraps entire recruiter app |
| `useClerk()` | contexts | Get current user + org ID |
| `useOrganization()` | contexts | Multi-tenant org data |
| `UserButton` | `navbar.tsx` | Profile menu + logout |
| `OrganizationSwitcher` | `navbar.tsx` | Switch between orgs |
| `SignIn` component | `sign-in/[[...sign-in]]/page.tsx` | Clerk hosted sign-in |
| `SignUp` component | `sign-up/[[...sign-up]]/page.tsx` | Clerk hosted sign-up |
| Catch-all routes | `[[...sign-in]]`, `[[...sign-up]]` | Clerk SPA routing |

**Important:** `src/app/api/auth/[...all]/` and `src/lib/auth/` are already empty directories — they were created in preparation for the Better Auth migration.

---

## Database Access (Current: Supabase SDK)

All database access goes through `src/services/`. Each service file creates a Supabase client and uses its REST API:

```typescript
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(url, key);
const { data } = await supabase.from("interview").select("*").eq("id", id);
```

**What Supabase features are used:**
- Row selection, insertion, update, deletion (REST API)
- `.eq()`, `.in()`, `.select()` query builder
- **NOT used:** Supabase Auth, RLS, Realtime, Storage, Edge Functions

This means migrating to Drizzle ORM is straightforward — only the query syntax changes.

---

## API Routes Map

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/create-interview` | POST | Internal | Create interview record in DB |
| `/api/create-interviewer` | GET | Internal | Seed default AI interviewers |
| `/api/generate-interview-questions` | POST | Internal | OpenAI → questions + description |
| `/api/generate-insights` | POST | Internal | OpenAI → aggregate insights from responses |
| `/api/register-call` | POST | Public | Register Retell voice call |
| `/api/get-call` | POST | Internal | Fetch call details + trigger analysis |
| `/api/analyze-communication` | POST | Internal | OpenAI → communication score |
| `/api/response-webhook` | POST | Retell sig | Webhook: call_started / call_ended / call_analyzed |
| `/api/auth/[...all]` | ANY | — | **Empty — ready for Better Auth** |

---

## Environment Variables

```bash
# Auth (Clerk — will be replaced with Better Auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database (Supabase — will be replaced with Postgres + Drizzle)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Voice AI
RETELL_API_KEY=key_...

# Text AI
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_LIVE_URL=localhost:3000   # Base URL for shareable links
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- A Supabase project with the schema from `supabase_schema.sql` applied
- A Clerk application (free tier works)
- Retell AI account + API key
- OpenAI API key

### Steps

```bash
# 1. Clone and install
git clone https://github.com/your-org/openhire.git
cd openhire
yarn install       # or: npm install

# 2. Configure environment
cp .env.example .env
# Fill in all keys in .env

# 3. Seed interviewers (one-time)
curl -X GET http://localhost:3000/api/create-interviewer

# 4. Start development server
yarn dev           # Runs on http://localhost:3000
```

### Docker (App Only)

```bash
docker compose up --build
```

> **Note:** Docker Compose currently runs the app only. A Postgres service will be added as part of the database migration. For now you still need external Supabase credentials.

---

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

### Active migration tracks (pick one to contribute):

| Track | Guide |
|---|---|
| Auth: Clerk → Better Auth | [docs/migration/01-auth-migration.md](migration/01-auth-migration.md) |
| DB: Supabase → Postgres + Drizzle | [docs/migration/02-database-migration.md](migration/02-database-migration.md) |

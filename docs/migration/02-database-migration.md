# Database Migration: Supabase SDK → Postgres + Drizzle ORM

> **Status:** Planned — not started
> **Priority:** Do this before the auth migration — Better Auth needs a working Postgres connection.
> **Scope:** Replace all Supabase JS SDK calls with Drizzle ORM queries. Schema stays identical. No data migrations required for fresh installs.

---

## Why Drizzle ORM?

| Concern | Supabase SDK | Drizzle ORM |
|---|---|---|
| Vendor lock-in | High (Supabase-specific API) | None (plain SQL driver) |
| Self-hostable | No (Supabase platform) | Yes (any Postgres) |
| Type safety | Generated types only | Fully inferred from schema |
| Serverless-friendly | Yes | Yes (no binary engine unlike Prisma) |
| SQL-first | No (REST abstraction) | Yes (writes readable SQL) |
| Bundle size | Large | Small |
| Migrations | Supabase CLI | drizzle-kit (included) |
| ORM approach | REST wrapper | SQL query builder |

> **Note on Prisma:** Prisma is already installed as a devDependency but is unused (`src/lib/db/schema/` is empty and Prisma is never called). We will use Drizzle instead — it has no binary engine, which makes it serverless-friendly and simpler to deploy on Vercel.

---

## Current State

All database access happens in `src/services/` via the Supabase JS client:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Example call
const { data, error } = await supabase
  .from("interview")
  .select("*")
  .eq("id", interviewId)
  .single();
```

**What Supabase features are used (and are safe to drop):**

- `.from()`, `.select()`, `.eq()`, `.in()`, `.insert()`, `.update()`, `.delete()` — all map directly to SQL
- **Not used:** Supabase Auth, Row Level Security, Realtime subscriptions, Storage, Edge Functions

---

## Packages

### Add

```bash
npm install drizzle-orm pg
npm install --save-dev drizzle-kit @types/pg
```

### Remove

```bash
npm uninstall @supabase/supabase-js @supabase/auth-helpers-nextjs
npm uninstall --save-dev prisma @prisma/client  # remove unused Prisma
```

---

## Step-by-Step Migration

### Step 1: Set Up the Drizzle Client

Create `src/lib/db/index.ts`:

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  // For Neon (serverless Postgres on Vercel), use:
  // ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
```

> **Vercel / Neon:** Use `drizzle-orm/neon-http` + `@neondatabase/serverless` for edge-compatible connections. For local Docker Postgres, the `pg` pool above works fine.

### Step 2: Write the Drizzle Schema

Create `src/lib/db/schema/index.ts` to mirror `supabase_schema.sql` exactly:

```typescript
import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  serial,
  jsonb,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const planEnum = pgEnum("plan", ["free", "pro", "free_trial_over"]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  name: text("name"),
  imageUrl: text("image_url"),
  allowedResponsesCount: integer("allowed_responses_count"),
  plan: planEnum("plan"),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  email: text("email"),
  organizationId: text("organization_id").references(() => organization.id),
});

export const interviewer = pgTable("interviewer", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  agentId: text("agent_id"),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  audio: text("audio"),
  empathy: integer("empathy").notNull(),
  exploration: integer("exploration").notNull(),
  rapport: integer("rapport").notNull(),
  speed: integer("speed").notNull(),
});

export const interview = pgTable("interview", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  name: text("name"),
  description: text("description"),
  objective: text("objective"),
  organizationId: text("organization_id").references(() => organization.id),
  userId: text("user_id").references(() => user.id),
  interviewerId: integer("interviewer_id").references(() => interviewer.id),
  isActive: boolean("is_active").default(true),
  isAnonymous: boolean("is_anonymous").default(false),
  isArchived: boolean("is_archived").default(false),
  logoUrl: text("logo_url"),
  themeColor: text("theme_color"),
  url: text("url"),
  readableSlug: text("readable_slug"),
  questions: jsonb("questions"),
  quotes: jsonb("quotes"),
  insights: text("insights").array(),
  respondents: text("respondents").array(),
  questionCount: integer("question_count"),
  responseCount: integer("response_count"),
  timeDuration: text("time_duration"),
});

export const response = pgTable("response", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  interviewId: text("interview_id").references(() => interview.id),
  name: text("name"),
  email: text("email"),
  callId: text("call_id"),
  candidateStatus: text("candidate_status"),
  duration: integer("duration"),
  details: jsonb("details"),
  analytics: jsonb("analytics"),
  isAnalysed: boolean("is_analysed").default(false),
  isEnded: boolean("is_ended").default(false),
  isViewed: boolean("is_viewed").default(false),
  tabSwitchCount: integer("tab_switch_count"),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  interviewId: text("interview_id").references(() => interview.id),
  email: text("email"),
  feedback: text("feedback"),
  satisfaction: integer("satisfaction"),
});
```

### Step 3: Configure drizzle-kit

Create `drizzle.config.ts` in the project root:

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

### Step 4: Replace Supabase Types

**File:** `src/types/database.types.ts`

Replace the Supabase-generated types with Drizzle inferred types:

```typescript
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
  organization,
  user,
  interviewer,
  interview,
  response,
  feedback,
} from "@/lib/db/schema";

// Select types (for reading from DB)
export type Organization = InferSelectModel<typeof organization>;
export type User = InferSelectModel<typeof user>;
export type Interviewer = InferSelectModel<typeof interviewer>;
export type Interview = InferSelectModel<typeof interview>;
export type Response = InferSelectModel<typeof response>;
export type Feedback = InferSelectModel<typeof feedback>;

// Insert types (for writing to DB)
export type NewOrganization = InferInsertModel<typeof organization>;
export type NewUser = InferInsertModel<typeof user>;
export type NewInterviewer = InferInsertModel<typeof interviewer>;
export type NewInterview = InferInsertModel<typeof interview>;
export type NewResponse = InferInsertModel<typeof response>;
export type NewFeedback = InferInsertModel<typeof feedback>;
```

Update imports in `src/types/interview.ts`, `user.ts`, `organization.ts`, `response.ts`, `interviewer.ts` to reference the new types from `database.types.ts` or directly from `@/lib/db/schema`.

### Step 5: Migrate Each Service File

For each service, replace the Supabase client with Drizzle queries. The mapping is direct: Supabase's `.eq()` becomes Drizzle's `eq()`, etc.

#### Query Translation Reference

| Supabase SDK | Drizzle ORM |
|---|---|
| `.from("table").select("*")` | `db.select().from(table)` |
| `.eq("column", value)` | `where(eq(table.column, value))` |
| `.in("column", [a, b])` | `where(inArray(table.column, [a, b]))` |
| `.select("col1, col2")` | `.select({ col1: table.col1, col2: table.col2 })` |
| `.insert(data).select()` | `db.insert(table).values(data).returning()` |
| `.update(data).eq("id", id)` | `db.update(table).set(data).where(eq(table.id, id))` |
| `.delete().eq("id", id)` | `db.delete(table).where(eq(table.id, id))` |
| `.single()` | `.then(rows => rows[0])` or use `limit(1)` |

---

#### `src/services/clients.service.ts`

```typescript
import { db } from "@/lib/db";
import { user, organization } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getClientById(
  id: string,
  email: string,
  organization_id: string
) {
  const existing = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [created] = await db
    .insert(user)
    .values({ id, email, organizationId: organization_id })
    .returning();

  return created;
}

export async function getOrganizationById(
  organization_id: string,
  organization_name: string
) {
  const existing = await db
    .select()
    .from(organization)
    .where(eq(organization.id, organization_id))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [created] = await db
    .insert(organization)
    .values({
      id: organization_id,
      name: organization_name,
      plan: "free",
      allowedResponsesCount: 100,
    })
    .returning();

  return created;
}

export async function updateOrganization(
  payload: Partial<typeof organization.$inferInsert>,
  id: string
) {
  const [updated] = await db
    .update(organization)
    .set(payload)
    .where(eq(organization.id, id))
    .returning();

  return updated;
}
```

---

#### `src/services/interviews.service.ts`

```typescript
import { db } from "@/lib/db";
import { interview } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";

export async function getAllInterviews(userId: string, organizationId: string) {
  return db
    .select()
    .from(interview)
    .where(
      or(
        eq(interview.userId, userId),
        eq(interview.organizationId, organizationId)
      )
    );
}

export async function getInterviewById(id: string) {
  const rows = await db
    .select()
    .from(interview)
    .where(or(eq(interview.id, id), eq(interview.readableSlug, id)))
    .limit(1);

  return rows[0] ?? null;
}

export async function createInterview(
  payload: typeof interview.$inferInsert
) {
  const [created] = await db.insert(interview).values(payload).returning();
  return created;
}

export async function updateInterview(
  payload: Partial<typeof interview.$inferInsert>,
  id: string
) {
  const [updated] = await db
    .update(interview)
    .set(payload)
    .where(eq(interview.id, id))
    .returning();

  return updated;
}

export async function deleteInterview(id: string) {
  return db.delete(interview).where(eq(interview.id, id));
}
```

---

#### `src/services/interviewers.service.ts`

```typescript
import { db } from "@/lib/db";
import { interviewer } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getAllInterviewers() {
  return db.select().from(interviewer);
}

export async function createInterviewer(
  payload: typeof interviewer.$inferInsert
) {
  const existing = await db
    .select()
    .from(interviewer)
    .where(eq(interviewer.name, payload.name!))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [created] = await db.insert(interviewer).values(payload).returning();
  return created;
}

export async function getInterviewer(interviewerId: number) {
  const rows = await db
    .select()
    .from(interviewer)
    .where(eq(interviewer.id, interviewerId))
    .limit(1);

  return rows[0] ?? null;
}
```

---

#### `src/services/responses.service.ts`

```typescript
import { db } from "@/lib/db";
import { response, interview } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export async function createResponse(
  payload: typeof response.$inferInsert
) {
  const [created] = await db.insert(response).values(payload).returning();
  return created;
}

export async function saveResponse(
  payload: Partial<typeof response.$inferInsert>,
  call_id: string
) {
  const [updated] = await db
    .update(response)
    .set(payload)
    .where(eq(response.callId, call_id))
    .returning();

  return updated;
}

export async function getAllResponses(interviewId: string) {
  return db
    .select()
    .from(response)
    .where(eq(response.interviewId, interviewId));
}

export async function getResponseByCallId(callId: string) {
  const rows = await db
    .select()
    .from(response)
    .where(eq(response.callId, callId))
    .limit(1);

  return rows[0] ?? null;
}

export async function updateResponse(
  payload: Partial<typeof response.$inferInsert>,
  call_id: string
) {
  return saveResponse(payload, call_id);
}

export async function deleteResponse(id: number) {
  return db.delete(response).where(eq(response.id, id));
}

export async function getResponseCountByOrganizationId(organizationId: string) {
  const rows = await db
    .select({ count: count() })
    .from(response)
    .innerJoin(interview, eq(response.interviewId, interview.id))
    .where(eq(interview.organizationId, organizationId));

  return rows[0]?.count ?? 0;
}

export async function getAllEmails(interviewId: string) {
  const rows = await db
    .select({ email: response.email })
    .from(response)
    .where(eq(response.interviewId, interviewId));

  return rows.map((r) => r.email);
}
```

---

#### `src/services/feedback.service.ts`

```typescript
import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";

export async function submitFeedback(
  payload: typeof feedback.$inferInsert
) {
  const [created] = await db.insert(feedback).values(payload).returning();
  return created;
}
```

---

#### `src/services/analytics.service.ts`

No database calls — this service calls OpenAI and returns data for callers to persist. No changes needed beyond updating import types from `database.types.ts`.

---

### Step 6: Add Postgres to Docker Compose

Update `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: openhire
      POSTGRES_PASSWORD: openhire
      POSTGRES_DB: openhire
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U openhire"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - "${DOCKER_PORT:-3000}:3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://openhire:openhire@postgres:5432/openhire
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres_data:
```

### Step 7: Update Environment Variables

**Remove from `.env.example`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

**Add to `.env.example`:**
```bash
# Postgres (local Docker)
DATABASE_URL=postgresql://openhire:openhire@localhost:5432/openhire

# Postgres (Neon / Vercel — use this for production)
# DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/openhire?sslmode=require
```

### Step 8: Initialize the Database

For local development with Docker:

```bash
# Start Postgres
docker compose up postgres -d

# Push schema (creates tables directly — good for development)
npm run db:push

# Or generate + apply a migration file (recommended for production)
npm run db:generate
npm run db:migrate
```

For production (Vercel + Neon):

```bash
# Set DATABASE_URL in Vercel environment settings, then:
DATABASE_URL="postgresql://..." npm run db:migrate
```

---

## Connection Strategy

### Local Development (Docker)

```
DATABASE_URL=postgresql://openhire:openhire@localhost:5432/openhire
```

Use `drizzle-orm/node-postgres` with a `pg.Pool` — already shown in Step 1.

### Production (Vercel + Neon)

Neon is the recommended serverless Postgres provider for Vercel deployments. It provides:
- HTTP-based connections (no persistent TCP — works in Vercel serverless functions)
- Automatic branching for preview environments
- Free tier sufficient for small deployments

Update `src/lib/db/index.ts` for Neon:

```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

And install the Neon driver:

```bash
npm install @neondatabase/serverless
npm install drizzle-orm/neon-http  # already in drizzle-orm, just use the import
```

For a unified setup that works both locally and on Vercel, use an environment variable to switch:

```typescript
import * as schema from "./schema";

function createDb() {
  if (process.env.NODE_ENV === "production" || process.env.USE_NEON === "true") {
    const { drizzle } = await import("drizzle-orm/neon-http");
    const { neon } = await import("@neondatabase/serverless");
    return drizzle(neon(process.env.DATABASE_URL!), { schema });
  }
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const { Pool } = await import("pg");
  return drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }), { schema });
}
```

Or simpler: use `drizzle-orm/node-postgres` everywhere and add `?sslmode=require` to the Neon connection string — this also works.

---

## Files to Touch (Checklist)

| File | Action | Notes |
|---|---|---|
| `src/lib/db/index.ts` | Create | Drizzle client |
| `src/lib/db/schema/index.ts` | Create | Full schema mirroring supabase_schema.sql |
| `drizzle.config.ts` | Create | drizzle-kit configuration |
| `src/types/database.types.ts` | Replace | Supabase types → Drizzle inferred types |
| `src/services/clients.service.ts` | Rewrite | Drizzle queries |
| `src/services/interviews.service.ts` | Rewrite | Drizzle queries |
| `src/services/interviewers.service.ts` | Rewrite | Drizzle queries |
| `src/services/responses.service.ts` | Rewrite | Drizzle queries |
| `src/services/feedback.service.ts` | Rewrite | Drizzle queries |
| `src/services/analytics.service.ts` | Update imports only | No DB calls in this service |
| `docker-compose.yml` | Edit | Add Postgres service |
| `.env.example` | Edit | Replace Supabase keys with `DATABASE_URL` |
| `package.json` | Edit | Add drizzle-orm, drizzle-kit, pg; remove @supabase packages |

---

## Migration Checklist

- [ ] `drizzle-orm`, `drizzle-kit`, `pg`, `@types/pg` installed
- [ ] `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs` uninstalled
- [ ] `prisma`, `@prisma/client` uninstalled (unused)
- [ ] `src/lib/db/index.ts` created
- [ ] `src/lib/db/schema/index.ts` created with all 6 tables + plan enum
- [ ] `drizzle.config.ts` created
- [ ] `package.json` scripts updated with `db:generate`, `db:migrate`, `db:push`, `db:studio`
- [ ] Postgres running (Docker locally or Neon for production)
- [ ] `DATABASE_URL` set in `.env`
- [ ] `npm run db:push` succeeds (tables created)
- [ ] `src/types/database.types.ts` updated to Drizzle types
- [ ] `clients.service.ts` rewritten
- [ ] `interviews.service.ts` rewritten
- [ ] `interviewers.service.ts` rewritten
- [ ] `responses.service.ts` rewritten
- [ ] `feedback.service.ts` rewritten
- [ ] `docker-compose.yml` updated with Postgres service
- [ ] `.env.example` updated
- [ ] App starts without Supabase errors (`yarn dev`)
- [ ] Create interview flow works end-to-end
- [ ] Response webhook writes to DB correctly
- [ ] Analytics query returns expected data

---

## Troubleshooting

**`ECONNREFUSED` — Cannot connect to Postgres**

Ensure Docker Postgres is running:
```bash
docker compose up postgres -d
docker compose logs postgres
```

Verify `DATABASE_URL` matches Docker Compose config:
```bash
postgresql://openhire:openhire@localhost:5432/openhire
```

**`relation "interview" does not exist`**

Tables haven't been created. Run:
```bash
npm run db:push
```

**Type errors after replacing Supabase types**

Run TypeScript check to find remaining Supabase type imports:
```bash
npx tsc --noEmit 2>&1 | grep supabase
```

Replace each with the corresponding Drizzle type from `database.types.ts`.

**`column "organization_id" does not exist` (camelCase vs snake_case)**

Drizzle maps camelCase field names to snake_case column names via the second argument in column definitions. Verify the column name strings in `schema/index.ts` match the actual Postgres column names from `supabase_schema.sql`.

**Neon connection timeout on Vercel**

Add `?connect_timeout=10` or `?sslmode=require` to the connection string. Make sure you are using `drizzle-orm/neon-http` (not `node-postgres`) for Vercel serverless functions.

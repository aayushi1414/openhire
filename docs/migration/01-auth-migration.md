# Auth Migration: Clerk → Better Auth

> **Status:** Planned — not started
> **Depends on:** DB migration (`02-database-migration.md`) must be done first (Better Auth stores sessions in Postgres)
> **Scope:** Replace all Clerk SDK calls with Better Auth equivalents. No user-facing behavior changes.

---

## Why Better Auth?

| Concern | Clerk | Better Auth |
|---|---|---|
| Open source | No (SaaS) | Yes (MIT) |
| Self-hostable | No | Yes |
| Vendor lock-in | High | None |
| Organization/team support | Yes (built-in) | Yes (organizations plugin) |
| Next.js adapter | Yes | Yes (`better-auth/next-js`) |
| Cost at scale | Expensive (per MAU) | Free (self-hosted) |
| Data ownership | Clerk servers | Your Postgres database |
| Custom session tables | No | Yes (full control) |

Better Auth is the natural replacement: it has an organizations plugin that maps directly to Clerk's Organizations feature, a Next.js server adapter for App Router, and stores everything in your own Postgres database.

---

## Prerequisites

- [ ] Database migration complete (`02-database-migration.md`) — Better Auth needs Postgres
- [ ] Drizzle ORM set up and `DATABASE_URL` configured

---

## What Clerk Features Are Used

A complete audit of every Clerk touchpoint in the codebase:

| Clerk API | File(s) | Purpose |
|---|---|---|
| `<ClerkProvider>` | `src/app/(client)/layout.tsx` | Session context for entire recruiter app |
| `useClerk()` | `src/contexts/clients.context.tsx` | Get `userId` for DB queries |
| `useOrganization()` | `src/contexts/clients.context.tsx`, `interviews.context.tsx`, `interviewers.context.tsx` | Get `organization.id` and `organization.name` |
| `<UserButton>` | `src/components/navbar.tsx` | Profile dropdown + logout |
| `<OrganizationSwitcher>` | `src/components/navbar.tsx` | Switch between orgs |
| `<SignIn>` component | `src/app/(client)/sign-in/[[...sign-in]]/page.tsx` | Hosted sign-in UI |
| `<SignUp>` component | `src/app/(client)/sign-up/[[...sign-up]]/page.tsx` | Hosted sign-up UI |
| Catch-all route `[[...sign-in]]` | Directory name | Clerk SPA routing pattern |
| Catch-all route `[[...sign-up]]` | Directory name | Clerk SPA routing pattern |
| Clerk middleware | `middleware.ts` | Route protection |

---

## Better Auth Equivalents

| Clerk | Better Auth |
|---|---|
| `<ClerkProvider>` | No provider needed server-side; `authClient` on client |
| `useClerk().userId` | `useSession().data.user.id` |
| `useOrganization().organization.id` | `useActiveOrganization().data.id` (organizations plugin) |
| `useOrganization().organization.name` | `useActiveOrganization().data.name` |
| `<UserButton>` | Custom component using `authClient.signOut()` |
| `<OrganizationSwitcher>` | Custom component using `authClient.organization.list()` + `setActive()` |
| `<SignIn>` | Custom form or Better Auth pre-built UI |
| `<SignUp>` | Custom form or Better Auth pre-built UI |
| Clerk middleware | Better Auth `getSession()` in middleware |
| Clerk webhooks | Not needed — Better Auth is self-hosted |

---

## Database Tables Required by Better Auth

Better Auth will create and own these tables via its migration tool. They sit alongside the existing app tables.

```sql
-- Better Auth core tables (auto-created by better-auth/migrate)

CREATE TABLE "user" (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  image       TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE session (
  id          TEXT PRIMARY KEY,
  expires_at  TIMESTAMP NOT NULL,
  token       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now(),
  ip_address  TEXT,
  user_agent  TEXT,
  user_id     TEXT NOT NULL REFERENCES "user"(id)
);

CREATE TABLE account (
  id                    TEXT PRIMARY KEY,
  account_id            TEXT NOT NULL,
  provider_id           TEXT NOT NULL,
  user_id               TEXT NOT NULL REFERENCES "user"(id),
  access_token          TEXT,
  refresh_token         TEXT,
  id_token              TEXT,
  access_token_expires_at TIMESTAMP,
  refresh_token_expires_at TIMESTAMP,
  scope                 TEXT,
  password              TEXT,
  created_at            TIMESTAMP NOT NULL DEFAULT now(),
  updated_at            TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE verification (
  id          TEXT PRIMARY KEY,
  identifier  TEXT NOT NULL,
  value       TEXT NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP,
  updated_at  TIMESTAMP
);

-- Organizations plugin tables

CREATE TABLE organization (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  logo        TEXT,
  metadata    TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE member (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organization(id),
  user_id         TEXT NOT NULL REFERENCES "user"(id),
  role            TEXT NOT NULL DEFAULT 'member',
  created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE invitation (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organization(id),
  email           TEXT NOT NULL,
  role            TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  expires_at      TIMESTAMP NOT NULL,
  inviter_id      TEXT NOT NULL REFERENCES "user"(id)
);
```

> **Important:** The existing `organization` table in `supabase_schema.sql` has different columns (`allowed_responses_count`, `plan`, `image_url`). You must reconcile these two schemas. The recommended approach is to keep the Better Auth `organization` table as-is and add app-specific columns via a migration (`ALTER TABLE organization ADD COLUMN plan plan_enum NOT NULL DEFAULT 'free'`, etc.).

---

## Packages

### Add

```bash
npm install better-auth
```

### Remove

```bash
npm uninstall @clerk/nextjs
```

---

## Step-by-Step Migration

### Step 1: Configure Better Auth Server

Create `src/lib/auth/index.ts`:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization(),
    nextCookies(), // Required for Next.js App Router
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
});

export type Session = typeof auth.$Infer.Session;
```

### Step 2: Configure Better Auth Client

Create `src/lib/auth/client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_LIVE_URL
    ? `https://${process.env.NEXT_PUBLIC_LIVE_URL}`
    : "http://localhost:3000",
  plugins: [organizationClient()],
});

export const {
  useSession,
  useActiveOrganization,
  signIn,
  signOut,
  signUp,
} = authClient;
```

### Step 3: Add the Auth API Handler

Create `src/app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

This directory already exists (empty). Just add `route.ts`.

### Step 4: Replace `ClerkProvider` in Layout

**File:** `src/app/(client)/layout.tsx`

Before:
```typescript
import { ClerkProvider } from "@clerk/nextjs";

export default function ClientLayout({ children }) {
  return (
    <ClerkProvider>
      {/* ... */}
    </ClerkProvider>
  );
}
```

After:
```typescript
// No provider wrapper needed — Better Auth uses cookies server-side
// Client components use the authClient hooks directly

export default function ClientLayout({ children }) {
  return (
    <>
      {/* Navbar, SideMenu, etc. — no auth provider wrapper required */}
      {children}
    </>
  );
}
```

### Step 5: Replace Sign-In Page

**Old directory:** `src/app/(client)/sign-in/[[...sign-in]]/page.tsx`
**New directory:** `src/app/(client)/sign-in/page.tsx`

Rename: `[[...sign-in]]` → remove the catch-all, use a plain `page.tsx`:

```typescript
"use client";
import { signIn } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });
    if (error) setError(error.message ?? "Sign in failed");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p>{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
}
```

Style with the existing shadcn/ui `Card`, `Input`, `Button` components to match the app design.

### Step 6: Replace Sign-Up Page

**Old directory:** `src/app/(client)/sign-up/[[...sign-up]]/page.tsx`
**New directory:** `src/app/(client)/sign-up/page.tsx`

```typescript
"use client";
import { signUp } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await signUp.email({
      name,
      email,
      password,
      callbackURL: "/dashboard",
    });
    if (error) setError(error.message ?? "Sign up failed");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {error && <p>{error}</p>}
      <button type="submit">Create Account</button>
    </form>
  );
}
```

### Step 7: Replace Navbar Components

**File:** `src/components/navbar.tsx`

Remove `<UserButton>` and `<OrganizationSwitcher>`. Replace with:

```typescript
"use client";
import { useSession, useActiveOrganization, signOut, authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const { data: activeOrg } = useActiveOrganization();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
  }

  // List all orgs the user belongs to
  const { data: orgs } = authClient.useListOrganizations();

  async function handleSwitchOrg(orgId: string) {
    await authClient.organization.setActive({ organizationId: orgId });
  }

  return (
    <nav>
      {/* Logo */}
      <span>Openhire</span>

      {/* Org switcher */}
      <select
        value={activeOrg?.id ?? ""}
        onChange={(e) => handleSwitchOrg(e.target.value)}
      >
        {orgs?.map((org) => (
          <option key={org.id} value={org.id}>{org.name}</option>
        ))}
      </select>

      {/* User menu */}
      <div>
        <span>{session?.user.name}</span>
        <button type="button" onClick={handleSignOut}>Sign Out</button>
      </div>
    </nav>
  );
}
```

Restyle using shadcn/ui `DropdownMenu`, `Avatar`, and `Select` components to match the existing design.

### Step 8: Replace Clerk Hooks in Contexts

All four context files follow the same pattern. Replace Clerk hooks with Better Auth equivalents.

**Pattern — Before (Clerk):**
```typescript
import { useClerk } from "@clerk/nextjs";
import { useOrganization } from "@clerk/nextjs";

const { user } = useClerk();
const { organization } = useOrganization();
const userId = user?.id;
const organizationId = organization?.id;
const organizationName = organization?.name;
```

**Pattern — After (Better Auth):**
```typescript
import { useSession, useActiveOrganization } from "@/lib/auth/client";

const { data: session } = useSession();
const { data: activeOrg } = useActiveOrganization();
const userId = session?.user.id;
const organizationId = activeOrg?.id;
const organizationName = activeOrg?.name;
```

Apply this to each file:

- `src/contexts/clients.context.tsx`
- `src/contexts/interviews.context.tsx`
- `src/contexts/interviewers.context.tsx`
- `src/contexts/responses.context.tsx`

### Step 9: Add Middleware for Route Protection

Create or update `src/middleware.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/interviews");

  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Step 10: Run Better Auth Migrations

Better Auth provides a CLI to auto-generate the SQL for its tables:

```bash
# Generate migration SQL
npx @better-auth/cli generate

# Or with drizzle-kit push (if using Drizzle schema sync)
npx drizzle-kit push
```

If using `npx @better-auth/cli migrate` with a direct DB connection:

```bash
DATABASE_URL=your_postgres_url npx @better-auth/cli migrate
```

### Step 11: Update Environment Variables

**Remove from `.env`:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
```

**Add to `.env`:**
```bash
BETTER_AUTH_SECRET=   # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000   # Full URL of your app
```

---

## Files to Touch (Checklist)

| File | Action | Notes |
|---|---|---|
| `src/lib/auth/index.ts` | Create | Better Auth server config |
| `src/lib/auth/client.ts` | Create | Better Auth client + hooks |
| `src/app/api/auth/[...all]/route.ts` | Create | API handler (dir already exists) |
| `src/app/(client)/layout.tsx` | Edit | Remove `ClerkProvider` |
| `src/app/(client)/sign-in/[[...sign-in]]/page.tsx` | Replace | Rename dir, new form component |
| `src/app/(client)/sign-up/[[...sign-up]]/page.tsx` | Replace | Rename dir, new form component |
| `src/components/navbar.tsx` | Edit | Replace `UserButton` + `OrganizationSwitcher` |
| `src/contexts/clients.context.tsx` | Edit | Replace Clerk hooks |
| `src/contexts/interviews.context.tsx` | Edit | Replace Clerk hooks |
| `src/contexts/interviewers.context.tsx` | Edit | Replace Clerk hooks |
| `src/contexts/responses.context.tsx` | Edit | Replace Clerk hooks |
| `src/middleware.ts` | Create/Edit | Route protection |
| `.env.example` | Edit | Replace Clerk keys with Better Auth keys |
| `package.json` | Edit | Add `better-auth`, remove `@clerk/nextjs` |

---

## Migration Checklist

- [ ] DB migration complete and `DATABASE_URL` is set
- [ ] `better-auth` installed
- [ ] `src/lib/auth/index.ts` created (server config with organizations plugin)
- [ ] `src/lib/auth/client.ts` created (client hooks)
- [ ] `src/app/api/auth/[...all]/route.ts` created
- [ ] Better Auth database tables created (run migrations)
- [ ] `src/app/(client)/layout.tsx` — `ClerkProvider` removed
- [ ] `sign-in` catch-all dir renamed to plain dir, form replaced
- [ ] `sign-up` catch-all dir renamed to plain dir, form replaced
- [ ] `navbar.tsx` — `UserButton` and `OrganizationSwitcher` replaced
- [ ] All 4 context files updated to use `useSession` + `useActiveOrganization`
- [ ] `middleware.ts` updated for Better Auth session check
- [ ] `@clerk/nextjs` uninstalled
- [ ] `.env.example` updated
- [ ] Sign-in flow tested end-to-end
- [ ] Sign-up flow tested end-to-end
- [ ] Organization switching tested
- [ ] Protected routes redirect unauthenticated users correctly
- [ ] Dashboard loads with correct user + org data

---

## Troubleshooting

**"Session not found" in Server Components**

Better Auth sessions must be read with `auth.api.getSession({ headers: await headers() })` from `next/headers`:

```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({ headers: await headers() });
```

**Organization not active after sign-in**

Set the default active organization after sign-up/sign-in:

```typescript
const orgs = await authClient.organization.list();
if (orgs.data?.length) {
  await authClient.organization.setActive({ organizationId: orgs.data[0].id });
}
```

**Cookie not persisting in development**

Ensure `BETTER_AUTH_URL` is set to `http://localhost:3000` (not `https://`) in local `.env`.

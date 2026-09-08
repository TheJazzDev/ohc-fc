# OHC FC Website — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the core OHC FC site — squad management, matchday lineup builder, and the public Home/Squad/Matchday pages with 3D hero and animation — as a standalone, demoable deliverable.

**Architecture:** Single Next.js (App Router) app serving both the public site and an `/admin` backend, backed by Prisma/Postgres. Server Actions handle all mutations (no separate REST API layer except NextAuth and the Blob upload token endpoint). Business-logic validation lives in pure, unit-tested functions that Server Actions call before touching the database.

**Tech Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Bun (package manager + test runner), Prisma + Postgres (Neon), Auth.js v5 (Credentials provider), @vercel/blob, react-three-fiber + @react-three/drei + three, Framer Motion, zod, bcryptjs.

**Spec:** `docs/superpowers/specs/2026-09-08-ohc-fc-website-design.md`

## Global Constraints

- Prisma schema changes always go through `prisma migrate dev` (generate + a committed migration file) — never `db push`.
- Tailwind classes must use v4 naming (`shrink-0`, `bg-linear-to-br`, etc.), never pre-v4 equivalents.
- Mobile-first Tailwind: base classes target mobile; scale up via `sm:`/`md:`/`lg:` prefixes. Keep mobile text/padding moderate — do not use large fixed sizes without a responsive prefix.
- Use `bun`/`bunx` for all package management and script running, not npm/pnpm/yarn.
- No comments in code unless explaining a non-obvious "why".
- Prefer small, focused files over large multi-responsibility ones.
- Player squad numbers are unique across all players (not just active ones) — a simpler rule than "unique among active only", chosen to avoid a Postgres partial-unique-index migration for a small squad. Enforced both at the DB level (`@@unique`) and in the pure validation function.

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `src/components/layout/SiteHeader.tsx`, `src/components/layout/SiteFooter.tsx`
- Create: `.env.example`, `.gitignore`

**Interfaces:**
- Produces: `SiteHeader` (no props), `SiteFooter` (no props) — mounted in root layout, reused by every later page.

- [ ] **Step 1: Scaffold the Next.js app**

Run from `/Users/jazzdev/Documents/Programming/OHC FC`:

```bash
bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

Accept defaults for any remaining prompts. This directory already has `.git/` and `docs/` — create-next-app tolerates existing dotfiles/dirs that don't clash with its own output.

- [ ] **Step 2: Verify Tailwind v4 was installed**

Open `package.json` and confirm `"tailwindcss"` is `^4.x`. Open `src/app/globals.css` and confirm it starts with `@import "tailwindcss";` (v4's CSS-first config, not a `tailwind.config.js`-driven v3 setup).

- [ ] **Step 3: Add root layout with header/footer slots**

`src/components/layout/SiteHeader.tsx`:

```tsx
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/squad", label: "Squad" },
  { href: "/matchday", label: "Matchday" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="text-base font-bold tracking-tight text-white sm:text-lg">
          OHC FC
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-300 transition hover:text-white sm:text-base"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

`src/components/layout/SiteFooter.tsx`:

```tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-6 text-center text-xs text-neutral-500 sm:py-8 sm:text-sm">
      © {new Date().getFullYear()} OHC FC
    </footer>
  );
}
```

Replace `src/app/layout.tsx` body with:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "OHC FC",
  description: "Official site of OHC FC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white antialiased">
        <SiteHeader />
        <main className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

Replace `src/app/page.tsx` with a placeholder Home (this gets replaced in Task 11):

```tsx
export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">OHC FC</h1>
    </div>
  );
}
```

- [ ] **Step 4: Create `.env.example` and confirm `.gitignore` excludes `.env`**

`.env.example`:

```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
ADMIN_EMAIL="admin@ohcfc.example"
ADMIN_PASSWORD="change-me"
BLOB_READ_WRITE_TOKEN="vercel-blob-token"
```

Confirm `.gitignore` (created by create-next-app) already lists `.env*` — if not, add `.env` and `.env.local`.

- [ ] **Step 5: Verify the app runs**

```bash
bun run dev
```

Expected: dev server starts, `http://localhost:3000` shows the "OHC FC" placeholder heading with the header/footer.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js app with base layout"
```

---

## Task 2: Prisma schema and database setup

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/prisma.ts`

**Interfaces:**
- Produces: `prisma` (singleton `PrismaClient` instance) from `src/lib/prisma.ts`, imported by every Server Action task from here on.
- Produces: Prisma models `Player`, `Formation`, `FormationSlot`, `Match`, `Lineup`, `LineupSlot`, `LineupBenchEntry`, `AdminUser` and enums `Position`, `PlayerStatus`, `MatchStatus`, `Venue`.

- [ ] **Step 1: Install Prisma**

```bash
bun add -d prisma
bun add @prisma/client
bunx prisma init --datasource-provider postgresql
```

- [ ] **Step 2: Set `DATABASE_URL`**

Copy `.env.example` to `.env` and set `DATABASE_URL` to a real Postgres connection string (a Neon database for this project, or any local Postgres for development).

- [ ] **Step 3: Write the schema**

Replace `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Position {
  GK
  DF
  MF
  FW
}

enum PlayerStatus {
  FIRST_TEAM
  RESERVE
}

enum MatchStatus {
  UPCOMING
  COMPLETED
  POSTPONED
}

enum Venue {
  HOME
  AWAY
}

model AdminUser {
  id           String @id @default(cuid())
  email        String @unique
  passwordHash String
}

model Player {
  id        String       @id @default(cuid())
  name      String
  number    Int          @unique
  position  Position
  status    PlayerStatus @default(FIRST_TEAM)
  active    Boolean      @default(true)
  photoUrl  String?
  bio       String?
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  lineupSlots  LineupSlot[]
  benchEntries LineupBenchEntry[]
}

model Formation {
  id    String          @id @default(cuid())
  name  String          @unique
  slots FormationSlot[]

  lineups Lineup[]
}

model FormationSlot {
  id          String    @id @default(cuid())
  formationId String
  formation   Formation @relation(fields: [formationId], references: [id], onDelete: Cascade)
  label       String
  order       Int
  xPercent    Float
  yPercent    Float

  lineupSlots LineupSlot[]

  @@unique([formationId, label])
}

model Match {
  id          String      @id @default(cuid())
  opponent    String
  kickoff     DateTime
  venue       Venue
  competition String
  status      MatchStatus @default(UPCOMING)
  homeScore   Int?
  awayScore   Int?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  lineup Lineup?
}

model Lineup {
  id          String    @id @default(cuid())
  matchId     String    @unique
  match       Match     @relation(fields: [matchId], references: [id], onDelete: Cascade)
  formationId String
  formation   Formation @relation(fields: [formationId], references: [id])
  published   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  slots        LineupSlot[]
  benchEntries LineupBenchEntry[]
}

model LineupSlot {
  id              String        @id @default(cuid())
  lineupId        String
  lineup          Lineup        @relation(fields: [lineupId], references: [id], onDelete: Cascade)
  formationSlotId String
  formationSlot   FormationSlot @relation(fields: [formationSlotId], references: [id])
  playerId        String
  player          Player        @relation(fields: [playerId], references: [id])

  @@unique([lineupId, formationSlotId])
}

model LineupBenchEntry {
  id       String @id @default(cuid())
  lineupId String
  lineup   Lineup @relation(fields: [lineupId], references: [id], onDelete: Cascade)
  playerId String
  player   Player @relation(fields: [playerId], references: [id])
  order    Int

  @@unique([lineupId, order])
}
```

- [ ] **Step 4: Generate the initial migration**

```bash
bunx prisma migrate dev --name init
```

Expected: creates `prisma/migrations/<timestamp>_init/migration.sql` and applies it. Commit this migration file together with the schema change (never `db push`).

- [ ] **Step 5: Create the Prisma client singleton**

`src/lib/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 6: Commit**

```bash
git add prisma src/lib/prisma.ts .env.example .gitignore
git commit -m "Add Prisma schema and initial migration"
```

---

## Task 3: Formation presets seed

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json` (add `prisma.seed` config)

**Interfaces:**
- Produces: seeded `Formation` rows named `"4-4-2"`, `"4-3-3"`, `"3-5-2"`, each with 11 `FormationSlot` rows — consumed by the Lineup Builder (Task 8) and Matchday page (Task 10).

- [ ] **Step 1: Write the seed script**

`prisma/seed.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SlotDef = { label: string; order: number; xPercent: number; yPercent: number };

const FORMATIONS: Record<string, SlotDef[]> = {
  "4-4-2": [
    { label: "GK", order: 1, xPercent: 50, yPercent: 92 },
    { label: "LB", order: 2, xPercent: 15, yPercent: 72 },
    { label: "CB1", order: 3, xPercent: 38, yPercent: 76 },
    { label: "CB2", order: 4, xPercent: 62, yPercent: 76 },
    { label: "RB", order: 5, xPercent: 85, yPercent: 72 },
    { label: "LM", order: 6, xPercent: 15, yPercent: 46 },
    { label: "CM1", order: 7, xPercent: 38, yPercent: 50 },
    { label: "CM2", order: 8, xPercent: 62, yPercent: 50 },
    { label: "RM", order: 9, xPercent: 85, yPercent: 46 },
    { label: "ST1", order: 10, xPercent: 38, yPercent: 20 },
    { label: "ST2", order: 11, xPercent: 62, yPercent: 20 },
  ],
  "4-3-3": [
    { label: "GK", order: 1, xPercent: 50, yPercent: 92 },
    { label: "LB", order: 2, xPercent: 15, yPercent: 72 },
    { label: "CB1", order: 3, xPercent: 38, yPercent: 76 },
    { label: "CB2", order: 4, xPercent: 62, yPercent: 76 },
    { label: "RB", order: 5, xPercent: 85, yPercent: 72 },
    { label: "CM1", order: 6, xPercent: 30, yPercent: 48 },
    { label: "CDM", order: 7, xPercent: 50, yPercent: 58 },
    { label: "CM2", order: 8, xPercent: 70, yPercent: 48 },
    { label: "LW", order: 9, xPercent: 18, yPercent: 22 },
    { label: "ST", order: 10, xPercent: 50, yPercent: 16 },
    { label: "RW", order: 11, xPercent: 82, yPercent: 22 },
  ],
  "3-5-2": [
    { label: "GK", order: 1, xPercent: 50, yPercent: 92 },
    { label: "CB1", order: 2, xPercent: 25, yPercent: 76 },
    { label: "CB2", order: 3, xPercent: 50, yPercent: 80 },
    { label: "CB3", order: 4, xPercent: 75, yPercent: 76 },
    { label: "LWB", order: 5, xPercent: 10, yPercent: 50 },
    { label: "CM1", order: 6, xPercent: 33, yPercent: 52 },
    { label: "CDM", order: 7, xPercent: 50, yPercent: 60 },
    { label: "CM2", order: 8, xPercent: 67, yPercent: 52 },
    { label: "RWB", order: 9, xPercent: 90, yPercent: 50 },
    { label: "ST1", order: 10, xPercent: 38, yPercent: 20 },
    { label: "ST2", order: 11, xPercent: 62, yPercent: 20 },
  ],
};

async function main() {
  for (const [name, slots] of Object.entries(FORMATIONS)) {
    await prisma.formation.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slots: { create: slots },
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 2: Wire the seed command**

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "bun prisma/seed.ts"
  }
}
```

- [ ] **Step 3: Run the seed and verify**

```bash
bunx prisma db seed
bunx prisma studio
```

Expected: Prisma Studio shows 3 `Formation` rows, each with 11 linked `FormationSlot` rows.

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts package.json
git commit -m "Add formation preset seed data"
```

---

## Task 4: Auth — admin login and route protection

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/actions/auth.ts`
- Create: `src/middleware.ts`
- Create: `prisma/seed-admin.ts`
- Modify: `package.json` (add `seed:admin` script)

**Interfaces:**
- Produces: `auth()`, `signIn()`, `signOut()`, `handlers` from `src/lib/auth.ts` — `auth()` is consumed by every `/admin` Server Action in later tasks to get the current session.
- Produces: middleware protecting all `/admin/*` routes except `/admin/login`.

- [ ] **Step 1: Install dependencies**

```bash
bun add next-auth@beta bcryptjs
bun add -d @types/bcryptjs
```

- [ ] **Step 2: Write the NextAuth config**

`src/lib/auth.ts`:

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (!admin) return null;

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) return null;

        return { id: admin.id, email: admin.email };
      },
    }),
  ],
});
```

`src/app/api/auth/[...nextauth]/route.ts`:

```ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Write the admin-user seed script**

`prisma/seed-admin.ts`:

```ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Add to `package.json` `"scripts"`:

```json
{
  "seed:admin": "bun prisma/seed-admin.ts"
}
```

Run it:

```bash
bun run seed:admin
```

Expected: no errors, one `AdminUser` row created (verify in `bunx prisma studio`).

- [ ] **Step 4: Write the sign-in Server Action and login page**

`src/actions/auth.ts`:

```ts
"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(_prevState: string | null, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      return "Invalid email or password";
    }
    throw error;
  }
}
```

`src/app/admin/login/page.tsx`:

```tsx
"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

export default function AdminLoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">Admin login</h1>
      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 disabled:opacity-50 sm:text-base"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 5: Protect `/admin/*` with middleware**

`src/middleware.ts`:

```ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 6: Set `NEXTAUTH_SECRET` and verify manually**

Generate a secret and set it in `.env`:

```bash
openssl rand -base64 32
```

Run `bun run dev`, visit `http://localhost:3000/admin` — expect redirect to `/admin/login`. Sign in with the `ADMIN_EMAIL`/`ADMIN_PASSWORD` from `.env` — expect redirect to `/admin` (a 404 is fine for now; the route doesn't exist until Task 6, but you must NOT be bounced back to `/admin/login`).

- [ ] **Step 7: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth src/app/admin/login src/actions/auth.ts src/middleware.ts prisma/seed-admin.ts package.json
git commit -m "Add admin authentication and route protection"
```

---

## Task 5: Business-logic validation (TDD)

**Files:**
- Create: `src/lib/validation/player.ts`
- Create: `src/lib/validation/player.test.ts`
- Create: `src/lib/validation/lineup.ts`
- Create: `src/lib/validation/lineup.test.ts`
- Create: `src/lib/validation/match.ts`
- Create: `src/lib/validation/match.test.ts`

**Interfaces:**
- Produces: `isNumberTaken(players, candidateNumber, excludePlayerId?): boolean` — consumed by the Players Server Action (Task 6).
- Produces: `validateLineupAssignment(formationSlots, xiAssignments): LineupValidationResult` and `validateBenchEntries(xiPlayerIds, benchEntries): LineupValidationResult` — consumed by the Lineups Server Action (Task 8).
- Produces: `canCompleteMatch(homeScore, awayScore): boolean` — consumed by the Matches Server Action (Task 7).

- [ ] **Step 1: Write failing tests for player number uniqueness**

`src/lib/validation/player.test.ts`:

```ts
import { test, expect } from "bun:test";
import { isNumberTaken } from "./player";

test("returns false when no player has the number", () => {
  const players = [{ id: "p1", number: 9 }];
  expect(isNumberTaken(players, 10)).toBe(false);
});

test("returns true when another player has the number", () => {
  const players = [{ id: "p1", number: 9 }];
  expect(isNumberTaken(players, 9)).toBe(true);
});

test("returns false when the only holder is the excluded player (editing self)", () => {
  const players = [{ id: "p1", number: 9 }];
  expect(isNumberTaken(players, 9, "p1")).toBe(false);
});
```

- [ ] **Step 2: Run and verify it fails**

```bash
bun test src/lib/validation/player.test.ts
```

Expected: FAIL — `player.ts` does not exist yet / `isNumberTaken` is not defined.

- [ ] **Step 3: Implement `player.ts`**

`src/lib/validation/player.ts`:

```ts
export type PlayerNumberRecord = { id: string; number: number };

export function isNumberTaken(
  players: PlayerNumberRecord[],
  candidateNumber: number,
  excludePlayerId?: string,
): boolean {
  return players.some(
    (player) => player.number === candidateNumber && player.id !== excludePlayerId,
  );
}
```

- [ ] **Step 4: Run and verify it passes**

```bash
bun test src/lib/validation/player.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Write failing tests for lineup assignment validation**

`src/lib/validation/lineup.test.ts`:

```ts
import { test, expect } from "bun:test";
import { validateLineupAssignment, validateBenchEntries } from "./lineup";

const SLOTS = [
  { id: "s1", label: "GK" },
  { id: "s2", label: "CB1" },
];

test("valid when every slot has exactly one distinct player", () => {
  const result = validateLineupAssignment(SLOTS, [
    { formationSlotId: "s1", playerId: "p1" },
    { formationSlotId: "s2", playerId: "p2" },
  ]);
  expect(result.valid).toBe(true);
});

test("invalid when a slot is missing an assignment", () => {
  const result = validateLineupAssignment(SLOTS, [{ formationSlotId: "s1", playerId: "p1" }]);
  expect(result.valid).toBe(false);
  expect(result.errors).toContain("Slot CB1 has no player assigned");
});

test("invalid when the same player fills two slots", () => {
  const result = validateLineupAssignment(SLOTS, [
    { formationSlotId: "s1", playerId: "p1" },
    { formationSlotId: "s2", playerId: "p1" },
  ]);
  expect(result.valid).toBe(false);
  expect(result.errors).toContain("Player p1 is assigned to more than one slot");
});

test("bench entries invalid when a player is also in the XI", () => {
  const result = validateBenchEntries(["p1", "p2"], [{ playerId: "p1", order: 1 }]);
  expect(result.valid).toBe(false);
  expect(result.errors).toContain("Player p1 is in both the starting XI and the bench");
});

test("bench entries invalid when the same player appears twice", () => {
  const result = validateBenchEntries(
    [],
    [
      { playerId: "p3", order: 1 },
      { playerId: "p3", order: 2 },
    ],
  );
  expect(result.valid).toBe(false);
  expect(result.errors).toContain("Player p3 appears more than once on the bench");
});

test("bench entries valid for distinct players not in the XI", () => {
  const result = validateBenchEntries(
    ["p1"],
    [
      { playerId: "p2", order: 1 },
      { playerId: "p3", order: 2 },
    ],
  );
  expect(result.valid).toBe(true);
});
```

- [ ] **Step 6: Run and verify it fails**

```bash
bun test src/lib/validation/lineup.test.ts
```

Expected: FAIL — `lineup.ts` does not exist yet.

- [ ] **Step 7: Implement `lineup.ts`**

`src/lib/validation/lineup.ts`:

```ts
export type LineupValidationResult = { valid: boolean; errors: string[] };

type FormationSlotRef = { id: string; label: string };
type SlotAssignment = { formationSlotId: string; playerId: string };
type BenchEntry = { playerId: string; order: number };

export function validateLineupAssignment(
  slots: FormationSlotRef[],
  assignments: SlotAssignment[],
): LineupValidationResult {
  const errors: string[] = [];
  const assignmentBySlot = new Map(assignments.map((a) => [a.formationSlotId, a.playerId]));

  for (const slot of slots) {
    if (!assignmentBySlot.has(slot.id)) {
      errors.push(`Slot ${slot.label} has no player assigned`);
    }
  }

  const playerCounts = new Map<string, number>();
  for (const assignment of assignments) {
    playerCounts.set(assignment.playerId, (playerCounts.get(assignment.playerId) ?? 0) + 1);
  }
  for (const [playerId, count] of playerCounts) {
    if (count > 1) {
      errors.push(`Player ${playerId} is assigned to more than one slot`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateBenchEntries(
  xiPlayerIds: string[],
  benchEntries: BenchEntry[],
): LineupValidationResult {
  const errors: string[] = [];
  const xiSet = new Set(xiPlayerIds);
  const seen = new Set<string>();

  for (const entry of benchEntries) {
    if (xiSet.has(entry.playerId)) {
      errors.push(`Player ${entry.playerId} is in both the starting XI and the bench`);
    }
    if (seen.has(entry.playerId)) {
      errors.push(`Player ${entry.playerId} appears more than once on the bench`);
    }
    seen.add(entry.playerId);
  }

  return { valid: errors.length === 0, errors };
}
```

- [ ] **Step 8: Run and verify it passes**

```bash
bun test src/lib/validation/lineup.test.ts
```

Expected: PASS (6 tests).

- [ ] **Step 9: Write failing test for match completion validation**

`src/lib/validation/match.test.ts`:

```ts
import { test, expect } from "bun:test";
import { canCompleteMatch } from "./match";

test("cannot complete without both scores", () => {
  expect(canCompleteMatch(undefined, undefined)).toBe(false);
  expect(canCompleteMatch(2, undefined)).toBe(false);
});

test("can complete with both scores present, including 0-0", () => {
  expect(canCompleteMatch(0, 0)).toBe(true);
  expect(canCompleteMatch(3, 1)).toBe(true);
});
```

- [ ] **Step 10: Run, verify it fails, implement, verify it passes**

```bash
bun test src/lib/validation/match.test.ts
```

Expected: FAIL first (no `match.ts`).

`src/lib/validation/match.ts`:

```ts
export function canCompleteMatch(
  homeScore: number | undefined | null,
  awayScore: number | undefined | null,
): boolean {
  return homeScore !== undefined && homeScore !== null && awayScore !== undefined && awayScore !== null;
}
```

```bash
bun test src/lib/validation/match.test.ts
```

Expected: PASS (2 tests).

- [ ] **Step 11: Run the full validation suite and commit**

```bash
bun test src/lib/validation
git add src/lib/validation
git commit -m "Add business-logic validation with unit tests"
```

---

## Task 6: Players — Server Actions and Admin UI

**Files:**
- Create: `src/actions/players.ts`
- Create: `src/app/admin/players/page.tsx`
- Create: `src/app/admin/players/new/page.tsx`
- Create: `src/app/admin/players/[id]/edit/page.tsx`
- Create: `src/components/admin/PlayerForm.tsx`
- Create: `src/app/api/player-photo-upload/route.ts`

**Interfaces:**
- Consumes: `prisma` (Task 2), `isNumberTaken` (Task 5), `auth` (Task 4).
- Produces: `listPlayers()`, `createPlayer(prevState, formData)`, `updatePlayer(id, prevState, formData)` from `src/actions/players.ts` — `listPlayers()` is consumed by the Lineup Builder (Task 8) and public Squad page (Task 9).

- [ ] **Step 1: Install Vercel Blob client**

```bash
bun add @vercel/blob
```

- [ ] **Step 2: Write the photo upload token route**

`src/app/api/player-photo-upload/route.ts`:

```ts
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ["image/png", "image/jpeg", "image/webp"],
      maximumSizeInBytes: 5 * 1024 * 1024,
    }),
    onUploadCompleted: async () => {},
  });

  return NextResponse.json(jsonResponse);
}
```

- [ ] **Step 3: Write the Players Server Actions**

`src/actions/players.ts`:

```ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isNumberTaken } from "@/lib/validation/player";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const PlayerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  number: z.coerce.number().int().positive(),
  position: z.enum(["GK", "DF", "MF", "FW"]),
  status: z.enum(["FIRST_TEAM", "RESERVE"]),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
});

export async function listPlayers() {
  return prisma.player.findMany({ where: { active: true }, orderBy: { number: "asc" } });
}

export async function createPlayer(_prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = PlayerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const existing = await prisma.player.findMany({ select: { id: true, number: true } });
  if (isNumberTaken(existing, parsed.data.number)) {
    return `Number ${parsed.data.number} is already taken`;
  }

  await prisma.player.create({ data: parsed.data });
  revalidatePath("/admin/players");
  redirect("/admin/players");
}

export async function updatePlayer(id: string, _prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = PlayerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const existing = await prisma.player.findMany({ select: { id: true, number: true } });
  if (isNumberTaken(existing, parsed.data.number, id)) {
    return `Number ${parsed.data.number} is already taken`;
  }

  await prisma.player.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/players");
  redirect("/admin/players");
}
```

- [ ] **Step 4: Write the shared player form component**

`src/components/admin/PlayerForm.tsx`:

```tsx
"use client";

import { useActionState, useState } from "react";
import { upload } from "@vercel/blob/client";

type PlayerFormValues = {
  id?: string;
  name?: string;
  number?: number;
  position?: string;
  status?: string;
  bio?: string;
  photoUrl?: string | null;
};

export function PlayerForm({
  action,
  initialValues,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  initialValues?: PlayerFormValues;
}) {
  const [error, formAction, pending] = useActionState(action, null);
  const [photoUrl, setPhotoUrl] = useState(initialValues?.photoUrl ?? "");
  const [uploading, setUploading] = useState(false);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/player-photo-upload",
    });
    setPhotoUrl(blob.url);
    setUploading(false);
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:gap-4">
      <input type="hidden" name="photoUrl" value={photoUrl} />

      <label className="flex flex-col gap-1 text-sm">
        Name
        <input
          name="name"
          defaultValue={initialValues?.name}
          required
          className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Number
        <input
          name="number"
          type="number"
          defaultValue={initialValues?.number}
          required
          className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Position
        <select
          name="position"
          defaultValue={initialValues?.position ?? "GK"}
          className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
        >
          <option value="GK">Goalkeeper</option>
          <option value="DF">Defender</option>
          <option value="MF">Midfielder</option>
          <option value="FW">Forward</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Status
        <select
          name="status"
          defaultValue={initialValues?.status ?? "FIRST_TEAM"}
          className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
        >
          <option value="FIRST_TEAM">First team</option>
          <option value="RESERVE">Reserve</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Bio
        <textarea
          name="bio"
          defaultValue={initialValues?.bio}
          rows={3}
          className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Photo
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        {uploading && <span className="text-xs text-neutral-400">Uploading...</span>}
        {photoUrl && !uploading && (
          <img src={photoUrl} alt="Preview" className="mt-2 h-20 w-20 rounded-full object-cover" />
        )}
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending || uploading}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 disabled:opacity-50 sm:text-base"
      >
        {pending ? "Saving..." : "Save player"}
      </button>
    </form>
  );
}
```

- [ ] **Step 5: Write the admin Players pages**

`src/app/admin/players/page.tsx`:

```tsx
import Link from "next/link";
import { listPlayers } from "@/actions/players";

export default async function AdminPlayersPage() {
  const players = await listPlayers();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">Players</h1>
        <Link href="/admin/players/new" className="rounded-lg bg-white px-3 py-1.5 text-sm text-neutral-950">
          Add player
        </Link>
      </div>
      <ul className="flex flex-col gap-2">
        {players.map((player) => (
          <li key={player.id} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm sm:text-base">
            <span>
              #{player.number} {player.name} — {player.position}
            </span>
            <Link href={`/admin/players/${player.id}/edit`} className="text-neutral-400 hover:text-white">
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`src/app/admin/players/new/page.tsx`:

```tsx
import { createPlayer } from "@/actions/players";
import { PlayerForm } from "@/components/admin/PlayerForm";

export default function NewPlayerPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">Add player</h1>
      <PlayerForm action={createPlayer} />
    </div>
  );
}
```

`src/app/admin/players/[id]/edit/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePlayer } from "@/actions/players";
import { PlayerForm } from "@/components/admin/PlayerForm";

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = await prisma.player.findUnique({ where: { id } });
  if (!player) notFound();

  const boundAction = updatePlayer.bind(null, id);

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">Edit player</h1>
      <PlayerForm action={boundAction} initialValues={player} />
    </div>
  );
}
```

- [ ] **Step 6: Manual verification**

```bash
bun run dev
```

Sign in at `/admin/login`, go to `/admin/players`, add a player with a photo, confirm it appears in the list, edit it, confirm the change persists. Try creating a second player with the same number — expect the "already taken" error.

- [ ] **Step 7: Commit**

```bash
git add src/actions/players.ts src/app/admin/players src/app/api/player-photo-upload src/components/admin/PlayerForm.tsx
git commit -m "Add player management (Server Actions + admin UI)"
```

---

## Task 7: Matches — Server Actions and Admin UI

**Files:**
- Create: `src/actions/matches.ts`
- Create: `src/app/admin/matches/page.tsx`
- Create: `src/app/admin/matches/new/page.tsx`
- Create: `src/app/admin/matches/[id]/edit/page.tsx`
- Create: `src/components/admin/MatchForm.tsx`

**Interfaces:**
- Consumes: `prisma` (Task 2), `canCompleteMatch` (Task 5), `auth` (Task 4).
- Produces: `listMatches()`, `getNextUpcomingMatch()`, `createMatch(prevState, formData)`, `updateMatch(id, prevState, formData)` — `getNextUpcomingMatch()` consumed by the Home page (Task 11), `listMatches()` consumed by the Lineup Builder (Task 8).

- [ ] **Step 1: Write the Matches Server Actions**

`src/actions/matches.ts`:

```ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { canCompleteMatch } from "@/lib/validation/match";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MatchSchema = z.object({
  opponent: z.string().min(1, "Opponent is required"),
  kickoff: z.string().min(1, "Kickoff time is required"),
  venue: z.enum(["HOME", "AWAY"]),
  competition: z.string().min(1, "Competition is required"),
  homeScore: z.string().optional(),
  awayScore: z.string().optional(),
});

function toMatchData(parsed: z.infer<typeof MatchSchema>) {
  const homeScore = parsed.homeScore ? Number(parsed.homeScore) : undefined;
  const awayScore = parsed.awayScore ? Number(parsed.awayScore) : undefined;
  const status = canCompleteMatch(homeScore, awayScore) ? "COMPLETED" : "UPCOMING";

  return {
    opponent: parsed.opponent,
    kickoff: new Date(parsed.kickoff),
    venue: parsed.venue,
    competition: parsed.competition,
    homeScore: homeScore ?? null,
    awayScore: awayScore ?? null,
    status,
  } as const;
}

export async function listMatches() {
  return prisma.match.findMany({ orderBy: { kickoff: "desc" } });
}

export async function getNextUpcomingMatch() {
  return prisma.match.findFirst({
    where: { status: "UPCOMING" },
    orderBy: { kickoff: "asc" },
  });
}

export async function createMatch(_prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = MatchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.match.create({ data: toMatchData(parsed.data) });
  revalidatePath("/admin/matches");
  redirect("/admin/matches");
}

export async function updateMatch(id: string, _prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = MatchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.match.update({ where: { id }, data: toMatchData(parsed.data) });
  revalidatePath("/admin/matches");
  redirect("/admin/matches");
}
```

- [ ] **Step 2: Write the match form component**

`src/components/admin/MatchForm.tsx`:

```tsx
"use client";

import { useActionState } from "react";

type MatchFormValues = {
  opponent?: string;
  kickoff?: Date | string;
  venue?: string;
  competition?: string;
  homeScore?: number | null;
  awayScore?: number | null;
};

function toDatetimeLocal(value?: Date | string) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 16);
}

export function MatchForm({
  action,
  initialValues,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  initialValues?: MatchFormValues;
}) {
  const [error, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Opponent
        <input
          name="opponent"
          defaultValue={initialValues?.opponent}
          required
          className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Kickoff
        <input
          name="kickoff"
          type="datetime-local"
          defaultValue={toDatetimeLocal(initialValues?.kickoff)}
          required
          className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Venue
        <select
          name="venue"
          defaultValue={initialValues?.venue ?? "HOME"}
          className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
        >
          <option value="HOME">Home</option>
          <option value="AWAY">Away</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Competition
        <input
          name="competition"
          defaultValue={initialValues?.competition}
          required
          className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Home score
          <input
            name="homeScore"
            type="number"
            defaultValue={initialValues?.homeScore ?? ""}
            className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Away score
          <input
            name="awayScore"
            type="number"
            defaultValue={initialValues?.awayScore ?? ""}
            className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 disabled:opacity-50 sm:text-base"
      >
        {pending ? "Saving..." : "Save match"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Write the admin Matches pages**

`src/app/admin/matches/page.tsx`:

```tsx
import Link from "next/link";
import { listMatches } from "@/actions/matches";

export default async function AdminMatchesPage() {
  const matches = await listMatches();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">Matches</h1>
        <Link href="/admin/matches/new" className="rounded-lg bg-white px-3 py-1.5 text-sm text-neutral-950">
          Add match
        </Link>
      </div>
      <ul className="flex flex-col gap-2">
        {matches.map((match) => (
          <li key={match.id} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm sm:text-base">
            <span>
              {match.opponent} — {match.kickoff.toLocaleDateString()} — {match.status}
              {match.status === "COMPLETED" ? ` (${match.homeScore}-${match.awayScore})` : ""}
            </span>
            <Link href={`/admin/matches/${match.id}/edit`} className="text-neutral-400 hover:text-white">
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`src/app/admin/matches/new/page.tsx`:

```tsx
import { createMatch } from "@/actions/matches";
import { MatchForm } from "@/components/admin/MatchForm";

export default function NewMatchPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">Add match</h1>
      <MatchForm action={createMatch} />
    </div>
  );
}
```

`src/app/admin/matches/[id]/edit/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateMatch } from "@/actions/matches";
import { MatchForm } from "@/components/admin/MatchForm";

export default async function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await prisma.match.findUnique({ where: { id } });
  if (!match) notFound();

  const boundAction = updateMatch.bind(null, id);

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">Edit match</h1>
      <MatchForm action={boundAction} initialValues={match} />
    </div>
  );
}
```

- [ ] **Step 4: Manual verification**

Add a match with no scores — expect status `UPCOMING`. Edit it, add both scores — expect status flips to `COMPLETED`.

- [ ] **Step 5: Commit**

```bash
git add src/actions/matches.ts src/app/admin/matches src/components/admin/MatchForm.tsx
git commit -m "Add match management (Server Actions + admin UI)"
```

---

## Task 8: Lineups — Server Actions and Lineup Builder UI

**Files:**
- Create: `src/actions/lineups.ts`
- Create: `src/app/admin/lineups/page.tsx`
- Create: `src/app/admin/lineups/[matchId]/page.tsx`
- Create: `src/components/admin/LineupBuilder.tsx`

**Interfaces:**
- Consumes: `prisma` (Task 2), `validateLineupAssignment`/`validateBenchEntries` (Task 5), `listPlayers` (Task 6), `listMatches` (Task 7), `auth` (Task 4).
- Produces: `getOrCreateLineup(matchId, formationId)`, `saveLineup(lineupId, prevState, formData)`, `togglePublish(lineupId)`, `getPublishedLineup(matchId)` — `getPublishedLineup` consumed by the public Matchday page (Task 10).

- [ ] **Step 1: Write the Lineups Server Actions**

`src/actions/lineups.ts`:

```ts
"use server";

import { prisma } from "@/lib/prisma";
import { validateLineupAssignment, validateBenchEntries } from "@/lib/validation/lineup";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getOrCreateLineup(matchId: string, formationId: string) {
  const existing = await prisma.lineup.findUnique({ where: { matchId } });
  if (existing && existing.formationId === formationId) return existing;
  if (existing) {
    return prisma.lineup.update({ where: { id: existing.id }, data: { formationId } });
  }
  return prisma.lineup.create({ data: { matchId, formationId } });
}

export async function getLineupForBuilder(lineupId: string) {
  return prisma.lineup.findUniqueOrThrow({
    where: { id: lineupId },
    include: {
      formation: { include: { slots: { orderBy: { order: "asc" } } } },
      slots: true,
      benchEntries: { orderBy: { order: "asc" } },
    },
  });
}

export async function saveLineup(lineupId: string, _prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const lineup = await prisma.lineup.findUniqueOrThrow({
    where: { id: lineupId },
    include: { formation: { include: { slots: true } } },
  });

  const assignments = lineup.formation.slots
    .map((slot) => {
      const playerId = formData.get(`slot-${slot.id}`);
      return playerId ? { formationSlotId: slot.id, playerId: String(playerId) } : null;
    })
    .filter((a): a is { formationSlotId: string; playerId: string } => a !== null);

  const benchPlayerIds = formData.getAll("benchPlayerId").map(String).filter(Boolean);
  const benchEntries = benchPlayerIds.map((playerId, index) => ({ playerId, order: index }));

  const slotResult = validateLineupAssignment(lineup.formation.slots, assignments);
  const xiPlayerIds = assignments.map((a) => a.playerId);
  const benchResult = validateBenchEntries(xiPlayerIds, benchEntries);

  if (!slotResult.valid || !benchResult.valid) {
    return [...slotResult.errors, ...benchResult.errors].join("; ");
  }

  await prisma.$transaction([
    prisma.lineupSlot.deleteMany({ where: { lineupId } }),
    prisma.lineupBenchEntry.deleteMany({ where: { lineupId } }),
    prisma.lineupSlot.createMany({
      data: assignments.map((a) => ({ lineupId, formationSlotId: a.formationSlotId, playerId: a.playerId })),
    }),
    prisma.lineupBenchEntry.createMany({
      data: benchEntries.map((b) => ({ lineupId, playerId: b.playerId, order: b.order })),
    }),
  ]);

  revalidatePath(`/admin/lineups/${lineup.matchId}`);
  return null;
}

export async function togglePublish(lineupId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const lineup = await prisma.lineup.findUniqueOrThrow({ where: { id: lineupId } });
  await prisma.lineup.update({ where: { id: lineupId }, data: { published: !lineup.published } });
  revalidatePath(`/admin/lineups/${lineup.matchId}`);
  revalidatePath("/matchday");
}

export async function getPublishedLineup(matchId: string) {
  return prisma.lineup.findFirst({
    where: { matchId, published: true },
    include: {
      formation: { include: { slots: true } },
      slots: { include: { player: true, formationSlot: true } },
      benchEntries: { include: { player: true }, orderBy: { order: "asc" } },
    },
  });
}
```

- [ ] **Step 2: Write the Lineup Builder component**

`src/components/admin/LineupBuilder.tsx`:

```tsx
"use client";

import { useActionState, useState } from "react";
import { saveLineup, togglePublish } from "@/actions/lineups";

type Player = { id: string; name: string; number: number };
type Slot = { id: string; label: string };

export function LineupBuilder({
  lineupId,
  slots,
  players,
  initialAssignments,
  initialBench,
  published,
}: {
  lineupId: string;
  slots: Slot[];
  players: Player[];
  initialAssignments: Record<string, string>;
  initialBench: string[];
  published: boolean;
}) {
  const boundSave = saveLineup.bind(null, lineupId);
  const [error, formAction, pending] = useActionState(boundSave, null);
  const [bench, setBench] = useState<string[]>(initialBench);

  function addBenchSlot() {
    setBench((prev) => [...prev, ""]);
  }

  function updateBenchSlot(index: number, playerId: string) {
    setBench((prev) => prev.map((p, i) => (i === index ? playerId : p)));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {slots.map((slot) => (
          <label key={slot.id} className="flex flex-col gap-1 text-sm">
            {slot.label}
            <select
              name={`slot-${slot.id}`}
              defaultValue={initialAssignments[slot.id] ?? ""}
              className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
            >
              <option value="">Select player</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  #{player.number} {player.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold sm:text-base">Bench</h2>
        <div className="flex flex-col gap-2">
          {bench.map((playerId, index) => (
            <select
              key={index}
              name="benchPlayerId"
              value={playerId}
              onChange={(e) => updateBenchSlot(index, e.target.value)}
              className="rounded-lg border border-white/20 bg-neutral-900 px-3 py-2 text-sm sm:text-base"
            >
              <option value="">Select player</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  #{player.number} {player.name}
                </option>
              ))}
            </select>
          ))}
        </div>
        <button
          type="button"
          onClick={addBenchSlot}
          className="mt-2 text-sm text-neutral-400 hover:text-white"
        >
          + Add bench slot
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 disabled:opacity-50 sm:text-base"
        >
          {pending ? "Saving..." : "Save lineup"}
        </button>
        <button
          type="button"
          onClick={() => togglePublish(lineupId)}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm sm:text-base"
        >
          {published ? "Unpublish" : "Publish"}
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Write the admin Lineups pages**

`src/app/admin/lineups/page.tsx`:

```tsx
import Link from "next/link";
import { listMatches } from "@/actions/matches";

export default async function AdminLineupsPage() {
  const matches = await listMatches();
  const upcoming = matches.filter((m) => m.status === "UPCOMING");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">Lineups</h1>
      <ul className="flex flex-col gap-2">
        {upcoming.map((match) => (
          <li key={match.id} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm sm:text-base">
            <span>
              {match.opponent} — {match.kickoff.toLocaleDateString()}
            </span>
            <Link href={`/admin/lineups/${match.id}`} className="text-neutral-400 hover:text-white">
              Build lineup
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`src/app/admin/lineups/[matchId]/page.tsx`:

```tsx
import { prisma } from "@/lib/prisma";
import { listPlayers } from "@/actions/players";
import { getOrCreateLineup, getLineupForBuilder } from "@/actions/lineups";
import { LineupBuilder } from "@/components/admin/LineupBuilder";

export default async function LineupBuilderPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;

  const formations = await prisma.formation.findMany({ orderBy: { name: "asc" } });
  const defaultFormation = formations[0];

  const lineupStub = await getOrCreateLineup(matchId, defaultFormation.id);
  const lineup = await getLineupForBuilder(lineupStub.id);
  const players = await listPlayers();

  const initialAssignments = Object.fromEntries(
    lineup.slots.map((s) => [s.formationSlotId, s.playerId]),
  );
  const initialBench = lineup.benchEntries.map((b) => b.playerId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">
        Lineup — {lineup.formation.name}
      </h1>
      <LineupBuilder
        lineupId={lineup.id}
        slots={lineup.formation.slots}
        players={players}
        initialAssignments={initialAssignments}
        initialBench={initialBench}
        published={lineup.published}
      />
    </div>
  );
}
```

- [ ] **Step 4: Manual verification**

With at least 11 players and one upcoming match created, go to `/admin/lineups`, open the match, assign a player to every slot, add 2-3 bench players, save — expect no errors. Try leaving a slot empty and saving — expect a validation error naming the missing slot. Publish the lineup.

- [ ] **Step 5: Commit**

```bash
git add src/actions/lineups.ts src/app/admin/lineups src/components/admin/LineupBuilder.tsx
git commit -m "Add lineup builder (Server Actions + admin UI)"
```

---

## Task 9: Public Squad page

**Files:**
- Create: `src/app/squad/page.tsx`
- Create: `src/components/squad/SquadGrid.tsx`
- Create: `src/components/squad/PlayerCard.tsx`
- Create: `src/components/squad/PlayerAvatar.tsx`

**Interfaces:**
- Consumes: `listPlayers()` (Task 6).
- Produces: `PlayerAvatar` — reused by the Matchday page (Task 10).

- [ ] **Step 1: Install Framer Motion**

```bash
bun add motion
```

- [ ] **Step 2: Write the placeholder avatar**

`src/components/squad/PlayerAvatar.tsx`:

```tsx
export function PlayerAvatar({ photoUrl, name, size = 64 }: { photoUrl?: string | null; name: string; size?: number }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-emerald-900 font-bold text-white"
    >
      {initials}
    </div>
  );
}
```

- [ ] **Step 3: Write the flip player card**

`src/components/squad/PlayerCard.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { PlayerAvatar } from "./PlayerAvatar";

type Player = {
  id: string;
  name: string;
  number: number;
  position: string;
  photoUrl: string | null;
  bio: string | null;
};

export function PlayerCard({ player }: { player: Player }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="relative h-48 w-full [perspective:1000px] sm:h-56"
    >
      <motion.div
        className="relative h-full w-full rounded-2xl [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-neutral-900 p-4 [backface-visibility:hidden]">
          <PlayerAvatar photoUrl={player.photoUrl} name={player.name} size={64} />
          <p className="text-sm font-semibold sm:text-base">{player.name}</p>
          <p className="text-xs text-neutral-400 sm:text-sm">
            #{player.number} · {player.position}
          </p>
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-neutral-800 p-4 text-center [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <p className="text-xs text-neutral-300 sm:text-sm">{player.bio ?? "No bio yet."}</p>
        </div>
      </motion.div>
    </button>
  );
}
```

- [ ] **Step 4: Write the squad grid with position filter**

`src/components/squad/SquadGrid.tsx`:

```tsx
"use client";

import { useState } from "react";
import { PlayerCard } from "./PlayerCard";

type Player = {
  id: string;
  name: string;
  number: number;
  position: string;
  photoUrl: string | null;
  bio: string | null;
};

const FILTERS = ["ALL", "GK", "DF", "MF", "FW"] as const;

export function SquadGrid({ players }: { players: Player[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const visible = filter === "ALL" ? players : players.filter((p) => p.position === filter);

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto sm:mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs sm:text-sm ${
              filter === f ? "bg-white text-neutral-950" : "border border-white/20 text-neutral-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {visible.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Write the Squad page**

`src/app/squad/page.tsx`:

```tsx
import { listPlayers } from "@/actions/players";
import { SquadGrid } from "@/components/squad/SquadGrid";

export default async function SquadPage() {
  const players = await listPlayers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl">Squad</h1>
      <SquadGrid players={players} />
    </div>
  );
}
```

- [ ] **Step 6: Manual verification**

Run `bun run dev`, visit `/squad` at 375px width — confirm 2-column grid, tap a card to flip it, filters scroll horizontally without breaking layout.

- [ ] **Step 7: Commit**

```bash
git add src/app/squad src/components/squad
git commit -m "Add public Squad page with flip cards and position filter"
```

---

## Task 10: Public Matchday page

**Files:**
- Create: `src/app/matchday/page.tsx`
- Create: `src/components/matchday/PitchView.tsx`
- Create: `src/components/matchday/FormationSlotChip.tsx`
- Create: `src/components/matchday/BenchStrip.tsx`

**Interfaces:**
- Consumes: `getPublishedLineup()` (Task 8), `getNextUpcomingMatch()` (Task 7), `PlayerAvatar` (Task 9).

- [ ] **Step 1: Write the formation slot chip**

`src/components/matchday/FormationSlotChip.tsx`:

```tsx
"use client";

import { motion } from "motion/react";
import { PlayerAvatar } from "@/components/squad/PlayerAvatar";

export function FormationSlotChip({
  xPercent,
  yPercent,
  name,
  number,
  photoUrl,
  delay,
}: {
  xPercent: number;
  yPercent: number;
  name: string;
  number: number;
  photoUrl: string | null;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
    >
      <PlayerAvatar photoUrl={photoUrl} name={name} size={40} />
      <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white sm:text-xs">
        {number} {name.split(" ").slice(-1)[0]}
      </span>
    </motion.div>
  );
}
```

- [ ] **Step 2: Write the pitch view**

`src/components/matchday/PitchView.tsx`:

```tsx
import { FormationSlotChip } from "./FormationSlotChip";

type SlotWithPlayer = {
  formationSlot: { xPercent: number; yPercent: number };
  player: { name: string; number: number; photoUrl: string | null };
};

export function PitchView({ slots }: { slots: SlotWithPlayer[] }) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-emerald-800 sm:aspect-[4/5]">
      <div className="absolute inset-4 rounded-lg border border-white/30 sm:inset-6" />
      {slots.map((slot, index) => (
        <FormationSlotChip
          key={index}
          xPercent={slot.formationSlot.xPercent}
          yPercent={slot.formationSlot.yPercent}
          name={slot.player.name}
          number={slot.player.number}
          photoUrl={slot.player.photoUrl}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write the bench strip**

`src/components/matchday/BenchStrip.tsx`:

```tsx
import { PlayerAvatar } from "@/components/squad/PlayerAvatar";

type BenchPlayer = { id: string; name: string; number: number; photoUrl: string | null };

export function BenchStrip({ players }: { players: BenchPlayer[] }) {
  return (
    <div className="mt-6 sm:mt-8">
      <h2 className="mb-3 text-sm font-semibold sm:text-base">Bench</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {players.map((player) => (
          <div key={player.id} className="flex shrink-0 flex-col items-center gap-1">
            <PlayerAvatar photoUrl={player.photoUrl} name={player.name} size={48} />
            <span className="text-xs text-neutral-300">#{player.number}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write the Matchday page**

`src/app/matchday/page.tsx`:

```tsx
import { getNextUpcomingMatch } from "@/actions/matches";
import { getPublishedLineup } from "@/actions/lineups";
import { PitchView } from "@/components/matchday/PitchView";
import { BenchStrip } from "@/components/matchday/BenchStrip";

export default async function MatchdayPage() {
  const match = await getNextUpcomingMatch();
  const lineup = match ? await getPublishedLineup(match.id) : null;

  if (!match || !lineup) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="mb-2 text-xl font-bold sm:text-2xl">Lineup not yet announced</h1>
        <p className="text-sm text-neutral-400 sm:text-base">Check back closer to the next match.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-1 text-2xl font-bold sm:text-3xl">
        vs {match.opponent}
      </h1>
      <p className="mb-6 text-sm text-neutral-400 sm:text-base">
        {match.kickoff.toLocaleString()} · {match.competition}
      </p>
      <PitchView slots={lineup.slots} />
      <BenchStrip players={lineup.benchEntries.map((b) => b.player)} />
    </div>
  );
}
```

- [ ] **Step 5: Manual verification**

With a published lineup from Task 8, visit `/matchday` at 375px width — confirm all 11 chips are readable and don't overlap, bench scrolls horizontally. Unpublish the lineup and reload — confirm the "not yet announced" state shows.

- [ ] **Step 6: Commit**

```bash
git add src/app/matchday src/components/matchday
git commit -m "Add public Matchday page with pitch view and bench strip"
```

---

## Task 11: Public Home page with 3D hero, global nav polish, mobile pass

**Files:**
- Create: `src/components/home/Hero3D.tsx`
- Create: `src/components/home/FixtureTeaser.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/layout/SiteHeader.tsx` (active-link styling)

**Interfaces:**
- Consumes: `getNextUpcomingMatch()` (Task 7).

- [ ] **Step 1: Install Three.js dependencies**

```bash
bun add three @react-three/fiber @react-three/drei
bun add -d @types/three
```

- [ ] **Step 2: Add a placeholder 3D model**

Create `public/models/` and place a free glTF/GLB model there (e.g. a trophy or football sourced from IconScout's free 3D section or Poly Haven) named `public/models/hero.glb`. This is a manual asset-sourcing step — no code generates this file.

- [ ] **Step 3: Write the interactive 3D hero, client-only and reduced-motion aware**

`src/components/home/Hero3D.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Hero3DCanvas = dynamic(() => import("./Hero3DCanvas"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-2xl bg-neutral-900 sm:h-80 md:h-96" />,
});

export function Hero3D() {
  const [allowMotion, setAllowMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAllowMotion(!prefersReduced);
  }, []);

  if (!allowMotion) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-neutral-900 sm:h-80 md:h-96">
        <p className="text-sm text-neutral-500">OHC FC</p>
      </div>
    );
  }

  return <Hero3DCanvas />;
}
```

`src/components/home/Hero3DCanvas.tsx`:

```tsx
"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("/models/hero.glb");
  return <primitive object={scene} scale={1.2} />;
}

export default function Hero3DCanvas() {
  return (
    <div className="h-64 w-full rounded-2xl bg-neutral-900 sm:h-80 md:h-96">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1} />
        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 4: Write the fixture teaser**

`src/components/home/FixtureTeaser.tsx`:

```tsx
import Link from "next/link";

type Match = { opponent: string; kickoff: Date; venue: string; competition: string };

export function FixtureTeaser({ match }: { match: Match | null }) {
  if (!match) {
    return (
      <div className="rounded-2xl border border-white/10 p-4 text-sm text-neutral-400 sm:p-6 sm:text-base">
        No upcoming fixtures scheduled.
      </div>
    );
  }

  return (
    <Link
      href="/matchday"
      className="block rounded-2xl border border-white/10 p-4 transition hover:border-white/30 sm:p-6"
    >
      <p className="text-xs uppercase tracking-wide text-neutral-500 sm:text-sm">Next match</p>
      <p className="mt-1 text-lg font-bold sm:text-xl md:text-2xl">
        {match.venue === "HOME" ? "OHC FC vs " : "vs "} {match.opponent}
      </p>
      <p className="mt-1 text-sm text-neutral-400 sm:text-base">
        {match.kickoff.toLocaleString()} · {match.competition}
      </p>
    </Link>
  );
}
```

- [ ] **Step 5: Rewrite the Home page**

`src/app/page.tsx`:

```tsx
import { getNextUpcomingMatch } from "@/actions/matches";
import { Hero3D } from "@/components/home/Hero3D";
import { FixtureTeaser } from "@/components/home/FixtureTeaser";

export default async function HomePage() {
  const nextMatch = await getNextUpcomingMatch();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-8 text-center sm:mb-12">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
          OHC FC
        </h1>
        <p className="mt-2 text-sm text-neutral-400 sm:text-base md:text-lg">
          Home of the badge. Home of the pitch.
        </p>
      </div>
      <Hero3D />
      <div className="mt-8 sm:mt-12">
        <FixtureTeaser match={nextMatch} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Active-link styling on the header**

Modify `src/components/layout/SiteHeader.tsx` to highlight the current route:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/squad", label: "Squad" },
  { href: "/matchday", label: "Matchday" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="text-base font-bold tracking-tight text-white sm:text-lg">
          OHC FC
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition sm:text-base ${
                pathname === link.href ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 7: Final mobile verification pass**

```bash
bun run dev
```

Check `/`, `/squad`, `/matchday`, `/admin/players`, `/admin/matches`, `/admin/lineups` at 375px width (iPhone SE) and at a desktop width. Confirm: no horizontal scroll anywhere, text sizes are moderate on mobile (not desktop sizes shrunk awkwardly), the 3D hero loads and can be rotated on both mobile (touch-drag) and desktop (mouse-drag), and `prefers-reduced-motion` (toggle in devtools) shows the static fallback instead of mounting the canvas.

- [ ] **Step 8: Run full test suite**

```bash
bun test
```

Expected: all unit tests from Task 5 pass.

- [ ] **Step 9: Commit**

```bash
git add src/app/page.tsx src/components/home src/components/layout/SiteHeader.tsx public/models
git commit -m "Add Home page with interactive 3D hero and fixture teaser"
```

---

## Plan-level manual QA checklist (run once all tasks are complete)

1. Sign in to `/admin`, create 11+ players with varied numbers/positions, at least one with an uploaded photo.
2. Create an upcoming match.
3. Build and publish a lineup for it via `/admin/lineups/[matchId]`.
4. Visit `/`, `/squad`, `/matchday` as a signed-out visitor — confirm all render correctly and none require auth.
5. Repeat step 4 at 375px width.
6. Confirm the squad number-uniqueness error and the lineup slot-validation error both surface correctly when triggered deliberately.

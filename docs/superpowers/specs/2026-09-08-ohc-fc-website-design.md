# OHC FC Website — Design Spec

Date: 2026-09-08

## Purpose

A public website for OHC FC (a UK football club), doubling as a portfolio
showpiece to win future client work. Must look distinctive and premium
("who designed this?"), be mobile-first (most viewers on mobile), and be
simple/efficient to build and operate rather than sprawling in scope.

## Core feature: matchday squad & lineup

- When a match lineup is published, the public site shows the formation
  with player avatars/photos and numbers positioned on a pitch.
- Players without an uploaded photo show a distinctive illustrated
  placeholder avatar (not a generic silhouette).
- Future (explicitly out of scope for this build): grafting an uploaded
  player photo's face onto a shirt graphic. For now, uploaded photos are
  simply shown as the player's portrait/avatar.
- A small admin backend lets the club upload players, assign squad
  numbers and positions, mark first-team vs reserve, and build lineups by
  picking a formation template and assigning players to its labeled
  slots (not free-form drag positioning).

## Tech stack

- **Next.js** (App Router) — single app serving both the public site and
  the `/admin` backend.
- **Prisma + Postgres** (Neon) — all data. Schema changes always go
  through `prisma migrate dev` (generate + migration file committed with
  the schema change), never `db push`, per standing project convention.
- **Tailwind v4** — mobile-first patterns per standing convention:
  moderate mobile text sizes/padding, scaled up via `sm:`/`md:`/`lg:`
  prefixes; use current v4 class names (`shrink-0`, `bg-linear-to-br`,
  etc.), not pre-v4 names.
- **Auth.js (NextAuth)**, credentials provider, single seeded admin user
  protecting `/admin/*`.
- **Vercel Blob** for player photo / logo uploads.
- **react-three-fiber + drei** for interactive 3D hero moments.
- **Framer Motion** for micro-animations, card flips, staggered reveals.
- **Bun** as the package manager/runtime, per standing convention.
- Deployment: **Vercel** (app) + **Neon** (Postgres).

## Data model

- **Player** — name, squad number (unique among active players), position
  (GK/DF/MF/FW + optional finer sub-position), photo (nullable →
  placeholder avatar), bio/blurb, status (first team / reserve), active
  flag.
- **Formation** — name (e.g. "4-3-3"), an ordered list of slot
  definitions (label + pitch position). Seeded presets; admin picks from
  these rather than freeform positioning.
- **Match** — opponent, date/time, venue (home/away), competition,
  status (upcoming/completed/postponed), score once completed. Serves
  both the Fixtures and Results views as one model.
- **Lineup** — belongs to a Match, references a Formation, has ordered
  LineupSlot entries (slot → Player) for the starting XI plus an ordered
  substitutes/bench list. Has a publish/unpublish flag controlling public
  visibility.
- **NewsPost** — title, slug, cover image, body (rich text/markdown),
  published date, publish flag.
- **Sponsor** — name, logo, link, optional tier for ordering.
- **ClubInfo** — single-row table for about text, contact details, and
  social links, editable via admin (avoids hardcoding in code).

## Public site structure

- **Home** — 3D interactive hero (trophy/ball), club intro, upcoming
  fixture teaser, latest news teaser, sponsor strip. Primary "wow" page.
- **Squad** — grid of player cards (avatar/photo, number, position
  badge), filterable by position. Tap to flip a card and reveal
  bio/stats.
- **Matchday / Lineup** — pitch graphic with the published XI positioned
  by formation slot (avatar chips + numbers), bench shown below (a
  horizontal scroll strip on mobile). Shows a clear "lineup not yet
  announced" state when nothing is published.
- **Fixtures & Results** — chronological list from the Match model,
  toggle/filter between upcoming and completed (with scores).
- **News** — post feed + individual post pages.
- **Club** — combined about + sponsors + contact page (kept as one page
  rather than three thin pages).

## Squad & Matchday UX detail

- Squad cards: tap/swipe-to-flip (Framer Motion 3D flip) revealing bio
  and stats. Primary interaction is tap on mobile — swipe reserved for
  dismissing/closing a detail view, not the flip trigger, since swipe
  competes with page scroll.
- Matchday pitch: SVG/illustrated pitch background (not a heavy 3D
  scene, to stay fast and crisp), players as avatar chips at their
  formation slots, staggered "take the pitch" entrance animation on
  scroll into view.
- Placeholder avatars are a distinctive illustrated style matching the
  site's visual identity — they'll be the majority of what's shown
  initially, since the site launches with placeholder squad data.

## Admin panel

- `/admin`, single seeded credential (hashed password via Auth.js
  credentials provider). No roles/permissions — single admin only.
- **Players**: list + create/edit (name, number, position, status, photo
  upload, bio). Enforces unique numbers among active players.
- **Lineups**: pick a Match + Formation, assign players to slots, reorder
  bench, publish/unpublish toggle.
- **Matches**: create/edit fixtures; enter results once played.
- **News**: create/edit posts (simple rich text editor), publish toggle.
- **Sponsors** / **Club info**: simple CRUD / single-row edit forms.
- Deliberately plain/functional — design effort goes into the public
  site, not the admin UI.

## 3D & animation approach

- **Interactive 3D** (react-three-fiber + drei): 1-2 hero spots only
  (e.g. Home hero, possibly Matchday). Free glTF/GLB models (IconScout,
  Poly Haven, etc.), compressed (Draco/meshopt), lazy-loaded so the
  Three.js cost is only paid once that section scrolls into view.
- **Static 3D flourishes**: pre-rendered 3D images used as decorative
  accents (section dividers, empty states, background props) — no
  runtime 3D cost.
- **Motion**: page transitions, card flips, staggered lineup reveal,
  scroll-triggered reveals, hover/tap micro-interactions. Restrained —
  purposeful animation, not decoration for its own sake.
- **Performance guardrails**: below-the-fold 3D/heavy assets lazy-load,
  `prefers-reduced-motion` respected, lighter static fallback on
  low-end/small devices where a live 3D canvas would hurt performance.

## Non-functional

- **Mobile-first**: built per standing Tailwind v4 mobile-first
  conventions (squad grid 2 cols on mobile scaling up; matchday pitch
  reflows and stays readable at 375px width).
- **Testing**: TDD for data-layer/business logic (slot assignment,
  number-uniqueness validation, match/result state transitions).
  UI verified by running the dev server and checking key flows (squad
  browse, lineup publish, admin CRUD) at mobile and desktop widths.
- **Deployment**: Vercel + Neon; Prisma migrations committed alongside
  every schema change.

## Design process

Before implementation, use Claude Design with a rich prompt covering the
club's visual identity (typography/colour are open — no existing brand
to match) plus the three highest-impact screens: Home hero, Squad card,
Matchday pitch. This establishes a real chosen visual direction before
UI code is written.

## Phasing

1. **Phase 1 — Core + Squad/Lineup (the showpiece)**: data model, admin
   for Players/Formations/Lineups/Matches, public Home + Squad +
   Matchday pages, core 3D hero + animations. Sufficient on its own to
   pitch the work.
2. **Phase 2 — Fixtures/Results + News + Club page**: rounds out the
   full site.
3. **Future / explicitly out of scope**: face-graft-onto-shirt photo
   processing, multi-user admin roles/permissions, free-form
   drag-and-drop formations.

## Explicitly deferred / out of scope

- Face-graft-onto-shirt image processing.
- Multi-user admin accounts / role-based permissions.
- Free-form (non-slot-based) formation positioning.

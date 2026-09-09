# Rich Claude Design prompt — OHC FC

Written 2026-09-09 for pasting into Claude Design (claude.ai/design) to extend
the in-CLI canvas exploration into the full product. Captures the locked
"Floodlight" identity, tokens, full sitemap, and the matchday lineup-graphic
direction (jersey icons + real pitch markings, informed by real football
broadcast lineup graphics).

```
PROJECT: OHC FC — official website and matchday hub

WHO THEY ARE
OHC FC is a proud non-league football club in the UK, founded 1987. This isn't a Premier League budget — it's a community club with a loud, loyal terrace following, a squad of players who have day jobs, and a committee that finally has the budget for a real website. The brief internally is: "when people see this, they should ask who designed it." This site is also being used as a portfolio piece to win future client work, so every screen needs to hold up to scrutiny from other designers and developers, not just fans.

THE FEELING WE'RE AFTER
Think: a cold Tuesday night under the floodlights, breath visible in the air, the pitch lit up electric-green against a black sky, the low hum of the crowd. Not glossy corporate football-association polish — something a bit more raw, dramatic, high-contrast, broadcast-graphic energy. The accent color should feel like it's glowing, like it's lit from within, the way floodlights bloom against a dark sky. This is the "Floodlight" identity — already chosen over two other directions (a warm heritage-editorial look and a neon-futuristic look), so don't drift back toward either of those.

DESIGN TOKENS (locked — build the whole system from these, don't introduce new colors or fonts)

Color (author in oklch, these exact values):
- Background: oklch(0.16 0.01 260) — near-black, faint cool undertone, not pure #000
- Surface: oklch(0.20 0.015 260) — cards, panels
- Surface raised: oklch(0.24 0.015 260) — hover/active surfaces, tooltips
- Foreground: oklch(0.96 0.01 260) — primary text, warm-neutral off-white, never pure #fff
- Muted text: oklch(0.65 0.02 260) — secondary text, captions, timestamps
- Accent (Floodlight lime): oklch(0.87 0.22 125) — used SPARINGLY: primary buttons, active nav state, jersey numbers, the glow behind the 3D hero, one word per headline at most. This is the "wow" color — if it's everywhere it stops working.
- Pitch gradient (matchday graphic only): oklch(0.36 0.1 150) → oklch(0.26 0.08 150), top to bottom
- Borders/dividers: foreground at 10-15% opacity; accent at 30-40% opacity for emphasized borders (active cards, the fixture-teaser card's corner cut)

Typography:
- Display/headings/labels/numbers: Oswald, weights 500/600/700, uppercase for hero titles and section labels, tight letter-spacing on large sizes (-0.01 to 0.01em), wider tracking on small caps labels (0.06-0.14em)
- Body: Work Sans, weights 400/500, comfortable line-height (1.5-1.6) for bios and match reports
- Scale is mobile-first with real breakpoint jumps, not linear scaling: hero title 40px mobile → 56px tablet → 72px desktop; section heading 26px → 30px → 36px; card title 18px → 20px; body 15px → 16px → 18px; caption/label 11-12px throughout
- Never let mobile text or padding just be a scaled-down desktop value — mobile padding should read as roughly 60-70% of desktop, not proportionally scaled

Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48px scale. Radius: 4px (tight UI elements) / 8px (inputs) / 14px (cards) / full-pill (badges, filter chips, buttons). Elevation: no heavy drop shadows — depth comes from subtle background-tone shifts (surface → surface-raised) and, on the 3D hero and jersey icons only, a soft directional drop-shadow (0 3-4px, 30-40% black, blurred) implying they're lit from above like real floodlit objects.

Iconography: inline, stroke-based, one consistent weight (1.5-2px), no filled glyphs, no emoji, no dingbats. The hamburger menu, filter chips, and any UI icon should feel drawn, not borrowed from a generic icon font.

WHAT NOT TO DO: no generic red/white/blue "stock team kit" colors, no gradient-for-its-own-sake backgrounds, no left-border-accent card clichés, no Inter/Roboto/Arial, no lorem ipsum anywhere — every piece of copy below is real, use it or write in its voice.

FULL SITE MAP (design Home, Squad, and Matchday in full at every breakpoint; the rest can be lighter-touch but should exist so the system feels complete)
1. Home — the flagship page
2. Squad — full roster browse
3. Matchday — the centerpiece feature, the reason this club is getting attention for its site
4. Fixtures & Results — upcoming and past matches, toggle between the two
5. News — match reports and club news, feed + article page
6. Club — about, sponsors, and contact combined into one page (not three thin pages)

Design at three widths for every screen you build: mobile 390px (iPhone-class — most visitors are here, so this is not an afterthought), tablet ~834px (iPad portrait), desktop 1440px. Desktop layouts should be genuinely reconsidered compositions (asymmetric splits, side-by-side panels) — not a mobile column just stretched wider.

PAGE 1 — HOME
Real copy to use: eyebrow "EST. 1987 · NON-LEAGUE"; headline "HOME OF THE BADGE" (large, condensed, uppercase, the word "BADGE" can carry the accent color); subhead "Proud, loud, and built on a Saturday-terrace heart. Follow OHC FC through every matchday, every lineup, every result."
Centerpiece: a large interactive 3D object — a football or a trophy, rendered with a matte-but-slightly-sheened material (not glossy plastic, not photoreal leather — somewhere dramatic and stylized in between), lit like it's sitting under a stadium floodlight: one strong key light from above-left, a soft lime rim-light wrapping the silhouette, and a slow, continuous rotation the visitor can also grab and spin themselves. Behind it, a soft radial glow in the accent color breathes (scales and fades) on a ~3.5s cycle, like a floodlight pulsing. Source the base model from a free 3D asset library (IconScout, Poly Haven, or similar) rather than building from scratch — this is a stylistic anchor object, not a bespoke sculpt.
Below the hero: a fixture-teaser card — "NEXT MATCH" label, "vs Thornbridge Athletic", "Saturday 14 September · 3:00PM · League Cup" — styled with a small diagonal accent-color corner cut (like a corner flag), tappable through to the Matchday page.
Desktop composition: split the hero — copy, eyebrow, and fixture card anchored left in a max-width column; the 3D object large and centered-right, so the page reads as one confident asymmetric statement rather than a stacked mobile page.

PAGE 2 — SQUAD
Header "Squad", then a horizontally-scrollable filter row of pill buttons: All / GK / DF / MF / FW (All is filled in foreground-white with dark text when active; others are outlined, muted text, filling solid when selected).
Grid of player cards below: 2 columns mobile, 3 tablet, 4 desktop. Each card: a circular avatar (either the uploaded photo, or — far more commonly at launch, since most players won't have photos yet — a gradient-filled circle in accent-to-forest-green with the player's initials in bold Oswald), name, "#{number} · {POSITION}" in small caps. Cards should read as tappable — on tap (mobile) they flip in 3D (a real Y-axis flip, ~500ms) to reveal a short bio on the back. Give me a couple of cards in the mockup showing the photo state and most showing the placeholder state, so it's honest about what launch day actually looks like.
Sample roster to use across every Squad/Matchday mockup so the whole site feels like one consistent world: #1 T. Mensah (GK), #2 K. Coker (DF), #3 S. Nwosu (DF), #4 D. Osei (DF), #5 R. Bello (DF), #6 M. Yusuf (MF), #7 F. Diallo (FW), #8 A. Balogun (MF), #9 J. Adeyemi (FW — this is the one player with an uploaded photo), #10 E. Chukwu (MF), #11 O. Bassey (FW). Bench for matchday: #12 D. Farrell (GK), #14 B. Musa (DF), #16 T. Eze (MF), #17 L. Achara (MF), #19 C. Ibe (FW).

PAGE 3 — MATCHDAY (spend the most effort here — this is the screen that should make people stop scrolling)
This needs to look like a real broadcast lineup graphic — the kind you see on Sky Sports or a club's own matchday graphics package — not a generic "team roster list." Study real football formation/lineup graphics for reference: a full pitch diagram rendered in perspective or flat-illustrated style with actual pitch markings (halfway line, center circle with center spot, both penalty boxes with goal areas, corner arcs), players represented as jersey/shirt silhouettes (not circles or headshots) with their squad number printed on the chest in bold numerals, small name tags beneath each shirt, and — above the pitch — a team/formation info bar: opponent name and kickoff details, plus a paired badge set reading "STARTING XI" (filled accent pill) and "4-3-3" (outlined pill), the way real matchday graphics show formation + squad-list status together.
Formation for the mockup: 4-3-3 — GK Mensah; back four Coker, Osei, Bello, Nwosu; midfield three Yusuf, Balogun, Chukwu; front three Diallo, Adeyemi, Bassey.
Below the pitch: a substitutes section, styled like a real bench sheet — each substitute shown with a smaller, outlined (not filled) jersey icon in a muted tone so they read as "not currently on the pitch," their name, and position. Horizontal scrollable row on mobile/tablet; a proper vertical list panel on desktop, positioned as a side column next to the pitch rather than stacked below it — this is the one page where desktop should feel like a broadcast lower-third layout, pitch dominant on the left, bench and match info as a side panel.
Motion: when the lineup loads, players should animate onto the pitch with a staggered entrance — goalkeeper first, then defence, midfield, attack, each ~60-80ms after the last, sliding up slightly (~20px) while fading in.
Also design the empty state for this page: no lineup announced yet — a calm, confident "Lineup not yet announced — check back closer to kickoff" message, not an error-looking state.

PAGE 4 — FIXTURES & RESULTS
A toggle or tab between "Upcoming" and "Results." Upcoming rows show opponent, date, competition, venue (home/away indicated simply, e.g. a small "H"/"A" tag). Results rows show the same plus the final score, with a win/draw/loss indicated by a small accent-colored or muted marker (not red/green traffic-light colors — stay inside the Floodlight palette, e.g. accent for a win, muted for a draw/loss).

PAGE 5 — NEWS
A feed of match-report/news cards (cover image or a placeholder graphic treatment when there's no image, title, date, short excerpt) and a corresponding article page with a large title, byline/date, and body copy in Work Sans at the body type scale above.

PAGE 6 — CLUB
One page combining: a short "About" section (club history voice: "Founded in 1987 on a Saturday-morning kickabout that never stopped..." — write 2-3 sentences in that voice), a sponsor-logo strip (grayscale logos that go full-color on hover), and contact details/social links. Don't split this into three thin pages.

COMPONENT LIBRARY TO DELIVER AS ITS OWN REFERENCE SHEET
Site header (mobile: logo + hamburger; desktop: logo + inline nav — Home / Squad / Matchday / Fixtures / News / Club), primary button (filled accent, dark text), secondary button (outlined accent border), disabled button state, position badges (GK/DF/MF/FW, outlined accent pill), filter/toggle pills with clear active vs inactive states, search input, fixture-teaser card, player card (photo state + placeholder-avatar state + hover/pressed state), jersey/shirt icon (filled "active/starting" version and outlined "bench" version, used consistently between Matchday and anywhere else a player appears with their number), and the pitch-diagram background as a standalone reusable graphic.

MOTION SYSTEM (keep it restrained — one well-orchestrated moment beats many small ones)
Standard easing: ease-out for entrances, ease-in-out for continuous/looping motion (the hero glow pulse, the 3D rotation). Durations: micro-interactions (button press, filter select) 150-200ms; card flips 450-550ms; staggered list/lineup reveals 60-80ms stagger between items; page-section scroll-reveals 300-400ms fade+slide of ~20-24px. Respect prefers-reduced-motion — anything looping (hero glow, rotation) should have a static fallback.

ACCESSIBILITY / QUALITY BAR
Maintain WCAG AA contrast for foreground text on background/surface tones (verify the muted-text token still clears it at small sizes). Touch targets minimum 44px on mobile. Visible focus states in the accent color for keyboard navigation. Check every mobile mockup at 375px width specifically before calling it done — no horizontal scroll, no text overflowing its container, headline sizes that feel considered rather than just "shrunk."

DELIVERABLE
A design-system reference sheet (tokens + components as above) plus full hi-fi screens for Home, Squad, and Matchday at all three breakpoints, and at least one representative mockup each for Fixtures & Results, News, and Club so the full site vision is legible as one coherent system.
```

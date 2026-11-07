# Playroom App — UI Review

**Date:** 2026-11-07
**Scope:** `~/workspace/playroom` (React 19 + Vite + Tailwind 4, kids 3–6)
**Mode:** Read-only review. No files were modified.
**Method:** Read `src/App.tsx` (structure, footer, modals), `WelcomeScreen`, `HomeScreen`, `Navbar`, `PremiumAccessModal`, `PreschoolEducatorHub`, `CompletionScreen`, `ActivityBottomNav`, `AboutPlayroomModal`, `OfflineLockScreen`, `DeveloperModeToggle`, `SchoolAccessGate` (head), `EducatorBottomNav`, `GenericPremiumActivity` (head), `ABCFun` (head), `index.html`, `public/sw.js`, `public/manifest.json`, `src/registerServiceWorker.ts`, `src/usePwaInstall.ts`, `src/utils/versionController.ts` (head), `src/data/learningItems.ts` (data), plus greps across `src/` (small-text counts, console.log count, parent-gate references, PWA usage). Sampled ~6 of 44 activity components — not every activity was read line-by-line. **The app was not rendered in a browser or on a device**; this is a code-level visual/UX review, not a pixel test. The admin panel UI was not reviewed in depth.

**Context:** read `~/workspace/playroom/AUDIT.md` first — this review builds on it and does not repeat the backend findings except where they surface in the UI.

**Confirmed product rules used as the yardstick (user-confirmed 2026-11-07):**
- Page 1 — first level free for all; everything after locked. Page 2 (Educator Hub) fully locked.
- Watch ad = unlock 1 activity. Rs 300 = 3 activities, **7 days**. Rs 5,000 = full Page 1, **30 days — INTENTIONAL, not a bug** (user: permanent at 5,000 would be too cheap). School Rs 50,000/month = **both pages**.
- Branding stays **"Ramsha Shaikh"**. App will live **only on Play Store** (Vercel to be deleted).

---

## 0. Verdict

The **kid-facing core looks genuinely good**: big chunky cards, bright consistent colours, huge START button, voice narration everywhere, clear lock badges, star rewards. The Welcome screen and the activity grid would not embarrass the app next to a pro kids app.

The problems are **not the colours — they are safety, honesty, and consistency**:
1. **There is no parent gate at all.** A 3-year-old can tap RESET and wipe all progress, open the purchase/membership panel, and reach the Educator Hub. Every pro kids app locks this down; Play's Families policy expects it.
2. **Offline is a lie in the UI.** A full-screen "Internet Required" blocker exists but is never used; the home screen promises Level 1 works offline while the lock logic quietly locks everything a parent paid for the moment Wi-Fi drops.
3. **The free tier disagrees with itself in three places** (6 vs 7 vs 5 activities), and one activity's id, title, and component don't match each other.
4. **The buy card is parent-grade copy in a child-reachable modal**, and the 5,000 product still promises Educator Hub access it must not.
5. **The Educator Hub ships fake demo children** and the old 25,000 price.

None of this needs a redesign. It needs a parent gate, honest offline behaviour, and a text/data clean-up pass.

---

## 1. What is already good (don't break these)

- **WelcomeScreen** — excellent. One huge green START button (text-2xl/3xl, py-5/6, pulsing), voice welcome on mount, "Listen Again" replay, clear "Ages 3–6" + "Developed by Ramsha Shaikh" footer. A pre-reader can use this with zero help.
- **Activity cards** — big (p-6, 96px icon circle), chunky 6px white borders with a thick coloured bottom edge, press-down animation (`active:border-b-[4px] active:translate-y-[8px]`). Lock state is visible at a glance: badge top-right + "TAP TO PLAY" vs "UNLOCK ACTIVITY" pill. This is the right pattern.
- **ActivityBottomNav** — consistent everywhere it is used: PREV / HOME / NEXT, py-4, text-base/xl, colour-coded (yellow/blue/green), NEXT greys out with "Finish the activity to unlock next!" when locked. Good.
- **CompletionScreen** — trophy, confetti, big Play Again / Back to Main Menu buttons. Celebration is age-appropriate.
- **Star counter** — always visible in the navbar, animated, with a clear label. Good feedback loop for kids.
- **Voice-first design** — cards speak their title on tap, activities narrate instructions, success sounds on correct answers. This is what makes the app usable by pre-readers, and it matches Duolingo ABC / Khan Academy Kids.
- **Educator Hub overview cards** — 7 tools, consistent layout (icon, badge "Tool N of 7", title, subtitle, OPEN TOOL pill), distinct colour per tool. Clean adult UI.
- **Colour system** — yellow navbar (`#FDE047`), sky-to-yellow gradient backgrounds, white chunky borders. Consistent across Welcome/Home/activities. Keep it.

---

## 2. Top UI problems

### P0-1 — No parent gate anywhere (safety / Families policy)

**Evidence:**
- `grep` for parent PIN/gate across `src/` finds only `playroom_parent_pin` being *deleted* on logout (`App.tsx:623`). There is **no PIN entry, no hold-to-open, no math-question gate anywhere** in the code.
- The navbar — visible to the child on every screen — contains, with no gate:
  - **RESET** (`Navbar.tsx`, `navbar-reset-stars-btn`): calls `handleResetStars` (`App.tsx:522`), which wipes all stars **and** all completed activities with **no confirmation dialog at all**. One accidental tap by a 3-year-old deletes all progress.
  - **OPTIONS** (`quick-controls-toggle-btn`): opens membership/purchase ("Unlock Premium / Enter School Key"), PWA install, voice settings, sound, and activity search. A child can reach the buy modal from here.
  - **PRESCHOOL EDUCATORS HUB** button: one tap takes a child to the school login/key screen.
- Purchases themselves live in `PremiumAccessModal`, which a child reaches by tapping any locked card — no adult check before a Google Play purchase sheet can open.

**What the pro apps do (verified by web search, 2026-11-07):** Khan Academy Kids locks its parent area; Lingokids and Duolingo ABC keep buying and settings in a parent dashboard/parent area, with a parent-only gate; ABCmouse is kidSAFE+ COPPA certified with progress tracking in the parent account. The 2026 COPPA/Families expectation is: **no purchase flow, no settings, no account area reachable by the child without an adult check.**

**Fix:** one reusable parent gate (press-and-hold 3 seconds, or "what is 4 + 3?" — either is standard) guarding: OPTIONS panel, RESET (plus a confirm dialog: "Are you sure? This deletes all stars"), Educator Hub entry, and the purchase buttons inside PremiumAccessModal. Keep the kid flow (START → tap a card → play) completely gate-free.

### P0-2 — Offline UI contradicts itself, and paid content locks offline

**Evidence:**
- `src/components/common/OfflineLockScreen.tsx` is a full-screen "Internet Required" blocker ("Playroom requires an active internet connection to load activities, audio, and verify progress") — but it is **imported/used nowhere** in `src/`. Dead code.
- `HomeScreen.tsx` instead shows a softer offline banner: "Offline Mode Active — Level 1 Free Starter Activities are Ready to Play! / Connect to internet to unlock and verify subscription access for Levels 2 to 6."
- But `checkActivityAccess` / `GooglePlayBillingService.getStoredEntitlements()` / ad unlocks all fail closed offline (AUDIT.md Break 3): every paid card flips its badge to **"L{n} OFFLINE LOCKED"** — including activities the parent already paid for. The banner promises Level 1 works offline, and Level 1 mostly does, but the child sees a wall of red locks for everything else.
- The service worker (see §4) only precaches 4 files, so even the shell is only cached after a first online visit.

**Fix:** (a) decide one offline behaviour and make the UI tell the truth — see §4 recommendation; (b) delete `OfflineLockScreen.tsx` or rework it into a small non-blocking banner — a full-screen blocker must never ship in a kids app; (c) offline badge copy must distinguish "not bought" from "bought but unverified offline" — better, don't show a lock at all for purchased content offline (see §4).

### P0-3 — The free tier disagrees with itself in three places (decision needed)

**Evidence (from `src/data/learningItems.ts`, verified by script):**
- Level 1 has **7 free items**: `abc`, `color`, `counting`, `shape_match`, `rhyme_time`, `animal_food_match`, `identify_items`. Levels 2–6 have 7 items each, all paid. 42 items total.
- The user's confirmed rule is **"pehla 6 activities yani 1 level free"** — 6, not 7.
- `AboutPlayroomModal` FREE FEATURES names only **5**: "ABC Fun, Colors, Counting 1–10, Shape Match, Animal Food Fun" — it omits Find The Difference and Identify Items.
- **Id/title/component mismatch:** the item with `id: 'rhyme_time'` has `title: 'Find The Difference'` and `App.tsx:1374` renders the `FindTheDifference` component for it. The `RhymeTime` component is imported (`App.tsx:13`) but **never rendered anywhere** — it appears to be orphaned. So there is no "Rhyme Time" activity a child can actually open, and the id says rhyme while the card says spot-the-difference.
- The `completion` entry is a Level 6 card titled **"Star Certificate"** in the home grid — tapping it opens the CompletionScreen, which announces "You have successfully completed all Playroom activities!" even if the child has only tapped that card (see P1-6).

**Fix:** pick one number — 6 or 7 — and make `learningItems.ts`, the About modal, the level header ("Items 1–7"), and the offline banner agree. Rename the `rhyme_time` id (or its title) so id/title/component match, and either wire `RhymeTime.tsx` in as its own activity or delete it. Gate the Star Certificate on real completion (or reword it as a reward screen, not a completion claim).

### P0-4 — Buy card (PremiumAccessModal): right prices, wrong promise, child-reachable

**What is CORRECT — do not change:** "PKR 300 / 7 Days" and "PKR 5,000 / 30 Days" labels, and the success messages ("pass is active for 7 days", "unlocked for 30 days"). The 30-day duration on the 5,000 product is **intentional** (user: permanent at 5,000 would be too cheap). The 3-option layout (watch ad / 300 / 5,000) plus Restore Purchases is the right structure, and "No Login Required" is correct for Play Billing.

**What is wrong:**
1. **The 5,000 product still promises Educator Hub access.** `src/services/payment/products.ts` describes the all-activities pass as unlocking "100% of all activities AND full Preschool Educator Hub access for 30 days" (AUDIT.md §2.1). The About modal's Premium box says the same ("Full Preschool Educator Hub"). Per confirmed pricing, 5,000 = **Page 1 only**; the Hub is schools-only (50,000/month subscription). Fix the product description and the About text.
2. **The ad option unlocks a different activity than the one tapped.** The modal opens for activity X, but "Watch an Ad to Unlock" always unlocks `nextAdTargetId` — the next activity in sequence, not X. The copy does say "Unlocks the next activity in your learning path", but a child/parent who tapped X will expect X. Fix: label it unambiguously ("Watch an ad to unlock your NEXT activity: [name]") — or, better, let the ad unlock the tapped activity.
3. **The modal is parent-grade copy in a child-reachable place.** Dense text, "Google Play Digital Access", "Sequential Unlock", "Restore Google Play Purchases" — fine for a parent, but a child gets here by tapping any locked card with no gate (see P0-1). Once the parent gate exists, this modal is fine as-is.
4. **Debug logging in production:** `PremiumAccessModal` `console.log('[Playroom Runtime Debug: PremiumAccessModal]', …)` dumps entitlement state on every render. Remove (98 `console.log` calls across `src/` in total).
5. **The school subscription has no buy UI at all.** `SchoolAccessGate` still shows license-key entry + request form; `SchoolPurchaseModal` exists but hard-codes `amount: 25000` (wrong price — must be 50,000/month) and is wired to the old manual flow. The Hub needs a "Subscribe — Rs 50,000/month (Page 1 + Page 2)" Play Billing screen to replace the key entry.

### P0-5 — Educator Hub ships fake demo children

**Evidence:** `PreschoolEducatorHub.tsx` hard-codes 4 children with real-looking names and assessment notes (Maya S. 4 yrs, Liam K. 3.5 yrs, Aria R. 4.5 yrs, Noah T. 4 yrs) plus a pre-written assessment note, as the default state of the Teacher Assessment tool. A real teacher opening the Hub sees someone else's fake pupils with plausible personal notes — unprofessional, confusing, and it looks like leaked data.

**Fix:** ship the assessment tool empty with a clear "Add your first child" empty state (and sample data only behind an explicit, labelled "Load demo data" button that a teacher opts into).

---

## 3. P1 problems

### P1-1 — Tiny text everywhere for a kids app
- **405 uses** of `text-[10px]` (220×) and `text-[11px]` (185×) across `src/components` + `App.tsx`: badges ("L1 FREE", "OFFLINE LOCKED"), "7 Days"/"30 Days", "Tool N of 7", footer labels, modal microcopy. On a phone held by a 3–6-year-old, 10px text is decoration, not information.
- Pro kids apps keep kid-facing text large and icon-led; small text is reserved for parent-only screens.
- **Fix:** floor of 12px for metadata, 14px+ for anything a child must read. Badges can stay compact only if the icon carries the meaning (lock icon + short word).

### P1-2 — No display font; everything is system sans
- `src/index.css` is a single line: `@import "tailwindcss";`. No font is loaded anywhere (no Google Fonts, no `@font-face`, no Tailwind `fontFamily` config). All headings rely on `font-black` + uppercase on the system font stack, which reads generic next to Khan Academy Kids / Lingokids / Duolingo ABC (rounded display faces).
- **Fix:** add one rounded display font for headings (e.g. Baloo 2 or Fredoka) and one clean rounded body font (Nunito), **self-hosted** so they render offline. Keep the system stack as fallback.

### P1-3 — Dead buttons and fake features
- **Toy shelf (HomeScreen):** the six emoji (🧸🚀📚🧩⚽🎨) have `cursor-pointer`, `hover:scale-125`, and `title` attributes — but **no `onClick`**. They look tappable and do nothing. Either give them a function (e.g. each speaks/plays its activity) or remove the pointer/hover affordance.
- **Support modal (`App.tsx:2302`):** a real-looking form whose submit handler only does `alert('Aapki support query submit ho gayi hai. Hamari team jald rabta karegi.')` — nothing is ever sent. A parent who reports a problem gets a fake confirmation. Wire it to a real channel (email/Play support link) or delete it.
- **`GenericPremiumActivity.tsx`:** comment in code — "Option 0 is correct for testing". If any activity routes here, children get a fake game where the first option is always right. Verify which activity ids use it; remove the test logic or the component.
- **`RhymeTime.tsx`:** imported but never rendered (see P0-3).

### P1-4 — Progress detail sits in the kid flow
- "MY LEARNING JOURNEY TODAY" (8 learning-area cards, "Domain Progress", "Target Learning Outcomes", "Mastered" badges) is adult wording in the middle of the child's home screen, and the area modal lists outcomes a 4-year-old can't read.
- Pro apps put this in the **parent area**; the child sees stars and a mascot, not percentages.
- **Fix:** keep the "Activities Completed Today" strip for the child; move area progress/outcomes behind the parent gate.

### P1-5 — PWA update banner will be dead/confusing on Play Store
- HomeScreen shows "New Playroom App Build Available — Update Now" driven by `versionController` polling `/version.json`. On Play Store, Play handles updates; this banner will either never fire or fire wrongly. **Fix:** remove the banner + `version.json` polling from the Play build (see §4).

### P1-6 — "Star Certificate" / completion claim
- See P0-3. The CompletionScreen copy ("You have successfully completed all Playroom activities!") is only true if the child finished everything; reaching it via the Level 6 "Star Certificate" card makes the claim false. Also "Play Again" on that screen calls `handleResetProgress()` and jumps to `abc` — replaying wipes progress, which a child won't expect. **Fix:** gate the certificate on real completion, and make "Play Again" replay without wiping.

---

## 4. PWA offline — what it actually does today, and the recommendation

### What exists today
- **Manifest** (`public/manifest.json`): name "Playroom", `display: standalone`, `orientation: portrait`, theme `#0EA5E9`, icons 192/512 (maskable) + SVG. Adequate for a PWA; fine as a TWA manifest.
- **Service worker** (`public/sw.js`, cache `playroom-pwa-2026.10.18.1`): precaches **only 4 files** — `/`, `/index.html`, `/manifest.json`, `/favicon.png`. The JS bundle, CSS, images, and audio (incl. `public/rhyme.mp3` ~1.7 MB and `v1–v6.mp3`) are **not** precached; they are cached at runtime via stale-while-revalidate **after the first online visit**. Navigation is network-first with cache fallback to `/index.html`. All `/api/*`, Supabase, and Google Play requests bypass the worker entirely.
- **Install prompt** (`src/usePwaInstall.ts` + Navbar): listens for `beforeinstallprompt`; the Navbar OPTIONS panel has an "Install Playroom to Device" button ("PWA Ready" badge). If the prompt isn't available it shows a toast: "tap your browser menu and select Add to Home Screen". On iOS `beforeinstallprompt` never fires, so it is always the toast path.
- **Update engine** (`src/utils/versionController.ts`, `PLAYROOM_APP_VERSION = '2026.10.18.1'`): polls `/version.json` and shows the "Update Now" banner in HomeScreen.
- **What offline actually does:** after one online visit the shell + visited assets are cached, so the app *loads* offline. But the app logic fail-closes (AUDIT.md Break 3): free Level 1 plays; purchased passes, 3-pack picks, and ad unlocks all return locked; the school hub locks. The unused `OfflineLockScreen` would block everything if it were wired in.

### Recommendation: KEEP offline play, REMOVE the install/download UI

- **Keep offline capability — it is essential, not optional.** Kids play on tablets in cars, at relatives' houses, and on patchy mobile data. All three pro reference apps work offline after download (Khan Academy Kids: "offline works after download"; Duolingo ABC: "usable offline after content is downloaded"; Lingokids/ABCmouse: offline library). An app that locks a paying child the moment Wi-Fi drops will get 1-star reviews from parents.
- **Remove the "Install Playroom to Device" button, the "PWA Ready" badge, and the update banner.** Play Store *is* the install. Inside the installed (TWA/Capacitor) app `beforeinstallprompt` never fires and there is no browser menu, so the button becomes a dead control that tells the user to do something impossible. Play also handles updates — the `version.json` polling is dead weight in the Play build.
- **How offline must behave (target state):**
  1. Free Level 1 + already-purchased content **must work offline**. Purchases verify online once (Play Billing + server check), then the signed entitlement + expiry is cached locally and honoured offline by local signature/expiry check; re-validate with the server when back online.
  2. The service worker must **precache the full app shell + all activity assets + audio** on first install — not just 4 files — so a fresh install works offline without a prior online visit. (If the wrapper is Capacitor instead of TWA, assets are bundled in the app and the service worker becomes unnecessary — that is the cleaner offline story; see AUDIT.md §8.)
  3. Replace the offline banner copy with honest text: "You're offline — your unlocked activities still work. Buying needs internet." Never show "OFFLINE LOCKED" on content the parent already paid for.
  4. Delete the unused `OfflineLockScreen.tsx` (or keep only a small non-blocking banner). A full-screen blocker has no place in a kids app.

---

## 5. UI text that contradicts the confirmed pricing (checklist)

Confirmed: ad = 1 activity · Rs 300 = 3 activities, 7 days · **Rs 5,000 = full Page 1, 30 days (intentional)** · school Rs 50,000/month = both pages. Page 1 first level free; Page 2 fully locked.

| Location | Text now | Problem | Fix |
|---|---|---|---|
| `products.ts` — 5,000 product description | "…AND full Preschool Educator Hub access" | Promises Hub on a Page-1-only product | Delete the Hub clause |
| `AboutPlayroomModal` — Premium box | "Full Preschool Educator Hub" + "Complete Levels 2–6 Curriculum (40+ activities)" | Same false Hub promise; "40+" vs 35 paid activities (Levels 2–6 = 7×5) | Rewrite: 5,000 = Page 1, 30 days; Hub = school subscription only; correct the count |
| `AboutPlayroomModal` — Free box | Names 5 activities | Level 1 actually has 7 free (or 6 per user rule) | List the final free set once the 6-vs-7 decision is made |
| `AboutPlayroomModal` — Premium box | "Personalized Star Diploma" | Verify a real diploma is generated; if it's only the completion screen, say so | Verify or reword |
| `SchoolPurchaseModal.tsx:159` + `schoolPricingService.ts:29` | `amount: 25000` / default tier 25,000 | User's school price is 50,000/month | Set 50,000/month; delete the old 25,000/70,000/120,000/220,000 tiers |
| `products.ts` fallback / `supabaseService.ts` DEFAULT_PLANS | 800 PKR/level | Old dead price system | Remove |
| `PremiumAccessModal` — "30 Days" on 5,000 card | "30 Days" | **CORRECT — intentional. Do not change.** | — |
| `PremiumAccessModal` — "7 Days" on 300 card | "7 Days" | Correct | — |
| Navbar OPTIONS — "Unlock Premium / Enter School Key" | "Enter School Key" | License system is being removed | Change to "Unlock Premium / School Subscription" |
| Educator hamburger menu — "License Expiration / Expires [date]" | License wording | Subscription model replaces licences | "Subscription renews [date]" |
| HomeScreen offline banner | "Connect to internet to unlock and verify subscription access for Levels 2 to 6" | Will be false once offline entitlements work | Rewrite when offline is fixed (§4) |
| `index.html` JSON-LD `offers` | `price: 0, priceCurrency: USD` | Wrong once paid products exist; canonical/OG point at the Vercel URL being deleted | Remove web SEO block or repoint; Play listing carries pricing |
| Level badges | "PREMIUM" on Levels 2–6 | Vague now that there are two paid products (300 3-pack vs 5,000 full) | Acceptable; optionally show which product unlocks the level (P2) |
| `GenericPremiumActivity` / support modal | Test logic / fake `alert()` submit | Fake features (see P1-3) | Wire or remove |

**Branding check:** "Ramsha Shaikh" appears correctly on WelcomeScreen, About modal, and App footer — keep as-is. No "Urooj" anywhere in the app UI (correct per user decision).

---

## 6. Pro-app comparison (Khan Academy Kids / Lingokids / Duolingo ABC / ABCmouse)

Verified against 2026 round-ups (Khan Academy Kids: free, no ads, no IAP, parent area locked, offline after download; Lingokids: kidSAFE, parent dashboard + weekly reports, up to 4 child profiles, subscription, ad-free; Duolingo ABC: free, no ads, no IAP, offline, bite-size lessons, parent reports; ABCmouse: subscription, progress tracking, kidSAFE+ COPPA).

| Standard | Pro apps | Playroom today | Gap |
|---|---|---|---|
| Parent gate before settings/purchases | Yes — locked parent area | None | **P0-1** |
| Purchases only in parent area | Yes | Buy modal reachable by child tapping a locked card | **P0-1** |
| No ads in the child experience | Yes (Khan, Duolingo ABC ad-free; Lingokids ad-free) | Rewarded ad is a core unlock inside the kid flow | Note: rewarded ads to ages 3–6 must be Families-certified, non-personalised; keep the ad flow parent-gated or at least clearly labelled |
| Offline play of owned content | Yes | Paid content locks offline | **P0-2 / §4** |
| Parent dashboard / progress reports | Yes (weekly reports, profiles) | Progress detail sits in the kid flow; no parent dashboard | P1-4 |
| Mascot / single character | Yes (Kodi, Cowy, Duo) | Teddy-bear logo only; no character guides the child | P2 — a mascot would lift the whole app |
| One consistent illustration style | Yes | Mix of custom 2D SVG icons + emoji (cards, shelf, area icons) | P2 — pick one style; emoji as accents only |
| Big touch targets, minimal text | Yes | Cards/nav are big and good; but 405× 10–11px micro-labels | P1-1 |
| Rounded display font | Yes | System sans only | P1-2 |
| Clear free/paid boundary, one price story | Yes | 3 price systems in code; 6-vs-7 free; Hub promised on the wrong product | P0-3, §5 |
| No dead buttons / fake features | Yes | Toy shelf, support modal, orphaned RhymeTime, test-logic activity | P1-3 |
| No account required for the child | Yes | Play Billing path already avoids accounts (good); but Google sign-in + Supabase Auth still wired in | Keep the no-account path; remove the rest with the licence system |

**What Playroom already does as well as the pro apps:** voice narration on every screen, star rewards, chunky pressable cards, a clear learning-path structure (levels), and a genuinely useful Educator Hub concept — none of the four pro apps offers a teacher toolset like this. That is the differentiator; the fixes above are about making the wrapper around it trustworthy.

---

## 7. Prioritised UI fix list

### P0 (do first — trust, safety, honesty)
1. **Parent gate** (hold-to-open or simple adult check) before OPTIONS, RESET, Educator Hub entry, and purchase buttons. RESET also gets a confirm dialog.
2. **Offline honesty:** honour signed cached entitlements offline (free level + purchased content always playable); delete or rework `OfflineLockScreen`; fix offline banner/badge copy; precache full shell + assets (or go Capacitor and bundle them).
3. **Free-tier decision:** 6 or 7 free activities — then align `learningItems.ts`, About modal, level header, offline banner. Fix the `rhyme_time` id/title/component mismatch; wire or delete `RhymeTime.tsx`.
4. **Buy-card text:** remove the Educator Hub promise from the 5,000 product description and About Premium box. Make the ad option label the *actual* activity it unlocks. Add the school subscription (Rs 50,000/month, both pages) buy UI in the Hub; replace the license-key gate.
5. **Educator Hub demo data:** ship the assessment tool empty with an "Add your first child" state; demo data only behind an explicit opt-in.

### P1 (polish that parents notice)
6. Minimum text sizes: 12px metadata floor, 14px+ for anything a child must read.
7. Add one rounded display font (self-hosted, offline-safe) for headings.
8. Remove or wire dead/fake UI: toy-shelf taps, support-modal `alert()` submit, `GenericPremiumActivity` test logic, `console.log` ×98.
9. Move learning-area progress/outcomes behind the parent gate; keep the child's view to stars + "completed today".
10. Remove the PWA "Update Now" banner and `version.json` polling from the Play build.
11. Gate the Star Certificate on real completion; make "Play Again" replay without wiping progress.

### P2 (nice to have)
12. One mascot character to guide the child (Kodi/Cowy-style) and one illustration style (custom SVG everywhere, emoji as accents only).
13. Level badges that name the unlocking product ("Unlock with 3-Pack" / "Full Pass") instead of generic "PREMIUM".
14. Accessibility: remove `maximum-scale=1.0, user-scalable=no` (blocks pinch-zoom); honour `prefers-reduced-motion` (heavy infinite animations: spinning sparkles, bouncing clouds, confetti loop); add visible focus styles.
15. Remove the web SEO block from `index.html` (dead Vercel canonical/OG/JSON-LD, GA4 tag) from the Play build.

---

## 8. Files checked (for traceability)

- `src/App.tsx` — structure, footer (2373–2390), support modal (2302–2370), `handleResetStars` (522), CompletionScreen wiring (1276), `DeveloperModeToggle` (2390)
- `src/components/WelcomeScreen.tsx`, `HomeScreen.tsx`, `Navbar.tsx`, `PremiumAccessModal.tsx`, `PreschoolEducatorHub.tsx`, `CompletionScreen.tsx`, `activities/ActivityBottomNav.tsx`, `activities/ABCFun.tsx` (head), `activities/GenericPremiumActivity.tsx` (head), `common/AboutPlayroomModal.tsx`, `common/OfflineLockScreen.tsx`, `common/DeveloperModeToggle.tsx`, `educator/SchoolAccessGate.tsx` (head), `educator/EducatorBottomNav.tsx` (head)
- `src/data/learningItems.ts` (LEVELS + items; free-count verified by script: L1 = 7 free, L2–L6 = 7 paid each, 42 total)
- `index.html`, `public/sw.js`, `public/manifest.json`, `public/version.json`, `src/registerServiceWorker.ts`, `src/usePwaInstall.ts`, `src/utils/versionController.ts` (head)
- Greps: `text-[10px]`/`text-[11px]` (405 uses), `console.log` (98), parent-gate references (none — only `playroom_parent_pin` cleanup), `OfflineLockScreen` usages (none), `usePwaInstall` usages (Navbar only)
- Web: 2026 kids-app round-ups for Khan Academy Kids, Lingokids, Duolingo ABC, ABCmouse (parent gates, ad-free, offline, parent dashboards)

**Not checked:** every one of the 44 activity components (sampled 6); admin panel UI in depth; rendering on a real device/browser.

# Playroom — Fix Notes

**Completed 2026-11-07. Build verified: `npx tsc --noEmit` clean, `npm run build` succeeds (vite + esbuild server bundle).**

---

## 0. Where the finished app lives — and how future updates work (READ THIS FIRST)

**AI Studio is PREVIEW ONLY — it is not the source of truth.**
The source of truth is **this code** (`playroom-fixed.zip` / the GitHub repo below). Future changes — e.g. adding new activities — are made **directly to the code** (by the assistant), then: new ZIP → new AAB → new release in Play Console. They are **NOT** made by asking AI Studio / Gemini prompts: that is exactly how things kept breaking (Gemini rewrote the payment/license/admin systems while being asked for something else, which is why the admin panel stopped connecting, license keys stopped unlocking, and three contradictory price systems appeared).

The finished app still lives **complete in AI Studio via GitHub import, for preview only** — so the owner can see it and test it there, but edits made in AI Studio must not be treated as the app.

### How to import the fixed code into AI Studio for preview (GitHub route)

1. Create a **NEW GitHub repo** (e.g. `playroom-app`) and push the contents of `playroom-fixed.zip` to it (all files, repo root = app root).
2. In Google AI Studio, open **Build mode**.
3. Click the **+ icon** → **"Import from GitHub"**.
4. Pick the new repo and import it. The full app (activities, billing, parent gate, offline code — everything) now lives in AI Studio for preview.
5. Verify in AI Studio that the app runs (welcome screen → Home → activities) before doing anything else.

### ⚠️ WARNING — if AI Studio / Gemini is ever used for a change anyway

Tell it explicitly, every time:

> "ONLY touch the activity files (src/components/activities/*) and the activity list (src/data/learningItems.ts). NEVER touch billing, licensing, parent gate, or offline code. Do not add any login system, do not add any license-key system, do not change the prices, and do not re-enable Supabase."

**Copy-paste guard prompt for future AI Studio work:**

```
Work ONLY in src/components/activities/* and src/data/learningItems.ts.
Do NOT modify, rewrite, or "improve" any file under src/services/billing/,
src/utils/licenseService.ts, src/utils/devMode.ts, src/components/common/ParentGate.tsx,
src/components/PremiumAccessModal.tsx, src/components/educator/SchoolPurchaseModal.tsx,
src/components/educator/SchoolAccessGate.tsx, src/services/payment/products.ts,
public/sw.js, or server/. Do not add login, license keys, Supabase, or new prices.
Branding stays "Ramsha Shaikh".
```

And even then: any AI Studio edit must be copied back into the code repo and re-verified (build + the checks in §4) before it goes near Play Store. Never ship an AI Studio edit straight to Play.

### New repo must NOT be connected to Vercel

The app is **Play Store only**. Do **not** connect the new GitHub repo to Vercel, and do **not** deploy it on Vercel. The old Vercel deployment is to be deleted. If a hosted web copy is ever needed again (e.g. to host the TWA origin + `assetlinks.json`), that is a separate, deliberate decision — not an automatic deploy.

---

## 1. Changes made

### P0 — Backend (the root cause of everything)
- **Deleted `api/` entirely.** The Vercel serverless `api/index.ts` answered every unrouted `/api/*` call with a fake HTTP 200 (`{status: "API Gateway active"}`) — that is why school requests never arrived, license checks never resolved, billing verify/restore never ran, and the admin panel never talked to the app. Unknown `/api/*` routes now return an honest 404 in the kept server.
- **`server.ts` (4,703 → ~450 lines) is now only the optional verification backend.** Kept: `GET /api/health`, `GET /api/billing/server-time`, `POST /api/billing/verify-google-play-purchase`, `POST /api/billing/validate-entitlements`, `POST /api/billing/restore-purchases`, `POST /api/billing/sync-3pack-activities`, plus new `POST /api/billing/verify-school-subscription`. Deleted: all license/school-request/manual-payment/dispute/complaint/admin-notification/SSE endpoints, all Supabase usage. Restore now re-validates tokens live against Google (one-time via `products.get`, school via `subscriptionsv2.get`).
- **Stable signing secret.** `server/googlePlayVerifier.ts` no longer falls back to `crypto.randomBytes(32)` — `PLAYROOM_SIGNING_SECRET` is now **required** and the server refuses to start without it. Every restart used to invalidate all paid passes; that cannot happen now (as long as the same secret is set every time — see §4).
- **Client verification is configurable.** `VITE_VERIFY_API_URL` = base URL of the verification server. Empty/unset = skip server verification; the client then uses on-device Digital Goods `listPurchases()` + the local signed cache. If a server is configured but unreachable, the client never fakes success — it falls back to Digital Goods confirmation, and if Play can't confirm either, the purchase/restore fails with a clear message.
- **Fixed the Google Play subscription verification for the installed `googleapis` version.** The v1 `purchases.subscriptions.get` endpoint no longer exists in the typings — verification now uses `purchases.subscriptionsv2.get` and reads `subscriptionState` + the line item's `expiryTime` (v2 returns no order id; a GPA-style id is generated for the entitlement record).

### P0 — License system removed entirely
- License-key generation/validation/activation/revocation/renewal, school-request submit/approve, manual payments (SadaPay/bank/Payoneer), disputes, complaints, renewal requests, SSE live sync, and the `feedback` table abused as a JSON sync bus (`[SCHOOL_LICENSE_SYNC]` / `[ADMIN_NOTIFICATION_SYNC]`) are all gone code-side.
- `checkActiveSchoolAccess()` / `canAccessEducatorHub()` now consult the school subscription only. Legacy license keys are purged on import.
- Supabase is fully removed code-side (`supabaseClient.ts`, `supabaseService.ts`, all `.from()` calls, `@supabase/supabase-js` dependency). The `supabase/` migration files are left in the repo (harmless) — the tables themselves still need deleting in the Supabase dashboard (§4).

### P0 — Admin panel → developer preview only
- `src/admin/AdminApp.tsx` is now one screen: a single **"View unlocked version"** switch (sets dev mode, links back to the app) + an explanatory note. No login, no Supabase Auth, no schools/requests/payments/renewals/disputes/complaints/feedback/notifications sections.
- `src/utils/devMode.ts` is a real implementation now (localStorage-backed toggle, default OFF; `isDeveloperMode` / `setDeveloperMode` / `toggleDeveloperMode` / `useDeveloperMode`). It no longer always returns `false` and no longer deletes its own keys. Admin preview in `licenseService` consults dev mode. A `?preview=admin` URL alone no longer auto-enables preview.
- Hidden gesture: tap the app footer 5 times within 3 seconds → toggles developer mode (with an ON/OFF toast). `DeveloperModeToggle` is wired to the real functions and renders when dev mode is ON.
- `admin.html` retitled "Developer Preview".

### P0 — Parent gate (no login — the login system is NOT back)
- New reusable component `src/components/common/ParentGate.tsx` (press-and-hold 3 seconds with a visible fill bar + countdown; keyboard/Escape supported). No PIN, no account.
- Gated: Navbar OPTIONS panel, **RESET** (gate + a confirmation dialog — "Are you sure? This deletes all stars and completed activities." — before anything is wiped), Educator Hub entry button, and all purchase buttons inside `PremiumAccessModal` (watch ad, 3-pack, full pass, claim 3-pack slot). Entry points to the modal are also gated (`App.handleOpenPremiumModal` is the single funnel). The kid flow (START → tap a card → play) is completely gate-free.
- The adult "MY LEARNING JOURNEY TODAY" area-progress/outcomes section on HomeScreen is now behind the parent gate; the child's "Activities Completed Today" strip stays visible.

### P0 — Pricing (final, confirmed 2026-11-07)
- **Rs 500 = 3 activities, 7 days** (was Rs 300 — updated everywhere, including `GooglePlayBillingService` and the modal copy). Product id unchanged: `playroom_3activities_7d`. USD $1.99.
- **Rs 5,000 = full Page 1, 30 days** (INTENTIONAL — permanent at 5,000 would be too cheap). Product id unchanged: `playroom_all_activities_30d`. USD $14.99. Its description no longer promises Educator Hub access (Page 1 only).
- **School subscription (NEW): `playroom_school_monthly` — Rs 50,000/month, both pages, auto-renewing.** USD $99. Added to `GooglePlayBillingService` (product definition, `hasSchoolSubscription()`, purchase/restore support — subscriptions are acknowledged, never consumed) and to the server verifier (`verifySubscriptionTokenWithGoogle` + `POST /api/billing/verify-school-subscription`).
- Old prices deleted: 800 PKR/level fallbacks, 25,000/70,000/120,000/220,000 school tiers, duplicate product `prod_indiv_all_activities`. Supabase price fallback changed 800 → 0 so the old price can never silently return.
- `SchoolPurchaseModal` rewritten as a Play Billing subscription checkout (Rs 50,000/month, both pages, auto-renews, cancel anytime in Google Play, access locks automatically on cancel/expiry; shows active-subscription state + "Manage in Google Play").
- `SchoolAccessGate` rewritten: no license-key entry, no request form, no renewal requests — if no subscription, it shows the subscribe screen; if active, it lets the school in.
- Ad option label is now unambiguous: it unlocks the **NEXT activity in sequence, named on the button** ("Watch an ad to unlock your NEXT activity: [name]").
- About modal rewritten: Free box lists all 7 Level 1 activities by name; Premium box says Rs 5,000 = full Page 1 for 30 days, 35 paid activities in Levels 2–6, Hub = schools-only via the Rs 50,000/month subscription; "Personalized Star Diploma" reworded (no diploma is generated anywhere — it is the completion certificate screen).

### P1 — Offline / PWA
- **Offline rule implemented:** free Level 1 + purchased content work offline from the signed local entitlement cache (local signature + expiry check). After a pass expires, **3 days grace offline** (measured from the last verified server time stored in localStorage), then paid content locks until the app goes online once to re-verify. Ad unlocks are also honoured offline now. Previously everything fail-closed offline.
- **Offline banner is honest now:** "You're offline — your unlocked activities still work. Buying needs internet." Paid cards no longer flip to "OFFLINE LOCKED" for content already bought.
- **Install/download UI removed** (Play Store IS the install): PWA "Install Playroom to Device" button, "PWA Ready" badge, and install toast gone; `usePwaInstall.ts` deleted; the Navbar now shows a static offline-info card instead.
- **`sw.js` rewritten** (cache `playroom-pwa-2026.11.07.1`, so old caches purge): precaches `/`, `/index.html`, `/manifest.json`, `/favicon.png`, `/icon-192.png`, `/icon-512.png`, `/rhyme.mp3`; cache-first runtime strategy for `/assets/*` and same-origin statics; `/api/*` and Google Play/Google APIs bypassed. Previously only 4 files were precached.
- **Deleted:** `OfflineLockScreen.tsx` (unused full-screen blocker), `public/version.json`, `src/utils/versionController.ts` (version polling), the "Update Now" banner on HomeScreen. `registerServiceWorker.ts` is now plain registration only. Play handles updates.

### P1 — UI text / dead-UI fixes
- **Feedback REMOVED (confirmed).** `FeedbackModal`, `feedbackService`, `UserFeedbackAdminTool`, and the HomeScreen Feedback card are gone.
- **About screen STAYS** (fixed text per above).
- **Educator Hub fake demo children removed** (Maya S., Liam K., Aria R., Noah T. + notes). Assessment ships empty with an "Add your first child" state (the assessment tool already had this; the Hub's dead demo state is gone). Hub shows a "Subscription renews [date]" chip when a school subscription is active.
- **Navbar wording:** "Enter School Key" → "School Subscription"; "License Expiration / Expires [date]" → "Subscription renews [date]". Help & Complain menu item removed (its modal was deleted; it had no handler).
- **Support modal deleted** (was unreachable and its submit only fired a fake `alert()` — nothing was ever sent). Parents use Play Store support.
- **Star Certificate fixed:** the "completed all Playroom activities!" claim, trophy headline, and celebration speech only show when actually complete (41 playable activities); otherwise it shows "You have completed X of 41 activities — keep going!" **"Play Again" no longer wipes progress** — it just replays from ABC (the reset call was removed).
- **Toy-shelf emojis** (🧸🚀📚🧩⚽🎨) are now plain decoration (pointer/hover affordance removed, `aria-hidden`) — they looked tappable and did nothing.
- **Console.log sweep:** zero `console.log` calls remain in `src/` (server-side verifier logs kept — they are backend diagnostics, not client spam).
- **`index.html`:** removed the Vercel canonical/OG/Twitter block, robots meta, JSON-LD (including the wrong `price: 0 USD` offer), the GA4 tag, and the admin-subdomain redirect script. `analytics.ts` neutralised to no-op stubs. Title, description, manifest/icons, and viewport kept.
- **Deleted dead files:** `AdminLoginModal.tsx` (zero usages — admin login is gone), `AdminResetPasswordModal.tsx` (zero usages), `scripts/verify-calendar-month-calculation.ts` (tested the old license calendar), `cloudSchoolSync.ts` shim (zero importers after the rewrite).
- **`vite.config.ts`:** `@supabase/supabase-js` removed from `optimizeDeps.include`.

### Verification fixes (coordinator, after the waves)
- Fixed `server/googlePlayVerifier.ts` subscription verification for the installed `googleapis` v181 typings (v1 `subscriptions.get` → v2 `subscriptionsv2.get`; `latestOrderId` does not exist in v2).
- Wrapped the four purchase buttons inside `PremiumAccessModal` in the parent gate (Wave 2 had gated only the entry points).
- Removed the last 8 `console.log` calls in `src/` (AdMobService, GooglePlayBillingService, licenseService).

---

## 2. Files touched

### Created
- `src/components/common/ParentGate.tsx` — press-and-hold 3s parent gate (`ParentGate` + `ParentGateModal`).

### Rewritten (major)
- `server.ts` (4,703 → ~450 lines) — verification-only backend.
- `server/googlePlayVerifier.ts` — stable secret required; school subscription verification via `subscriptionsv2.get`.
- `src/services/billing/GooglePlayBillingService.ts` — school product, `hasSchoolSubscription()`, offline-safe cache, 3-day grace, `VITE_VERIFY_API_URL` handling.
- `src/utils/licenseService.ts` — license/manual-payment/Supabase removed; subscription-based school access; offline-safe access checks.
- `src/utils/devMode.ts` — real toggle (was hard-coded `false`).
- `src/utils/userAuthService.ts` — local-only; sign-in functions are stubs returning a clear "login was removed" error.
- `src/services/payment/PaymentServiceManager.ts` — thin layer over `hasSchoolSubscription()`.
- `src/services/payment/products.ts` — 500/5,000/50,000 pricing; Hub promise removed; duplicate product removed; Supabase import removed (static list now).
- `src/components/PremiumAccessModal.tsx` — PKR 500, ad label, Page-1-only 5,000 card, debug log removed, purchase buttons parent-gated.
- `src/components/educator/SchoolPurchaseModal.tsx` — subscription checkout rewrite.
- `src/components/educator/SchoolAccessGate.tsx` — subscribe screen replaces key entry.
- `src/components/common/AboutPlayroomModal.tsx` — Free/Premium text rewrite.
- `src/components/PreschoolEducatorHub.tsx` — demo children removed, subscription chip, dangling imports fixed.
- `src/admin/AdminApp.tsx` — dev-preview-only single screen.
- `public/sw.js` — precache + runtime cache-first.
- `.env.example` — `PLAYROOM_SIGNING_SECRET` placeholder + generation instructions, `VITE_VERIFY_API_URL`, AdMob placeholders; Supabase vars removed.

### Edited
- `src/App.tsx` (103 KB → ~67 KB) — license/admin code removed, parent-gate wiring, footer 5-tap dev-mode gesture, support modal deleted, Star Certificate wiring, RhymeTime orphan import removed.
- `src/components/Navbar.tsx` — gate, RESET confirm, subscription wording, PWA install UI removed.
- `src/components/HomeScreen.tsx` — Feedback card removed, offline banner, update banner removed, toy shelf, progress behind gate.
- `src/components/CompletionScreen.tsx` — real-completion gating, Play Again no longer wipes.
- `src/components/common/DeveloperModeToggle.tsx` — wired to real devMode (dead branch removed).
- `src/components/educator/TeacherAssessmentTool.tsx` — checked; already empty-state, left alone.
- `src/utils/schoolPricingService.ts` — single tier only (Rs 50,000 / $99, 1 month).
- `src/utils/analytics.ts` — neutralised to no-ops (GA4 removed).
- `src/registerServiceWorker.ts` — plain registration only.
- `index.html`, `vite.config.ts`, `admin.html`, `package.json` (Supabase dep removed).

### Deleted
- `api/` (entire directory incl. fake-200 `api/index.ts`), `vercel.json`
- `src/services/cloudSchoolSync.ts`, `src/services/supabaseService.ts`, `src/utils/supabaseClient.ts`, `src/utils/feedbackService.ts`, `src/utils/licenseKeyGenerator.ts`
- `src/services/payment/providers/*` (4 files), `src/services/payment/schema.sql`, `src/services/payment/migration_*.sql` (2 files)
- `src/components/common/FeedbackModal.tsx`, `src/components/common/OfflineLockScreen.tsx`, `src/components/educator/UserFeedbackAdminTool.tsx`, `src/components/educator/AdminPaymentRequestsTool.tsx`, `src/components/educator/SchoolComplaintModal.tsx`, `src/components/educator/SchoolRenewalModal.tsx`, `src/components/AdminLoginModal.tsx`, `src/components/AdminResetPasswordModal.tsx`, `src/components/admin/*` (7 files)
- `src/usePwaInstall.ts`, `src/utils/versionController.ts`, `public/version.json`, `scripts/test-first-page-payment-audit.mjs`, `test-e2e-license-system.mjs`, `test-expiry-anti-reuse.mjs`, `scripts/verify-calendar-month-calculation.ts`

### Deliberately NOT touched
- `src/components/activities/*` — all 42 activity components unchanged (gameplay untouched).
- Branding — "Ramsha Shaikh" everywhere, unchanged.
- `src/data/learningItems.ts` — see §3 for the `rhyme_time` decision.
- No login system added anywhere.

---

## 3. Decisions taken

- **Prices (final):** PKR — watch ad = 1 activity (next in sequence); Rs 500 = 3 activities / 7 days; Rs 5,000 = full Page 1 / 30 days (intentional, NOT permanent); Rs 50,000/month = school, both pages. USD (country-specific in Play Console, one Play Billing system): $1.99 / $14.99 / $99. The Rs 1,000/month and Rs 4,999/year suggestions were rejected by the owner as too cheap.
- **Free tier:** Page 1 Level 1 = **7 activities free** for all, always offline (the "6 activities" figure was corrected — Level 1 actually has 7 items).
- **Offline rule:** paid content works offline from the signed cache; expiry + 3 days grace, then the app must go online once to re-verify or paid content locks. (This answers "why would anyone buy if it works offline forever" — it doesn't work forever.)
- **Feedback removed; About kept.** Play Store reviews are the feedback channel now.
- **Vercel deleted, not redeployed. AI Studio = preview only** (§0). No login (was 404; parent gate instead).
- **Verification backend is optional.** If `VITE_VERIFY_API_URL` is unset, purchases verify on-device via Digital Goods API + local signed cache. Deploying `server.ts` adds server-side verification (recommended for the school subscription), but it is not required for the app to sell.
- **`rhyme_time` id left unchanged (deliberate).** The item id says `rhyme_time` while the visible title/component is "Find The Difference". Renaming the id would touch `src/types.ts`, `activitiesList.ts`, `learningItems.ts`, `App.tsx`, analytics, and — critically — saved-progress keys (`completedActivities` stores `'rhyme_time'`), orphaning existing children's progress. Kids never see the id; the visible title already matches the content. Documented, not fixed.
- **`GenericPremiumActivity` "Option 0 is correct for testing" left unchanged (deliberate).** All 35 premium activity ids have dedicated switch cases in `App.tsx`; the component is only the `default:` fallback for an unknown id. It has no real activity data to make options genuinely correct, so "fixing" it would just move the fake answer to another button. Fallback-only stub — no real activity's gameplay is affected.
- **`RhymeTime.tsx` orphan file left in place** (imported nowhere now; deleting the file was outside the wave scope — harmless, ~small).
- **P2 items NOT done:** 10–11px text sizes (405 uses) and the display font (Baloo 2 / Fredoka) were deferred — a font + size pass across the whole app is a visual change that needs a design check, not a safe mechanical edit. The app works without it.
- **Chunk-size warning:** `vite build` warns the main JS chunk is ~2 MB (all activities bundled). Pre-existing, not a blocker for Play Store; code-splitting is future work.

---

## 4. Checklist — things ONLY she can do

### Play Console — products (create exactly these; IDs must match the code)
| Product ID | Type | Pakistan (PKR) | Abroad (USD) | Unlocks |
|---|---|---|---|---|
| `playroom_3activities_7d` | One-time (consumable) | Rs 500 | $1.99 | Any 3 activities, 7 days |
| `playroom_all_activities_30d` | One-time | Rs 5,000 | $14.99 | Full Page 1, 30 days |
| `playroom_school_monthly` | Subscription, auto-renewing | Rs 50,000 / month | $99 / month | Page 1 + Page 2, auto-locks on cancel |
| (Rewarded ad) | AdMob rewarded ad | Free | Free | 1 activity (next in sequence) |

- In Play Console, set prices **per country** (Pakistan = PKR prices, other countries = USD prices). Do **not** leave it on auto-convert: auto-convert would show ~$17.86 / ~$178.57 abroad.
- Play Store takes ~15% (first $1M/year): net ≈ Rs 425 / Rs 4,250 / Rs 42,500 per sale.

### AdMob (production ads — currently Google's TEST ad unit ID in code)
- Create an AdMob account → add the Playroom app → create a **rewarded ad unit** → replace the test unit ID `ca-app-pub-3940256099942544/5224354917` in `src/services/ads/AdMobService.ts` and set `ADMOB_APP_ID` / `ADMOB_REWARDED_AD_UNIT_ID` in the env. Until then, ads will only ever show test ads (no earning). Ads must be non-personalised for ages 3–6 (Families policy).

### Verification backend (optional but recommended)
- Generate ONE stable secret once: `openssl rand -hex 32` → set as `PLAYROOM_SIGNING_SECRET` in the deployment environment wherever `server.ts` runs. **Never commit the real value; never change it afterwards** (changing it invalidates every paid pass issued before).
- Set `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` (service-account JSON with Android Publisher API access) in the same environment.
- Set `VITE_VERIFY_API_URL` in the app build to that server's base URL — or leave it unset (on-device verification only). The server **will not start** without `PLAYROOM_SIGNING_SECRET`.

### Delete (her accounts — code cannot do this)
- [ ] **Vercel:** delete the `playroom-preschool-learning-app` deployment/project.
- [ ] **Supabase dashboard:** delete tables `school_licenses`, `schools`, `school_requests`, `school_renewal_requests`, `payments`, `user_licenses`, `payment_issues`, `notifications`, `purchases`, `feedback`, `products`, `profiles` (export first if she wants a backup). The code no longer uses Supabase at all.
- [ ] **GitHub:** push `playroom-fixed.zip` contents to a NEW repo (do NOT connect it to Vercel), then import into AI Studio for preview (§0).

### AAB — still a separate step (NOT done in this ZIP)
- Wrap the `dist/` build as a **TWA via PWABuilder / Bubblewrap** (package name **`com.playroom.app`** — already hard-coded in the verifier and billing service) **or** Capacitor (native AdMob/billing plugins — more work, cleaner offline story). There is no Android wrapper in this ZIP.
- Decide the TWA host for `.well-known/assetlinks.json` (the PWA origin must serve it) — Vercel is being deleted, so this needs a host decision before wrapping.
- **Test the AAB on a real Android device before release** — purchases and rewarded ads only work inside the TWA/Android app, never on the web. Verify: buy the 3-pack, buy the 30-day pass, buy the school subscription, watch an ad, go offline and confirm paid content still plays, let a pass expire + 3 days and confirm it locks until online.
- Bump `versionCode` on every Play release (Play requires it; the old PWA `version.json` scheme is gone).

### Play Store listing (Families policy — app targets ages 3–6)
- [ ] Enrol in **Designed for Families**; complete the content-rating questionnaire and the data-safety form (no accounts, no personal data collected by the app itself).
- [ ] Store listing description + "About this app" in Play Console (this is where the About text lives for the store — separate from the in-app About screen).
- [ ] Confirm ads are Families-certified and non-personalised; no account requirement for children.
- [ ] Developer name on the listing: **Ramsha Shaikh** (unchanged, per owner).

### Known limitations (not bugs)
- Main JS chunk ~2 MB (build warning) — all activities are bundled; code-splitting is future work.
- `RhymeTime.tsx` is an orphaned file (imported nowhere) — harmless.
- `rhyme_time` internal id vs "Find The Difference" title (§3) — internal only, kids never see it.
- `GenericPremiumActivity` is a fallback-only stub (§3).
- The 12 root `.mp3` files (`v1–v6.mp3`, `rhyme.mp3` in `public/`) add size to the AAB — audit before packaging.

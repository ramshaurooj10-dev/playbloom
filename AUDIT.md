# Playroom App — Code Audit

**Date:** 2026-11-07
**Scope:** `~/workspace/playroom` (extracted from `~/workspace/user/files/playroom.zip`)
**Stack:** React 19 + Vite 6 + Tailwind 4 + Express (`server.ts`) + Supabase + Google Play Developer API
**Mode:** Read-only audit. No files were modified.
**App:** Playroom — preschool learning app, kids 3–6 (ABC phonics, counting, colors, shapes, matching, animals). 117 `.tsx` files. `src/App.tsx` 2,394 lines; `server.ts` 4,703 lines; `src/services/cloudSchoolSync.ts` 2,936 lines; `src/services/payment/PaymentServiceManager.ts` 3,134 lines.

---

## 0. Executive summary

The app is **not one system but three half-merged systems** fighting over the same lock:

1. **Old level system** — Levels 1–6, manual payments (SadaPay/bank/Payoneer), admin approves, 800 PKR/level. Still the code that actually decides access (`src/utils/licenseService.ts`).
2. **School license-key system** — `SCH-XXXX-XXXX-XXXX` keys, 1 calendar month, admin panel, Supabase tables, SSE live sync. This is the system the user says is broken.
3. **Google Play billing system** — Digital Goods API + server verification (`server/googlePlayVerifier.ts`, `src/services/billing/GooglePlayBillingService.ts`). Only works inside an Android/TWA wrapper; on the web it always fails with "open Playroom on your Android device".

**The single biggest break:** the app is deployed on **Vercel**, but Vercel does not run `server.ts` (the 4,703-line Express server that owns most endpoints). Vercel only runs the small `api/*.ts` serverless files, and `api/index.ts` answers **every unrouted `/api/*` call with a fake HTTP 200** (`{status: "API Gateway active"}`). So the school-request submit, the license status poll, all billing verify/restore/sync endpoints, admin notifications and admin-verify-preview silently return empty success. The admin panel and the app therefore never actually talk to each other on Vercel — exactly the symptom the user reports ("admin panel app se connect nahi hota, license key se app unlock nahi hoti, kabhi kuch garbar").

Other top breaks: the Google Play HMAC signing secret is **random on every server restart**, which invalidates every previously issued entitlement; **everything locks when offline** (fail-closed design — ad unlocks, Google Play passes and school access all return "locked" with no internet); **developer mode is hard-coded to always return false**, so there is currently no way for the owner to view the unlocked version; and **three different price lists** contradict each other (800/level, 300/5,000 Google Play, 25,000 school default vs the user's 50,000).

**User decisions recorded for this audit (2026-11-07):**
- The app will live **ONLY on Play Store. Vercel deployment is to be deleted, not redeployed.**
- Branding stays **"Ramsha Shaikh"** as-is (WelcomeScreen, About modal, App footer). Do not change to Urooj.
- Removing the in-app **About** screen and **Feedback** section is **decision pending** — see §6 for what they do and the trade-off.

---

## 1. App structure — the two sections

### Page 1 — Activity page (normal users)
- Entry: `WelcomeScreen` → `HomeScreen` (`src/components/HomeScreen.tsx`), activity grid from `src/data/learningItems.ts` / `src/data/activitiesList.ts`.
- Activities are grouped into **Levels 1–6** (old model). Level 1 is free; Levels 2–6 are locked behind a pass/license.
- ~45 activities (`src/types.ts` `ActivityId` list: abc, color, counting, shape_match, rhyme_time, memory_match, number_trace, letter_trace, bubble_pop, fish_hunting, etc.).
- Navigation is state-driven in `App.tsx` (`currentActivity`), not router-based. `handleSelectActivity()` (App.tsx:531) calls `checkActivityAccess()` and opens `PremiumAccessModal` when denied.
- A background effect re-checks the lock on every navigation (App.tsx:563+) — if access is denied it bounces the user back to Home and reopens the buy modal.
- Home screen bottom has two small cards: **About Playroom** and **Feedback** (HomeScreen.tsx:780–860), opening `AboutPlayroomModal` and `FeedbackModal`.

### Page 2 — Educator Hub (schools)
- `src/components/PreschoolEducatorHub.tsx` (698 lines) + `src/components/educator/*` (LessonPlannerTool, ActivityPlannerTool, Assessment Tool, PrintableWorksheetsTool, FlashCardsTool, SchoolAccessGate, SchoolRenewalModal, AdminPaymentRequestsTool).
- Gated by `SchoolAccessGate` — a school must have an **active school license** to enter; otherwise it shows the license-key entry + school-request form.
- Role routing in `App.tsx:219`: account role `school_admin` → Educator Hub; `parent` (default) → Home.
- `TEMPORARY_DEMO_PAGE2_UNLOCK = false` (App.tsx:96) — a demo flag that is currently off (good).

### Admin panel — separate app
- Separate entry: `admin.html` → `src/admin/adminMain.tsx` → `src/admin/AdminApp.tsx` (495 lines), served at `/admin` or on `admin.*` / `playroom-admin.*` subdomains (vercel.json rewrites + an inline redirect script in `index.html`).
- Admin login is **Supabase Auth** (AdminApp.tsx:72–146, `supabase.auth.getSession()` / `onAuthStateChange`).
- Admin areas: Dashboard, Registered Schools, School Requests, Payment Requests, Renewals, Complaints, Feedback admin (`UserFeedbackAdminTool`), notifications.
- Admin preview of the public app: `?preview=admin` / `?admin_preview=` / `?view_app=` + localStorage flags `playroom_admin_app_view_active` + `playroom_admin_authenticated` (App.tsx:246–313, `src/utils/userAuthService.ts:600–650`). When active, `checkActivityAccess`/`checkLevelAccess`/`checkActiveSchoolAccess` all return unlocked (`licenseService.ts` ADMIN_PREVIEW override). This mechanism exists but depends on the admin auth session and on `/api/admin/verify-preview` — which does **not** exist on Vercel (see §2).

---

## 2. Current payment/lock system — and exactly where it breaks

### 2.1 The three systems and their prices (contradictory)

| System | Price | Where defined |
|---|---|---|
| Old level system | **800 PKR per level** ($5), Level 1 free | `server.ts` `/api/payment/submit-request` expectedAmount; `src/services/payment/products.ts` fallback `pricePkr: 800`; `supabaseService.ts` DEFAULT_PLANS Level 2 = 800 PKR |
| Google Play products | **300 PKR = 3 activities, 7 days**; **5,000 PKR = all activities, 30 days** | `server/googlePlayVerifier.ts` ALLOWED_PRODUCT_IDS `playroom_3activities_7d`, `playroom_all_activities_30d`; `GooglePlayBillingService.ts` PLAYROOM_INDIVIDUAL_PRODUCTS |
| School license | **25,000 PKR / 1 month** default (tiers: 1mo 25,000; 3mo 70,000; 6mo 120,000; 12mo 220,000; 15 devices) | `src/utils/schoolPricingService.ts` DEFAULT_SCHOOL_TIERS; also `activate.ts` fallback `price: 25000`; AdminDashboard `req.amount \|\| 25000` |
| **User's intended price** | **50,000 PKR / month school** (both pages) | Not in code anywhere — the code default is 25,000. Admin can override tiers (stored in localStorage `playroom_school_pricing_config` + Supabase `products`), but the shipped default is 25,000. |

Also contradictory: `products.ts` describes the 5,000 PKR "All Activities" pass as unlocking **"100% of all activities AND full Preschool Educator Hub access for 30 days"** — but the user's rule is 5,000 = Page 1 only; Educator Hub is schools-only. And `products.ts` contains a **duplicate product** (`all_activities` and `prod_indiv_all_activities`, identical).

### 2.2 Buy card on Page 1 (PremiumAccessModal)
`src/components/PremiumAccessModal.tsx` offers three options:
1. **Watch ad → unlock 1 activity** — `AdMobService.showRewardedAd()`. Only works with a native bridge (`Capacitor AdMob`, `AdMob Plus`, or `AndroidBridge`/`AndroidAdMob`). On plain web it **deliberately refuses** ("Do NOT fake an ad… DO NOT grant a reward") and returns "Ad is not available right now". Ad unit ID is still **Google's test ID** `ca-app-pub-3940256099942544/5224354917` — no production AdMob ID is configured anywhere.
2. **300 PKR → next 3 activities, 7 days** — `googlePlayBilling.purchaseProduct('playroom_3activities_7d')`.
3. **5,000 PKR → all activities, 30 days** — `purchaseProduct('playroom_all_activities_30d')`.

Both purchases go through the **Digital Goods API** (`window.getDigitalGoodsService` + `PaymentRequest`). **On the web/Vercel this API does not exist**, so `purchaseProduct()` returns the error *"Google Play purchase is available in the Android app. Please open Playroom on your Android device to purchase."* The buy card is visible on web but can never complete a purchase there. (This is by design for web — it only works inside a TWA/Android wrapper — but no wrapper exists yet, see §7.)

### 2.3 School license flow (as designed)
1. School fills request form in Educator Hub (`SchoolAccessGate` / hub) → `PaymentServiceManager` POSTs `/api/payment/school-request` (PaymentServiceManager.ts:1314) and also saves via `cloudSchoolSync.saveSchoolRequest` (Supabase `school_requests` + localStorage).
2. Admin sees it in admin panel → approves → key generated `SCH-XXXX-XXXX-XXXX` → school gets key by email (manual).
3. School enters key in app → `/api/license/validate` or `/api/license/activate` → Supabase `school_licenses` lookup → status ACTIVE, `valid_from`/`valid_until` set (1 calendar month from activation) → saved to localStorage `playroom_active_school_license` → both pages unlock.
4. Expiry: `canAccessEducatorHub()` / `checkActiveSchoolAccess()` compare expiry against device clock; renewal requests via `/api/license/renew-request`.

### 2.4 Where it actually breaks (root causes, ranked)

**BREAK 1 — Vercel does not run `server.ts`; the API gateway returns fake success.**
`server.ts` (4,703 lines, Express) is only used by `npm run dev` / `npm start`. On Vercel, only `api/*.ts` serverless files run. `api/index.ts` routes only: license activate/validate, school-request approve/requests/delete, health, and generic DELETE. **Everything else** — `/api/payment/school-request` (submit), `/api/payment/school-request/status`, `/api/payment/school-license`, `/api/payment/school-licenses`, `/api/license/list`, `/api/license/events` (SSE), `/api/billing/*` (verify/restore/validate/sync/server-time), `/api/admin/notifications`, `/api/admin/verify-preview`, `/api/payment/submit-request`, `/api/payment/admin-verify`, `/api/payment/school-license/save|generate`, `/api/license/revoke|renew-request*`, `/api/payment/dispute/*`, `/api/complaint*` — falls through to the catch-all that returns **HTTP 200 `{status: "API Gateway active"}`**. The client code mostly treats non-`ok`/missing-`success` as silent failure, so: school requests never arrive at the admin, the license-status poll never resolves, billing verify/restore/sync never run, admin notifications never sync. **This is the primary cause of "admin panel does not connect to the app" and "license key does not unlock".**

**BREAK 2 — The HMAC signing secret is random on every server restart.**
`server/googlePlayVerifier.ts`: `SERVER_HMAC_SECRET = process.env.PLAYROOM_SIGNING_SECRET || crypto.randomBytes(32).toString('hex')`. If the env var is not set (it is not in `.env.example` as a value — the var is not even listed there), **every restart/deploy generates a new secret, and every entitlement signed before the restart fails `verifyEntitlementSignature()`** → `validateEntitlementOnServer()` marks it invalid → previously paid passes stop working. Intermittent by nature: works until the next deploy/restart, then breaks. (The restore endpoint re-syncs from Supabase `purchases`, but those rows carry the old signature, so they fail validation too.)

**BREAK 3 — Everything locks when offline (fail-closed by design).**
`checkActivityAccess()` (licenseService.ts:1001): offline → Levels 2–6 **strictly locked**. `GooglePlayBillingService.getStoredEntitlements()` / `getActiveEntitlements()`: `if (!navigator.onLine) return []`. `isActivityAdUnlocked()` / `getAdUnlockedActivities()` / `unlockActivityViaAd()`: offline → false/empty/no-op. So a child on a tablet without internet — the normal use case for a kids' app — loses all paid content, and ad-unlocked activities vanish. This is the "kabhi kabhi garbar" pattern: works on Wi-Fi, locks on mobile data/offline.

**BREAK 4 — Developer mode is hard-disabled.**
`src/utils/devMode.ts`: `isDeveloperMode()` always returns `false`, `setDeveloperMode()` is a no-op, `useDeveloperMode()` returns false, and the module **deletes dev-mode localStorage keys on import**. There is currently **no working way for the owner to view the unlocked version** in the public app. (The admin-preview route via `?preview=admin` exists in App.tsx, but it requires an admin auth session and `/api/admin/verify-preview`, which does not exist on Vercel — see Break 1 — so in practice it also fails on the deployed app.)

**BREAK 5 — License key format mismatch between generators.**
- `api/payment/school-request/approve.ts`, `cloudSchoolSync.generateUniqueLicenseKey()`, `server.ts generateServerUniqueLicenseKey()`: `SCH-XXXX-XXXX-XXXX` (3 groups of 4).
- `server.ts` `/api/payment/school-license` endpoint (line ~1285): `"SCH-" + random(4) + "-" + random(4)` — **only 2 groups of 4**.
- `cleanKey()` strips dashes/spaces so lookup usually still matches, but the admin UI and the school see different-looking keys, and the in-memory "used keys" sets (`serverUsedLicenseKeys`, `serverSchoolLicenses` Map) are **per-process memory** — a server restart wipes them, so duplicate keys can be generated after a restart.

**BREAK 6 — State lives in too many places that never agree.**
The same license/request is stored in: (a) browser localStorage (many keys: `playroom_active_school_license`, `playroom_saved_school_key`, `playroom_school_licenses`, `playroom_all_school_licenses_cache`, `playroom_payment_requests`, `playroom_user_licenses`…), (b) Supabase tables, (c) Express in-memory Maps/Sets/Arrays (`serverSchoolLicenses`, `serverLicenses`, `serverPaymentRequests`, `serverGooglePlayPurchases` — all lost on restart), (d) the `feedback` table abused as a JSON sync bus (`[SCHOOL_LICENSE_SYNC]`, `[ADMIN_NOTIFICATION_SYNC]` messages). `cloudSchoolSync.fetchAllSchoolLicenses()` merges localStorage + `/api/payment/school-licenses` + Supabase and deduplicates by heuristics. Admin and app therefore routinely see different truths depending on device, browser, and whether the server restarted.

**BREAK 7 — Supabase keys are half-configured.**
Client (`src/utils/supabaseClient.ts`) hard-codes a fallback anon key, so the client usually connects. But the serverless `api/*.ts` handlers fall back to `VITE_SUPABASE_ANON_KEY` or empty string, and `server.ts` falls back to empty string — if `SUPABASE_SERVICE_ROLE_KEY` is not set in the deployment environment, server-side writes (license activation updates, purchase records) silently fail or run with anon key under RLS. `.env.example` ships all secret values blank (`VITE_SUPABASE_ANON_KEY=`, `SUPABASE_SERVICE_ROLE_KEY=`, `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON=`).

**BREAK 8 — Manual payment system is a dead end.**
`/api/payment/submit-request` (SadaPay/bank/Payoneer) is **strictly PENDING/UNVERIFIED by design** and never unlocks anything automatically; `/api/payment/providers/status` reports SadaPay NOT_CONFIGURED and bank transfer MANUAL_ADMIN_VERIFICATION. The "verify webhook" accepts any `providerSignature` ≥ 16 chars as "trusted" — no real provider verification. Placeholder bank details in code: `licenseService.ts:263` `iban: 'PK00XXXX0000000000000000'`.

---

## 3. Other broken / half-built / contradictory things

1. **No Android wrapper exists.** AdMob needs a native bridge (Capacitor/Cordova/AndroidBridge); Play Billing needs Digital Goods API (TWA). There is no Capacitor config, no `assetlinks.json`, no TWA/Bubblewrap config anywhere. `public/` has a PWA manifest + service worker only. So **today, in every environment the user has, the "watch ad" and "buy" buttons cannot work** — ads refuse on web, purchases refuse on web.
2. **Prices disagree in at least four places** (§2.1): 800/level vs 300/5,000 vs 25,000 school default vs user's 50,000. The 5,000 pass description also wrongly promises Educator Hub access.
3. **Duplicate product** `prod_indiv_all_activities` identical to `all_activities` (products.ts).
4. **School pricing is admin-editable in two places** (localStorage config + Supabase `products` table) with silent fallbacks — `fetchProductsFromSupabase` maps any unknown product to fallback `pricePkr: 800`, so a misconfigured row silently re-introduces the old 800 PKR price.
5. **`api/index.ts` catch-all returns fake success** for any unknown route (including DELETE) — masks every missing endpoint instead of 404ing, which is why failures are silent rather than visible.
6. **SSE live sync is Express-only** (`/api/license/events` in server.ts). On Vercel there is no SSE; `setupLicenseSSEListener` in the app will never receive events there.
7. **Version/update plumbing is web-only**: `public/version.json` (`2026.10.18.1`) + `src/utils/versionController.ts` + `public/sw.js` (cache `playroom-pwa-2026.10.18.1`) — this is PWA update machinery, irrelevant once the app is Play-Store-only (Play handles updates).
8. **SEO/canonical points at Vercel**: `index.html` canonical + og:url + JSON-LD all point to `https://playroom-preschool-learning-app.vercel.app/` — dead links once Vercel is deleted (see §5).
9. **GA4 tag present** (`G-KDXRSKL29M` in index.html) — keep or remove is a decision; it is web analytics, not needed for a Play Store app.
10. **Test scripts exist but only test localhost Express** (`scripts/test-first-page-payment-audit.mjs`, `test-e2e-license-system.mjs`, `test-expiry-anti-reuse.mjs` target `localhost:3000`) — they never test the Vercel deployment, which is where the app actually runs. That is why the break was never caught.
11. **Admin reset-password / login modals** (`AdminLoginModal`, `AdminResetPasswordModal`) depend on Supabase Auth email flows; password recovery redirects to `/admin.html`.
12. **12 audio files at repo root** (`v1.mp3`–`v6.mp3`, `rhyme.mp3` in public) — check before Play packaging; large assets bloat the AAB.

---

## 4. What Supabase is actually used for

Tables referenced (by `.from("…")` count across src/server/api): `feedback` 50, `school_licenses` 31, `schools` 24, `school_requests` 19, `payments` 5, `purchases` 4, `payment_issues` 4, `notifications` 4, `user_licenses` 2, `school_renewal_requests` 2. Plus `profiles`, `products` (migrations). Migrations: `supabase/migrations/20260820000000_create_playroom_schema.sql` (profiles, products, etc.), `supabase/migrations/20260912000000_create_feedback_table.sql` (same as root `supabase_feedback_migration.sql`), root `supabase_school_licenses_migration.sql` (schools, school_licenses, school_requests), root `supabase_renewal_requests_migration.sql`.

- **`feedback`** — user feedback submissions (rating + message + email) AND, by abuse, the cross-device sync bus: admin notifications are stored as `[ADMIN_NOTIFICATION_SYNC]{json}` rows and school licenses as `[SCHOOL_LICENSE_SYNC]{json}` rows inside `feedback.message`. That is why it has 50 references.
- **`school_licenses` / `schools` / `school_requests` / `school_renewal_requests`** — the entire license-key system.
- **`payments` / `user_licenses` / `payment_issues` / `notifications`** — manual payment flow + admin notifications.
- **`purchases`** — Google Play purchase records (server-side backup; restore re-syncs from here).
- **`products` / `profiles`** — product catalogue (price overrides) and user profiles (Google sign-in accounts).

**Can Supabase be disconnected entirely after the fix? YES — with two conditions:**
1. The license-key system, manual payments, school requests/renewals, admin notifications and feedback are all removed (they are the only Supabase consumers except `purchases`).
2. Google Play purchase restore must not depend on the `purchases` table: the client already keeps the signed entitlement + purchase token in localStorage (`playroom_v3_verified_gp_entitlements`), and `/api/billing/restore-purchases` can re-validate tokens directly against Google's API + HMAC without Supabase. So the `purchases` table is a convenience backup, not a requirement — provided the HMAC secret is made stable (Break 2) so old signatures stay valid.
- Note: **Supabase Auth is also the admin login.** If the admin panel is reduced to a local dev-preview switch (see §7), no auth is needed and Supabase Auth goes away too. The public app's Google sign-in (`getOrCreateUserAccount`, `signInWithGoogle`) is only used to attach payments/licenses to an email — with Play Billing, no account is needed at all (GooglePlayBillingService already states "No Google OAuth, email/password, or user account required").

---

## 5. Vercel — delete, do not redeploy (user decision)

- The app will live **only on Play Store**. The Vercel deployment (`playroom-preschool-learning-app.vercel.app`, per `index.html` canonical/OG/JSON-LD) should be **deleted** from the Vercel dashboard once the Play Store version is live (keep it until then only as a temporary test link, if needed).
- There is **no GitHub auto-deploy wiring**: no `.git` repo in the ZIP, no GitHub Actions, no `vercel.json` git integration. Deployment was manual from the AI Studio ZIP (README links the AI Studio app `https://ai.studio/apps/47378080-ee6f-4480-a47d-97ab7510a97a`; `vercel.json` exists in the repo but only configures rewrites/headers). So "redeploy" today means: rebuild and re-upload manually — there is no pipeline to update.
- Cleanup when deleting Vercel: remove the Vercel project; the canonical/OG/JSON-LD URLs in `index.html` pointing at `*.vercel.app` will be dead and should be removed or repointed; the `api/*` serverless functions and `server.ts` Express backend become dead code (the Play app will use Play Billing + a minimal verification endpoint or none at all — see §7).

---

## 6. About & Feedback — what they do, and the keep-vs-remove trade-off (DECISION PENDING)

The user asked whether About/Feedback go on Play Store and why they should be deleted. They do **not** automatically belong on Play Store — clarification:

### About screen (`src/components/common/AboutPlayroomModal.tsx`, opened from HomeScreen card)
- Static info modal: "Why We Created Playroom", what the app includes, the two experiences (Activity page + Educator Hub), **"designed and developed by Ramsha Shaikh"** (line 169 — keep as-is per user), and a **Free vs Premium features** comparison.
- Uses **no Supabase, no API**. Pure static content.
- **Stale-content risk:** its Premium box currently promises "Complete Levels 2–6 Curriculum (40+ activities)" and "Full Preschool Educator Hub" as premium features — that contradicts the new pricing (5,000 PKR = Page 1 only; Hub is schools-only). If About is kept, this section must be rewritten to match the new products.

### Feedback section (`src/components/common/FeedbackModal.tsx` + `src/utils/feedbackService.ts`, opened from HomeScreen card; admin side `src/components/educator/UserFeedbackAdminTool.tsx`)
- User writes a rating (1–5) + message → `submitFeedback()` inserts into Supabase **`feedback`** table (and caches to localStorage `playroom_user_feedback_submissions` as fallback). Admin reads it in the admin panel's feedback tool.
- Uses **Supabase only** (no other API). If Feedback is kept, Supabase must stay for this one feature.
- **Play Store is separate:** Play Store has its own public reviews (users review in Play Store; the owner reads/replies in Play Console) and its own store-listing description. Those are **unrelated** to the in-app Feedback screen — deleting the in-app screen does not delete Play Store reviews, and keeping it does not affect the Play Store listing. Play Store reviews also cannot be imported into the app.

### Trade-off
| | Keep | Remove |
|---|---|---|
| About | Keeps the "Ramsha Shaikh" credit + feature explanation visible in-app; needs the Free/Premium text rewritten for new pricing | One less screen to maintain; credit remains on WelcomeScreen + App footer (both also say "Ramsha Shaikh") |
| Feedback | Direct channel for parents' messages/questions to the owner | Removes the last Supabase dependency, letting Supabase be disconnected entirely; reviews still come via Play Store public reviews |

**Status: decision pending with the user. Neither is assumed removed in the fix list.**

---

## 7. Prioritized fix list

### P0 — Fix the break (do first)
1. **Decide the single backend.** The app is going Play-Store-only: delete the Express `server.ts` backend and the `api/*` serverless functions from the shipped app. Replace with **one** source of truth: Google Play Billing on-device (Digital Goods API) + server-side verification only if a backend is kept. Until the TWA exists, nothing can be bought — say so plainly instead of shipping a buy card that always fails.
2. **Make the HMAC secret stable.** Set `PLAYROOM_SIGNING_SECRET` as a fixed env value (and `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`) wherever verification runs — never fall back to `crypto.randomBytes`. Otherwise every deploy kills all paid passes (Break 2).
3. **Fix offline behaviour.** Purchased entitlements must be honoured from the signed local cache while offline (verify signature + expiry locally; re-validate with server when back online). The current fail-closed-everywhere design locks paying users offline.
4. **Remove the license-key system entirely** (§7a below).

### (a) Remove the license-key system entirely
- Delete: `api/license/*`, `api/payment/school-request*`, `api/payment/school-license*`, `api/payment/school-licenses*`, license code in `server.ts` (activate/validate/revoke/renew/dispute/complaints, school-license save/generate, SSE events), `src/services/cloudSchoolSync.ts` license/request/renewal/notification sync, `src/services/payment/PaymentServiceManager.ts` school-license + manual-payment code, `src/utils/licenseService.ts` school-license + manual-payment sections, `SchoolAccessGate` key-entry UI, `SchoolRenewalModal`, renewal-request flows, `test-e2e-license-system.mjs` / `test-expiry-anti-reuse.mjs`.
- Delete Supabase tables `school_licenses`, `schools`, `school_requests`, `school_renewal_requests`, `payments`, `user_licenses`, `payment_issues`, `notifications` (after export if needed) and the `feedback` rows carrying `[SCHOOL_LICENSE_SYNC]` / `[ADMIN_NOTIFICATION_SYNC]` payloads.
- Replace the school entry flow: no key entry, no email round-trip. Schools buy the subscription in Play Billing (see (c)).
- Keep the **calendar-month expiry** logic only insofar as the Play subscription needs it — Play itself handles subscription expiry/renewal/cancel; the app only needs to check `subscriptionState` via Play.

### (b) Admin panel → developer preview only
- Strip the admin panel to **one switch: "View unlocked version"** (the existing `isAdminAppViewActive()` override in `checkActivityAccess`/`checkLevelAccess`/`checkActiveSchoolAccess` already implements this — it just needs a working trigger).
- **Fix `src/utils/devMode.ts`**: it is currently hard-coded to always return `false` and deletes its own storage keys on import. Replace with a real toggle: e.g. a hidden gesture (tap the logo/version 5 times) or a PIN, stored in localStorage, default OFF, never shipped enabled to users. The `DeveloperModeToggle` component already exists — wire it to a real state instead of the stub.
- Remove from the admin panel: school requests, registered schools, license generation, payment requests/verification, renewals, disputes, complaints, notifications, feedback admin (if Feedback is removed; otherwise keep only the feedback reader).
- Remove admin login/Supabase Auth if nothing else needs it. Remove `admin.html` subdomain routing once the panel is dev-only (or keep it behind the same hidden toggle).
- Note: the current admin preview depends on `/api/admin/verify-preview` (missing on Vercel) and Supabase Auth — both go away with this change, which is precisely why it never worked on the deployed app.

### (c) Google Play in-app billing products (target state)
Already exists: `server/googlePlayVerifier.ts` (Android Publisher API verification, HMAC-signed entitlements), `src/services/billing/GooglePlayBillingService.ts` (Digital Goods API purchase/restore/validate, 3-pack selection sync), `PremiumAccessModal` purchase handlers, `/api/billing/*` endpoints (Express only — see Break 1).

| Product (Play Console) | Type | Price | Unlocks | Exists? |
|---|---|---|---|---|
| Ad unlock | Rewarded ad (AdMob) | Free | 1 activity (next in sequence) | Partial — needs a **production AdMob unit ID** (currently Google test ID) and a native bridge (Capacitor/TWA) |
| `playroom_3activities_7d` | One-time (consumable) | **300 PKR** | Any 3 activities, 7 days | Yes — but currently **time-limited 7d**, and the 5,000 product's description wrongly promises Hub access |
| `playroom_all_activities_30d` | One-time | **5,000 PKR** | Full Page 1, 30 days | Yes — needs rename/re-scope: Page 1 only, and per user intent this should be **one-time permanent**, not 30-day; either change the product to non-consumable permanent or keep 30d and say so explicitly |
| School subscription (NEW) | **Subscription, auto-renewing** | **50,000 PKR/month** | **Page 1 + Page 2 (both)**, auto-locks on cancel/expire | **Missing entirely** — no product ID, no subscription verification (`purchases.subscriptions.get` is never called; the verifier only handles one-time products), no school checkout UI. This is the biggest missing piece. |

Missing work for (c):
- Create the 3 products + the school subscription in **Play Console** (she already owns a Play Console account) with the exact IDs above; add the school subscription ID to the verifier whitelist and add subscription verification.
- Decide: is 5,000 PKR permanent or 30-day? The user said "full page one" (one-time). The code currently implements 30-day expiry. Pick one and make the product, the verifier (`durationDays`), and the UI text agree.
- Fix the 5,000 PKR product description (remove "AND full Preschool Educator Hub access").
- Fix the 25,000 vs 50,000 school price: set the subscription price to 50,000 PKR/month in Play Console and delete the `DEFAULT_SCHOOL_TIERS` (25,000/70,000/120,000/220,000) and admin tier editor.
- Production AdMob rewarded unit ID + AdMob app ID; test ads currently hard-coded.
- Decide the verification backend: if no server is kept, verification must happen via Play's client APIs + local signature checks only; if a small server is kept, it needs the **stable** HMAC secret + the Google service-account JSON actually configured (currently blank in `.env.example`).

---

## 8. Play Store AAB — realistic path and blockers

Current state: **Vite web app + Express server + PWA manifest/service worker. There is no Android project, no Capacitor/Cordova config, no TWA config, no `assetlinks.json`, no `android/` folder.**

Realistic path (in order):
1. **Freeze the web backend first** (§7 P0): the shipped app must not depend on `server.ts` or `api/*` (they will not exist in the Play build). Billing via Digital Goods API + AdMob via native bridge only work inside a wrapper.
2. **Wrap the Vite build as a TWA (Trusted Web Activity)** — the lightest path for a PWA that already has a manifest + service worker: use **PWABuilder** or **Bubblewrap** to generate an Android Studio project from the hosted PWA (or from the built `dist/`), package name **`com.playroom.app`** (already hard-coded in `googlePlayVerifier.ts` and `GooglePlayBillingService.purchaseProduct`). This gives an AAB that Play accepts.
   - Alternative: **Capacitor** (`@capacitor/core` + `@capacitor-community/admob` / Play Billing plugin) — more work, but gives real native AdMob + billing plugins instead of relying on the Digital Goods API. Choose this if the Digital Goods API proves flaky.
3. **`.well-known/assetlinks.json`** must be served from the PWA's domain for TWA (Digital Goods API requires the TWA–origin association). If the PWA stays on Vercel until Play launch, host it there; if Vercel is deleted, the TWA needs another HTTPS host for the PWA (or switch to a fully native Capacitor build, which needs no hosted origin).
4. **Play Console setup** (account already owned): create the app, upload the AAB, create the 4 in-app products + school subscription with the exact IDs/prices, add the **Google Play service account** (Android Publisher API) and set `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` + stable `PLAYROOM_SIGNING_SECRET` wherever verification runs.
5. **Versioning**: Play requires a **versionCode bump on every release** (the PWA `version.json`/`versionController`/`sw.js` cache scheme is separate and does not satisfy Play). Keep `version.json` in sync manually, or drop it (Play handles updates; the PWA updater becomes dead code in the TWA).
6. **Kids/privacy requirements**: the app targets ages 3–6 — Play's **Families policy** applies (Designed for Families, no personal data collection, no account requirement — the billing service already avoids accounts, good). The GA4 tag (`G-KDXRSKL29M` in `index.html`) and any analytics/ads SDKs must comply with the Families policy; the "watch ad" flow must use a Families-certified ad SDK and must not show personalised ads to children. The placeholder `PK00XXXX…` IBAN and Payoneer/SadaPay provider code should be deleted, not shipped.
7. **Content**: the 12 root `.mp3` files (v1–v6, rhyme.mp3 in public) and `public/assets/` should be audited for size before packaging the AAB.

**Blockers, in short:** no Android wrapper (biggest); no production AdMob ID; school subscription product + subscription verification missing; HMAC secret unstable; verification backend depends on Express endpoints that don't exist on the current host; Vercel must be deleted, which also removes the PWA host the TWA would point at — decide the PWA host (or go Capacitor) before wrapping.

---

## 9. Branding note (do not change)

"Ramsha Shaikh" appears in: `src/components/WelcomeScreen.tsx:128` ("Developed by Ramsha Shaikh"), `src/components/common/AboutPlayroomModal.tsx:169`, `src/App.tsx:2382` (footer). **Keep as-is.** Do not rename to Urooj anywhere in the app.

---

## 10. Verification notes

- Read: `package.json`, `src/App.tsx` (lines 1–330, 490–730), `src/main.tsx`, `src/types.ts`, `src/services/billing/GooglePlayBillingService.ts` (full), `src/services/ads/AdMobService.ts` (full), `src/services/payment/products.ts`, `src/utils/licenseService.ts` (683–1316), `src/utils/devMode.ts` (full), `src/utils/supabaseClient.ts` (full), `src/components/PremiumAccessModal.tsx` (1–280), `src/components/PreschoolEducatorHub.tsx` (grep), `src/components/educator/SchoolAccessGate.tsx` (grep), `src/admin/AdminApp.tsx` (grep), `admin.html`, `index.html`, `server/googlePlayVerifier.ts` (full), `server.ts` (routes + billing/license sections), `api/index.ts`, `api/license/activate.ts`, `api/license/validate.ts`, `api/payment/school-requests.ts` (partial), `vercel.json`, `README.md`, `public/manifest.json`, `public/version.json`, `supabase` migrations (all), `src/utils/schoolPricingService.ts` (tiers), `src/utils/feedbackService.ts` (grep), `src/components/common/AboutPlayroomModal.tsx` (grep + Free/Premium section), `src/services/cloudSchoolSync.ts` (exports + `fetchAllSchoolLicenses`).
- Not fully read (noted as limits): `src/App.tsx` lines 730–2394 (skimmed via grep for modal/renew/SSE usage), `src/components/admin/*` internals, `PaymentServiceManager.ts` (3,134 lines — grep only), `supabaseService.ts` (1,318 lines — head + grep only), `cloudSchoolSync.ts` (exports + key sections only).
- No source files were modified. Only this report was written.

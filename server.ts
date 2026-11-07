/**
 * Playroom — optional verification backend (Play-Store-only app).
 *
 * This server exists ONLY to verify Google Play purchases/subscriptions
 * against the Google Play Developer API and to issue HMAC-signed
 * entitlements. It is optional: the client works without it (see
 * VITE_VERIFY_API_URL in .env.example) by falling back to the on-device
 * Digital Goods API + the local signed entitlement cache.
 *
 * REMOVED (2026-11-07, license system deleted):
 * - All license-key endpoints (activate/validate/revoke/renew/check-access/list)
 * - All school-request / school-license endpoints (submit/approve/reject/list/save/generate)
 * - All manual-payment endpoints (SadaPay / bank / Payoneer submit, admin-verify, webhook, providers/status)
 * - All dispute / complaint endpoints
 * - All admin notification endpoints and /api/admin/verify-preview
 * - SSE live-sync (/api/license/events) — no server-sent events any more
 * - All Supabase usage (the `purchases` backup table is gone; entitlements
 *   are re-validated directly against Google, so no DB is needed)
 * - The fake-200 api/ catch-all (api/ directory deleted entirely)
 *
 * Kept endpoints:
 *   GET  /api/health
 *   GET  /api/billing/server-time
 *   POST /api/billing/verify-google-play-purchase   (one-time products)
 *   POST /api/billing/verify-school-subscription    (playroom_school_monthly)
 *   POST /api/billing/validate-entitlements
 *   POST /api/billing/restore-purchases
 *   POST /api/billing/sync-3pack-activities        (in-memory only)
 *
 * Unknown /api/* routes return 404 — never a fake success.
 *
 * Requires PLAYROOM_SIGNING_SECRET (stable, fixed value — see
 * server/googlePlayVerifier.ts) and GOOGLE_PLAY_SERVICE_ACCOUNT_JSON.
 */
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import {
  verifyPurchaseTokenWithGoogle,
  verifySubscriptionTokenWithGoogle,
  generateVerifiedEntitlement,
  APP_PACKAGE_NAME,
  ALLOWED_PRODUCT_IDS,
  SCHOOL_SUBSCRIPTION_PRODUCT_ID,
  AllowedProductId,
  validateEntitlementOnServer,
  VerifiedEntitlementPayload,
} from "./server/googlePlayVerifier";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json({ limit: "10mb" }));

  // In-memory registry of entitlements verified by THIS server process.
  // This is a cache only — restore re-validates tokens against Google, so
  // a restart does not lose access. Never persisted to a database.
  const serverGooglePlayPurchases: VerifiedEntitlementPayload[] = [];

  const upsertEntitlement = (entitlement: VerifiedEntitlementPayload) => {
    const idx = serverGooglePlayPurchases.findIndex(
      (p) => p.purchaseToken === entitlement.purchaseToken
    );
    if (idx !== -1) serverGooglePlayPurchases[idx] = entitlement;
    else serverGooglePlayPurchases.unshift(entitlement);
  };

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  /**
   * Authoritative Server Time Endpoint.
   * Prevents client device clock manipulation or rollbacks.
   */
  app.get("/api/billing/server-time", (_req, res) => {
    const now = Date.now();
    return res.json({
      success: true,
      serverTime: now,
      serverTimeIso: new Date(now).toISOString(),
    });
  });

  /**
   * Google Play Billing Verification Endpoint (one-time products).
   * Verifies the purchase token with the Google Play Developer API,
   * calculates a server-authoritative expiry, signs the entitlement
   * cryptographically, and returns it. No database, no license keys.
   */
  app.post("/api/billing/verify-google-play-purchase", async (req, res) => {
    try {
      const { productId, purchaseToken, packageName, preSelectedActivityId } = req.body;

      if (!productId || !purchaseToken) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: "Missing required billing parameters (productId, purchaseToken).",
        });
      }

      const targetPackage = packageName || APP_PACKAGE_NAME;
      if (targetPackage !== APP_PACKAGE_NAME) {
        return res.status(403).json({
          success: false,
          verified: false,
          error: `Access denied. Package name '${targetPackage}' does not match '${APP_PACKAGE_NAME}'.`,
        });
      }

      if (!ALLOWED_PRODUCT_IDS.includes(productId as AllowedProductId)) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: `Unrecognized Google Play product ID: ${productId}. Expected: ${ALLOWED_PRODUCT_IDS.join(", ")}`,
        });
      }

      // School subscription tokens are verified via the subscriptions API.
      const googleResult =
        productId === SCHOOL_SUBSCRIPTION_PRODUCT_ID
          ? await verifySubscriptionTokenWithGoogle(targetPackage, productId, String(purchaseToken))
          : await verifyPurchaseTokenWithGoogle(targetPackage, productId, String(purchaseToken));

      if (!googleResult.verified) {
        console.warn(`[Google Play Billing] Verification rejected for ${productId}:`, googleResult.error);
        return res.status(422).json({
          success: false,
          verified: false,
          error: googleResult.error || "Google Play purchase could not be verified.",
          code: googleResult.code,
          enableUrl: googleResult.enableUrl,
        });
      }

      const entitlement = generateVerifiedEntitlement(
        productId as AllowedProductId,
        String(purchaseToken),
        googleResult
      );

      const initialUnlockedActivities =
        productId === "playroom_3activities_7d" && preSelectedActivityId
          ? [String(preSelectedActivityId)]
          : [];
      entitlement.unlockedActivityIds = initialUnlockedActivities;

      upsertEntitlement(entitlement);

      console.log(
        `[Google Play Billing] Verified & issued entitlement for ${productId} (Order: ${entitlement.orderId}, Expires: ${entitlement.expiryTime})`
      );

      return res.json({ success: true, verified: true, entitlement });
    } catch (err: any) {
      console.warn("[Google Play Billing Server Notice]", err);
      return res.status(500).json({
        success: false,
        verified: false,
        error: err.message || "Failed to verify Google Play purchase.",
      });
    }
  });

  /**
   * School Subscription Verification Endpoint.
   * POST { productId: 'playroom_school_monthly', purchaseToken, packageName? }
   * Verifies via Android Publisher API purchases.subscriptions.get and
   * returns a signed entitlement (30 days = current billing period;
   * Play handles renewal/cancel, the client re-verifies on next launch).
   * Unlocks Page 1 + Page 2 (Educator Hub). Rs 50,000/month (PKR base, $99 abroad).
   */
  app.post("/api/billing/verify-school-subscription", async (req, res) => {
    try {
      const { productId, purchaseToken, packageName } = req.body;
      const subProductId = productId || SCHOOL_SUBSCRIPTION_PRODUCT_ID;

      if (!purchaseToken) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: "Missing required billing parameter (purchaseToken).",
        });
      }

      if (subProductId !== SCHOOL_SUBSCRIPTION_PRODUCT_ID) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: `Unrecognized school subscription product ID: ${subProductId}. Expected: ${SCHOOL_SUBSCRIPTION_PRODUCT_ID}`,
        });
      }

      const targetPackage = packageName || APP_PACKAGE_NAME;
      if (targetPackage !== APP_PACKAGE_NAME) {
        return res.status(403).json({
          success: false,
          verified: false,
          error: `Access denied. Package name '${targetPackage}' does not match '${APP_PACKAGE_NAME}'.`,
        });
      }

      const googleResult = await verifySubscriptionTokenWithGoogle(
        targetPackage,
        SCHOOL_SUBSCRIPTION_PRODUCT_ID,
        String(purchaseToken)
      );

      if (!googleResult.verified) {
        console.warn(`[Google Play Billing] Subscription verification rejected:`, googleResult.error);
        return res.status(422).json({
          success: false,
          verified: false,
          error: googleResult.error || "Google Play subscription could not be verified.",
          code: googleResult.code,
          enableUrl: googleResult.enableUrl,
        });
      }

      const entitlement = generateVerifiedEntitlement(
        SCHOOL_SUBSCRIPTION_PRODUCT_ID,
        String(purchaseToken),
        googleResult
      );
      upsertEntitlement(entitlement);

      console.log(
        `[Google Play Billing] Verified school subscription (Order: ${entitlement.orderId}, Expires: ${entitlement.expiryTime})`
      );

      return res.json({ success: true, verified: true, entitlement });
    } catch (err: any) {
      console.warn("[Google Play Billing Server Notice]", err);
      return res.status(500).json({
        success: false,
        verified: false,
        error: err.message || "Failed to verify Google Play subscription.",
      });
    }
  });

  /**
   * Persist 3-Pack Selected Activity IDs (in-memory only).
   * The client is the source of truth (localStorage); this only lets the
   * server merge the latest picks into validate/restore responses.
   */
  app.post("/api/billing/sync-3pack-activities", async (req, res) => {
    try {
      const { purchaseToken, activityIds } = req.body;

      if (!purchaseToken || typeof purchaseToken !== "string") {
        return res.status(400).json({ success: false, error: "purchaseToken is required." });
      }
      if (!Array.isArray(activityIds)) {
        return res.status(400).json({ success: false, error: "activityIds must be an array." });
      }

      const cleanIds: string[] = Array.from(
        new Set(
          activityIds
            .filter((id) => typeof id === "string" && id.trim().length > 0)
            .map((id) => id.trim())
        )
      ).slice(0, 3);

      const cached = serverGooglePlayPurchases.find((p) => p.purchaseToken === purchaseToken);
      if (cached) cached.unlockedActivityIds = cleanIds;

      return res.json({ success: true, count: cleanIds.length, unlockedActivityIds: cleanIds });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || "Sync error" });
    }
  });

  /**
   * Server-Authoritative Entitlement Validation Endpoint.
   * Cryptographically validates entitlements against the stable server
   * secret and compares against authoritative server UTC clock.
   */
  app.post("/api/billing/validate-entitlements", async (req, res) => {
    try {
      const { entitlements } = req.body;
      const list = Array.isArray(entitlements) ? entitlements : [];
      const now = Date.now();

      const validEntitlements: any[] = [];
      const expiredEntitlements: any[] = [];
      let invalidCount = 0;

      for (const ent of list) {
        const validation = validateEntitlementOnServer(ent, now);
        if (!validation.valid) {
          invalidCount++;
          continue;
        }
        if (validation.isExpired) {
          expiredEntitlements.push({ ...ent, status: "EXPIRED" });
          continue;
        }

        let mergedUnlockedActivities = Array.isArray(ent.unlockedActivityIds)
          ? ent.unlockedActivityIds
          : [];
        const cached = serverGooglePlayPurchases.find((p) => p.purchaseToken === ent.purchaseToken);
        if (cached && Array.isArray(cached.unlockedActivityIds) && cached.unlockedActivityIds.length > 0) {
          mergedUnlockedActivities = cached.unlockedActivityIds;
        }

        validEntitlements.push({
          ...ent,
          status: "ACTIVE",
          unlockedActivityIds: mergedUnlockedActivities,
        });
      }

      return res.json({
        success: true,
        serverTime: now,
        serverTimeIso: new Date(now).toISOString(),
        validEntitlements,
        expiredEntitlements,
        invalidCount,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || "Validation error" });
    }
  });

  /**
   * Google Play Billing Restore Endpoint.
   * Re-validates each supplied purchase token directly against Google
   * (one-time via products.get, school via subscriptions.get) and
   * returns fresh signed entitlements for the still-active ones.
   * Tokens already in this server's in-memory registry are validated
   * by signature + server clock instead. No Supabase, no license keys.
   */
  app.post("/api/billing/restore-purchases", async (req, res) => {
    try {
      const { purchaseTokens } = req.body;
      const tokens: string[] = Array.isArray(purchaseTokens) ? purchaseTokens : [];
      const now = Date.now();

      const activeEntitlements: VerifiedEntitlementPayload[] = [];

      for (const token of tokens) {
        const cached = serverGooglePlayPurchases.find((p) => p.purchaseToken === token);
        if (cached) {
          const validation = validateEntitlementOnServer(cached, now);
          if (validation.valid && !validation.isExpired) {
            activeEntitlements.push(cached);
            continue;
          }
          // Cached entitlement expired — fall through to live Google re-check
          // (a renewed subscription gets a fresh expiry from Google).
        }

        // Live re-check against Google. We do not know the product for a
        // bare token, so try the school subscription first only if the
        // cached record says so; otherwise try one-time products.
        const productIdsToTry: AllowedProductId[] =
          cached?.productId === SCHOOL_SUBSCRIPTION_PRODUCT_ID
            ? [SCHOOL_SUBSCRIPTION_PRODUCT_ID]
            : (["playroom_3activities_7d", "playroom_all_activities_30d"] as AllowedProductId[]);

        for (const productId of productIdsToTry) {
          const googleResult =
            productId === SCHOOL_SUBSCRIPTION_PRODUCT_ID
              ? await verifySubscriptionTokenWithGoogle(APP_PACKAGE_NAME, productId, token)
              : await verifyPurchaseTokenWithGoogle(APP_PACKAGE_NAME, productId, token);
          if (googleResult.verified) {
            const entitlement = generateVerifiedEntitlement(productId, token, googleResult);
            if (cached && Array.isArray(cached.unlockedActivityIds)) {
              entitlement.unlockedActivityIds = cached.unlockedActivityIds;
            }
            upsertEntitlement(entitlement);
            activeEntitlements.push(entitlement);
            break;
          }
        }
      }

      // Also include any in-memory active entitlements when no tokens were supplied.
      if (tokens.length === 0) {
        for (const p of serverGooglePlayPurchases) {
          const validation = validateEntitlementOnServer(p, now);
          if (validation.valid && !validation.isExpired) activeEntitlements.push(p);
        }
      }

      return res.json({ success: true, serverTime: now, entitlements: activeEntitlements });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || "Restore error" });
    }
  });

  // Unknown /api/* routes: honest 404 — never a fake success.
  app.all("/api/*", (_req, res) => {
    return res.status(404).json({
      success: false,
      error: "Unknown API endpoint. The license/manual-payment/SSE API was removed; only /api/billing/* and /api/health exist.",
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(async (req, res, next) => {
      const url = req.originalUrl || req.url;
      if (url.startsWith("/admin") && !url.includes(".")) {
        try {
          const adminHtmlPath = path.join(process.cwd(), "admin.html");
          let template = await fs.promises.readFile(adminHtmlPath, "utf-8");
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
          return;
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
          return;
        }
      }
      vite.middlewares(req, res, next);
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get(["/admin", "/admin/*"], (req, res) => {
      const adminFile = path.join(distPath, "admin.html");
      if (fs.existsSync(adminFile)) {
        res.sendFile(adminFile);
      } else {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

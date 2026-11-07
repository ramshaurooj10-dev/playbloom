import { google } from 'googleapis';
import crypto from 'crypto';

export const APP_PACKAGE_NAME = 'com.playroom.app';

export const ALLOWED_PRODUCT_IDS = [
  'playroom_3activities_7d',
  'playroom_all_activities_30d',
  'playroom_school_monthly',
] as const;

export type AllowedProductId = typeof ALLOWED_PRODUCT_IDS[number];

export const SCHOOL_SUBSCRIPTION_PRODUCT_ID = 'playroom_school_monthly' as const;

export interface GooglePlayVerificationResult {
  verified: boolean;
  error?: string;
  orderId?: string;
  purchaseTimeMillis?: string | number;
  purchaseState?: number; // 0 = Purchased, 1 = Canceled, 2 = Pending
  consumptionState?: number; // 0 = Yet to be consumed, 1 = Consumed
  acknowledgementState?: number; // 0 = Yet to be acknowledged, 1 = Acknowledged
  developerPayload?: string;
  kind?: string;
  verificationMethod: 'google_play_developer_api' | 'development_mock_mode';
  code?: string;
  enableUrl?: string;
  // Subscription fields (from purchases.subscriptions.get)
  subscriptionState?: string;
  expiryTimeMillis?: string | number;
  startTimeMillis?: string | number;
  autoResumeTimeMillis?: string | number;
  autoRenewingPrice?: { priceMicros?: string; currency?: string };
}

export interface VerifiedEntitlementPayload {
  productId: AllowedProductId;
  orderId: string;
  purchaseToken: string;
  packageName: string;
  purchaseTime: string;
  expiryTime: string;
  durationDays: number;
  unlockedType: 'three_activities' | 'all_activities' | 'school_subscription';
  unlockedActivityIds?: string[];
  pricePaidPkr: number;
  status: 'ACTIVE' | 'EXPIRED';
  verificationSource: string;
  serverSignature: string;
}

/**
 * Stable server signing secret — REQUIRED.
 * There is deliberately NO random fallback here: a random secret on every
 * restart invalidated every previously issued entitlement (AUDIT Break 2).
 * Set PLAYROOM_SIGNING_SECRET in the deployment environment to one fixed
 * strong value, e.g. generated once with: openssl rand -hex 32
 * The server refuses to start without it.
 */
function getServerHmacSecret(): string {
  const secret = process.env.PLAYROOM_SIGNING_SECRET;
  if (!secret || !secret.trim()) {
    throw new Error(
      '[Google Play Verifier] FATAL: PLAYROOM_SIGNING_SECRET is not set. ' +
        'Generate one fixed secret with `openssl rand -hex 32` and set it as the ' +
        'PLAYROOM_SIGNING_SECRET environment variable wherever this server runs. ' +
        'Do NOT commit the real value. The server cannot start without it, because ' +
        'a random per-restart secret would invalidate all previously issued entitlements.'
    );
  }
  return secret.trim();
}

const SERVER_HMAC_SECRET = getServerHmacSecret();

/**
 * Parses and loads the Google Play Developer Service Account credentials from environment.
 * Supports direct JSON string or base64-encoded JSON string.
 * NEVER exposed to client or frontend bundles.
 */
function getGooglePlayServiceAccountCredentials(): any | null {
  const rawEnv = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!rawEnv || !rawEnv.trim()) {
    return null;
  }

  try {
    const trimmed = rawEnv.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return JSON.parse(trimmed);
    }
    const decoded = Buffer.from(trimmed, 'base64').toString('utf-8');
    if (decoded.startsWith('{') && decoded.endsWith('}')) {
      return JSON.parse(decoded);
    }
  } catch (err) {
    console.warn('[Google Play Verifier] Notice: Failed to parse GOOGLE_PLAY_SERVICE_ACCOUNT_JSON:', err);
  }
  return null;
}

/**
 * Creates an authenticated Google Android Publisher API client using the service account.
 */
function getAndroidPublisherClient() {
  const credentials = getGooglePlayServiceAccountCredentials();
  if (!credentials) {
    return null;
  }

  try {
    const auth = google.auth.fromJSON(credentials);
    if ('scopes' in auth || typeof (auth as any).setScopes === 'function') {
      (auth as any).scopes = ['https://www.googleapis.com/auth/androidpublisher'];
    }

    return google.androidpublisher({
      version: 'v3',
      auth: auth as any,
    });
  } catch (err) {
    console.warn('[Google Play Verifier] Notice: Could not initialize Android Publisher client:', err);
    return null;
  }
}

function handlePublisherApiError(apiError: any): GooglePlayVerificationResult {
  const rawErrMsg = apiError?.response?.data?.error?.message || apiError?.message || 'Google Play purchase verification failed.';
  const isApiDisabled = rawErrMsg.includes('has not been used in project') || rawErrMsg.includes('is disabled');

  if (isApiDisabled) {
    console.warn('[Google Play Verifier] Notice: Google Play Android Developer API is not enabled on the configured Google Cloud project.');
    const projectMatch = rawErrMsg.match(/project[ =](\d+)/i);
    const projectId = projectMatch ? projectMatch[1] : '678269096769';
    const enableUrl = `https://console.developers.google.com/apis/api/androidpublisher.googleapis.com/overview?project=${projectId}`;

    return {
      verified: false,
      error: `Google Play Android Developer API is disabled on Google Cloud project ${projectId}. Enable it at ${enableUrl} to verify live purchases.`,
      code: 'GOOGLE_PLAY_API_DISABLED',
      enableUrl,
      verificationMethod: 'google_play_developer_api',
    };
  }

  console.warn('[Google Play Verifier] Verification rejected:', rawErrMsg);
  return {
    verified: false,
    error: `Google Play Developer API verification failed: ${rawErrMsg}`,
    verificationMethod: 'google_play_developer_api',
  };
}

/**
 * Verifies a one-time purchase token with the Google Play Developer API (androidpublisher v3).
 * Only for one-time products. Subscriptions use verifySubscriptionTokenWithGoogle().
 */
export async function verifyPurchaseTokenWithGoogle(
  packageName: string,
  productId: string,
  purchaseToken: string
): Promise<GooglePlayVerificationResult> {
  if (packageName !== APP_PACKAGE_NAME) {
    return {
      verified: false,
      error: `Invalid package name '${packageName}'. Expected '${APP_PACKAGE_NAME}'.`,
      verificationMethod: 'google_play_developer_api',
    };
  }

  if (!ALLOWED_PRODUCT_IDS.includes(productId as any)) {
    return {
      verified: false,
      error: `Invalid product ID '${productId}'. Expected one of: ${ALLOWED_PRODUCT_IDS.join(', ')}.`,
      verificationMethod: 'google_play_developer_api',
    };
  }

  if (productId === SCHOOL_SUBSCRIPTION_PRODUCT_ID) {
    return verifySubscriptionTokenWithGoogle(packageName, productId, purchaseToken);
  }

  const publisher = getAndroidPublisherClient();
  if (!publisher) {
    return {
      verified: false,
      error: 'Google Play Developer Service Account credentials (GOOGLE_PLAY_SERVICE_ACCOUNT_JSON) are not configured on the backend. Purchases cannot be verified without Google Play API credentials.',
      verificationMethod: 'google_play_developer_api',
    };
  }

  try {
    console.log(`[Google Play Verifier] Contacting Google Play Developer API for product ${productId}...`);

    const response = await publisher.purchases.products.get({
      packageName: APP_PACKAGE_NAME,
      productId,
      token: purchaseToken,
    });

    const data = response.data;
    console.log('[Google Play Verifier] Google Play API Response received:', {
      purchaseState: data.purchaseState,
      consumptionState: data.consumptionState,
      acknowledgementState: data.acknowledgementState,
      orderId: data.orderId,
    });

    // purchaseState: 0 = Purchased, 1 = Canceled, 2 = Pending
    if (data.purchaseState !== 0) {
      const stateLabels = ['Purchased', 'Canceled', 'Pending'];
      const stateStr = stateLabels[data.purchaseState ?? -1] || `Unknown (${data.purchaseState})`;
      return {
        verified: false,
        error: `Purchase is not in a completed state (Google Play Status: ${stateStr}).`,
        purchaseState: data.purchaseState ?? undefined,
        orderId: data.orderId ?? undefined,
        verificationMethod: 'google_play_developer_api',
      };
    }

    return {
      verified: true,
      orderId: data.orderId || `GPA.${Date.now()}`,
      purchaseTimeMillis: data.purchaseTimeMillis || Date.now(),
      purchaseState: data.purchaseState ?? 0,
      consumptionState: data.consumptionState ?? 0,
      acknowledgementState: data.acknowledgementState ?? 0,
      developerPayload: data.developerPayload ?? undefined,
      kind: data.kind ?? undefined,
      verificationMethod: 'google_play_developer_api',
    };
  } catch (apiError: any) {
    return handlePublisherApiError(apiError);
  }
}

/**
 * Verifies a school subscription token via Android Publisher API
 * purchases.subscriptionsv2.get. (The v1 purchases.subscriptions.get endpoint
 * was removed from the googleapis typings — v2 is the current API.) A
 * subscription is verified only when subscriptionState is
 * SUBSCRIPTION_STATE_ACTIVE or SUBSCRIPTION_STATE_IN_GRACE_PERIOD and the
 * line item's expiryTime is in the future. Play itself handles
 * renewal/cancel; the app only reads the current state.
 */
export async function verifySubscriptionTokenWithGoogle(
  packageName: string,
  productId: string,
  purchaseToken: string
): Promise<GooglePlayVerificationResult> {
  if (packageName !== APP_PACKAGE_NAME) {
    return {
      verified: false,
      error: `Invalid package name '${packageName}'. Expected '${APP_PACKAGE_NAME}'.`,
      verificationMethod: 'google_play_developer_api',
    };
  }

  if (productId !== SCHOOL_SUBSCRIPTION_PRODUCT_ID) {
    return {
      verified: false,
      error: `Invalid subscription product ID '${productId}'. Expected '${SCHOOL_SUBSCRIPTION_PRODUCT_ID}'.`,
      verificationMethod: 'google_play_developer_api',
    };
  }

  const publisher = getAndroidPublisherClient();
  if (!publisher) {
    return {
      verified: false,
      error: 'Google Play Developer Service Account credentials (GOOGLE_PLAY_SERVICE_ACCOUNT_JSON) are not configured on the backend. Subscriptions cannot be verified without Google Play API credentials.',
      verificationMethod: 'google_play_developer_api',
    };
  }

  try {
    console.log(`[Google Play Verifier] Contacting Google Play Developer API for subscription ${productId}...`);

    const response = await publisher.purchases.subscriptionsv2.get({
      packageName: APP_PACKAGE_NAME,
      token: purchaseToken,
    });

    const data = response.data;
    const state = data.subscriptionState as string | undefined;
    // v2 returns line items; the school subscription is the (single) item.
    const lineItem = Array.isArray(data.lineItems) ? data.lineItems[0] : undefined;
    const expiryIso = lineItem?.expiryTime as string | undefined;
    const expiryMillis = expiryIso ? new Date(expiryIso).getTime() : NaN;

    console.log('[Google Play Verifier] Subscription API response:', {
      subscriptionState: state,
      expiryTime: expiryIso,
      // NOTE: subscriptionsv2 does not return an order id; a GPA-style id is
      // generated below for the entitlement record.
    });

    const activeStates = ['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD'];
    if (!state || !activeStates.includes(state)) {
      return {
        verified: false,
        error: `School subscription is not active (Google Play state: ${state || 'unknown'}).`,
        subscriptionState: state,
        expiryTimeMillis: isNaN(expiryMillis) ? undefined : expiryMillis,
        verificationMethod: 'google_play_developer_api',
      };
    }

    if (!isNaN(expiryMillis) && expiryMillis <= Date.now()) {
      return {
        verified: false,
        error: 'School subscription has expired according to Google Play.',
        subscriptionState: state,
        expiryTimeMillis: expiryMillis,
        verificationMethod: 'google_play_developer_api',
      };
    }

    return {
      verified: true,
      orderId: `GPA.${Date.now()}`,
      purchaseTimeMillis: Date.now(),
      subscriptionState: state,
      expiryTimeMillis: isNaN(expiryMillis) ? undefined : expiryMillis,
      verificationMethod: 'google_play_developer_api',
    };
  } catch (apiError: any) {
    return handlePublisherApiError(apiError);
  }
}

/**
 * Calculates entitlement duration and signs the entitlement payload cryptographically.
 * School subscription: 30 days, Rs 50,000 PKR. The expiry stamped here is the
 * current billing period end; on renewal the client re-verifies with Google
 * and receives a fresh entitlement.
 */
export function generateVerifiedEntitlement(
  productId: AllowedProductId,
  purchaseToken: string,
  googleResult: GooglePlayVerificationResult
): VerifiedEntitlementPayload {
  const is3Activities = productId === 'playroom_3activities_7d';
  const isSchool = productId === SCHOOL_SUBSCRIPTION_PRODUCT_ID;

  // For a live subscription, trust Google's expiryTimeMillis when present.
  const googleExpiryMs =
    googleResult.expiryTimeMillis !== undefined && googleResult.expiryTimeMillis !== null
      ? Number(googleResult.expiryTimeMillis)
      : NaN;

  const durationDays = is3Activities ? 7 : 30;
  const pricePaidPkr = is3Activities ? 300 : isSchool ? 50000 : 5000;
  const unlockedType: 'three_activities' | 'all_activities' | 'school_subscription' = is3Activities
    ? 'three_activities'
    : isSchool
      ? 'school_subscription'
      : 'all_activities';

  const purchaseDate = googleResult.purchaseTimeMillis
    ? new Date(Number(googleResult.purchaseTimeMillis))
    : new Date();

  const purchaseTime = purchaseDate.toISOString();
  const expiryTime = !isNaN(googleExpiryMs)
    ? new Date(googleExpiryMs).toISOString()
    : new Date(purchaseDate.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();
  const orderId = googleResult.orderId || `GPA.${Date.now()}`;

  // Generate server HMAC signature over the exact entitlement fields
  const signaturePayload = `${APP_PACKAGE_NAME}:${productId}:${orderId}:${purchaseToken}:${expiryTime}`;
  const serverSignature = crypto
    .createHmac('sha256', SERVER_HMAC_SECRET)
    .update(signaturePayload)
    .digest('hex');

  return {
    productId,
    orderId,
    purchaseToken,
    packageName: APP_PACKAGE_NAME,
    purchaseTime,
    expiryTime,
    durationDays,
    unlockedType,
    pricePaidPkr,
    status: 'ACTIVE',
    verificationSource: googleResult.verificationMethod,
    serverSignature,
  };
}

/**
 * Validates a server-generated entitlement signature to ensure client has not tampered with expiry or product.
 */
export function verifyEntitlementSignature(entitlement: VerifiedEntitlementPayload): boolean {
  try {
    const signaturePayload = `${APP_PACKAGE_NAME}:${entitlement.productId}:${entitlement.orderId}:${entitlement.purchaseToken}:${entitlement.expiryTime}`;
    const expectedSignature = crypto
      .createHmac('sha256', SERVER_HMAC_SECRET)
      .update(signaturePayload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(entitlement.serverSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * Server-authoritative entitlement validator.
 * Validates cryptographic signature, package name, product ID whitelist,
 * and checks expiry against authoritative server UTC clock (Date.now()).
 */
export function validateEntitlementOnServer(
  entitlement: any,
  serverNowMs: number = Date.now()
): { valid: boolean; isExpired: boolean; reason?: string } {
  if (!entitlement || typeof entitlement !== 'object') {
    return { valid: false, isExpired: false, reason: 'Invalid entitlement payload' };
  }

  if (entitlement.packageName && entitlement.packageName !== APP_PACKAGE_NAME) {
    return { valid: false, isExpired: false, reason: 'Invalid package name' };
  }

  if (!ALLOWED_PRODUCT_IDS.includes(entitlement.productId)) {
    return { valid: false, isExpired: false, reason: 'Invalid product ID' };
  }

  if (!entitlement.serverSignature || typeof entitlement.serverSignature !== 'string') {
    return { valid: false, isExpired: false, reason: 'Missing server cryptographic signature' };
  }

  const signatureMatches = verifyEntitlementSignature(entitlement);
  if (!signatureMatches) {
    return { valid: false, isExpired: false, reason: 'Invalid or tampered entitlement signature' };
  }

  const expiryTimeMs = new Date(entitlement.expiryTime).getTime();
  if (isNaN(expiryTimeMs)) {
    return { valid: false, isExpired: false, reason: 'Invalid expiry date format' };
  }

  if (serverNowMs >= expiryTimeMs) {
    return { valid: true, isExpired: true, reason: 'Entitlement has expired according to authoritative server time' };
  }

  return { valid: true, isExpired: false };
}

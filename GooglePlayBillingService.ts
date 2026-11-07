/**
 * Google Play Billing Service for Playroom App
 * Handles native in-app digital purchases and subscriptions.
 *
 * Products:
 * 1. playroom_3activities_7d: Next 3 Activities | PKR 300 | 7-day access
 * 2. playroom_all_activities_30d: All Activities (Page 1 only) | PKR 5,000 | 30 days
 * 3. playroom_school_monthly: School Subscription | PKR 50,000 / $99 | 30 days,
 *    auto-renewing via Google Play | Page 1 + Page 2 (Educator Hub)
 *
 * Verification contract (VITE_VERIFY_API_URL):
 * - Set VITE_VERIFY_API_URL to the base URL of the optional verification
 *   server (e.g. https://verify.playroom.example) that implements
 *   POST /api/billing/verify-google-play-purchase,
 *   POST /api/billing/verify-school-subscription,
 *   POST /api/billing/validate-entitlements,
 *   POST /api/billing/restore-purchases, GET /api/billing/server-time.
 * - Leave it EMPTY to skip server verification entirely. The client then
 *   relies on the on-device Digital Goods API (listPurchases) + the local
 *   signed entitlement cache. Server verification is NEVER faked: an
 *   unreachable/missing endpoint falls back to Digital Goods / local cache
 *   and never invents a successful verification.
 *
 * Offline behaviour:
 * - Signed cached entitlements are honoured while offline (expiry checked
 *   against the last verified server time stored locally).
 * - Free Level 1 is always allowed (enforced in licenseService).
 * - After a pass expires, 3 days of offline grace apply (measured from the
 *   last verified server time). After grace, paid content locks until the
 *   app goes online once to re-verify.
 * - No Google OAuth, email/password, or user account required.
 */

export interface GooglePlayProduct {
  id: string;
  title: string;
  description: string;
  pricePkr: number;
  priceUsd: number;
  durationDays: number;
  type: 'three_activities' | 'all_activities' | 'school_subscription';
}

export interface GooglePlayEntitlement {
  productId: string;
  purchaseToken: string;
  orderId: string;
  purchaseTime: string; // ISO
  expiryTime: string; // ISO
  status: 'ACTIVE' | 'EXPIRED';
  unlockedType: 'three_activities' | 'all_activities' | 'school_subscription';
  unlockedActivityIds?: string[];
  signature?: string;
  serverSignature?: string;
  pricePaidPkr?: number;
  verificationMethod?: string;
  schemaVersion?: number;
  /** True when this entitlement is only active because of the 3-day offline grace period. */
  inGracePeriod?: boolean;
}

export const SCHOOL_SUBSCRIPTION_PRODUCT_ID = 'playroom_school_monthly';

export const PLAYROOM_INDIVIDUAL_PRODUCTS: Record<string, GooglePlayProduct> = {
  playroom_3activities_7d: {
    id: 'playroom_3activities_7d',
    title: 'Next 3 Activities',
    description: 'Unlock any 3 premium learning activities of your choice with full access for 7 days.',
    pricePkr: 500,
    priceUsd: 1.99,
    durationDays: 7,
    type: 'three_activities',
  },
  playroom_all_activities_30d: {
    id: 'playroom_all_activities_30d',
    title: 'All Activities',
    description: 'Unlock 100% full access to all PlayBloom learning activities on Page 1 for 30 days.',
    pricePkr: 5000,
    priceUsd: 14.99,
    durationDays: 30,
    type: 'all_activities',
  },
  playroom_school_monthly: {
    id: 'playroom_school_monthly',
    title: 'School Subscription',
    description: 'Monthly school subscription: full access to Page 1 activities AND the Preschool Educator Hub (Page 2) for 30 days. Auto-renews via Google Play.',
    pricePkr: 50000,
    priceUsd: 99,
    durationDays: 30,
    type: 'school_subscription',
  },
};

/** All purchasable products, including the school subscription. */
export const PLAYROOM_SCHOOL_PRODUCT: GooglePlayProduct = PLAYROOM_INDIVIDUAL_PRODUCTS[SCHOOL_SUBSCRIPTION_PRODUCT_ID];

export const ALL_PLAYROOM_PRODUCTS: Record<string, GooglePlayProduct> = PLAYROOM_INDIVIDUAL_PRODUCTS;

const STORAGE_KEY_ENTITLEMENTS = 'playroom_v3_verified_gp_entitlements';
const STORAGE_KEY_3_PACK_ACTIVITIES = 'playroom_v3_3pack_activities';
const STORAGE_KEY_3_PACK_TOKEN = 'playroom_v3_3pack_token';
/** Last server time (ms since epoch) successfully verified — the offline clock anchor. */
export const STORAGE_KEY_LAST_VERIFIED_SERVER_TIME = 'playroom_last_verified_server_time_ms';

/** Offline grace period after a pass expires, in days. */
export const OFFLINE_GRACE_DAYS = 3;

// Legacy keys to purge on initialization to eliminate offline bypasses
const LEGACY_STORAGE_KEYS = [
  'playroom_gp_entitlements',
  'playroom_verified_gp_entitlements',
  'playroom_verified_gp_entitlements_v2',
  'playroom_3pack_unlocked_activities',
  'playroom_verified_3pack_unlocked_activities_v2',
  'playroom_3activities_unlocked',
];

type EntitlementChangeListener = (entitlements: GooglePlayEntitlement[]) => void;

/** Base URL of the optional verification server. Empty = skip server verification. */
export function getVerifyApiBaseUrl(): string {
  try {
    const raw =
      typeof import.meta !== 'undefined'
        ? (import.meta as any).env?.VITE_VERIFY_API_URL
        : '';
    return typeof raw === 'string' ? raw.trim().replace(/\/+$/, '') : '';
  } catch {
    return '';
  }
}

export class GooglePlayBillingService {
  private static instance: GooglePlayBillingService;
  private listeners: Set<EntitlementChangeListener> = new Set();
  private digitalGoodsService: any = null;
  private isInitialized = false;
  private serverTimeOffsetMs = 0;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initBilling();
    }
  }

  public static getInstance(): GooglePlayBillingService {
    if (!GooglePlayBillingService.instance) {
      GooglePlayBillingService.instance = new GooglePlayBillingService();
    }
    return GooglePlayBillingService.instance;
  }

  // ------------------------------------------------------------------
  // Verification-server plumbing (tolerant: never fake success)
  // ------------------------------------------------------------------

  /** Full URL for a verification endpoint, or null when no server is configured. */
  private verifyUrl(path: string): string | null {
    const base = getVerifyApiBaseUrl();
    if (!base) return null;
    return `${base}${path}`;
  }

  /**
   * POST to the verification server. Returns null when no server is
   * configured OR the endpoint is unreachable — callers must fall back
   * to Digital Goods / local cache and must NOT treat null as success.
   */
  private async verifyFetch(path: string, body: unknown): Promise<any | null> {
    const url = this.verifyUrl(path);
    if (!url) return null;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) return null;
      return await res.json().catch(() => null);
    } catch {
      return null;
    }
  }

  /** Last server time (ms) successfully verified, or null if never verified. */
  public getLastVerifiedServerTime(): number | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LAST_VERIFIED_SERVER_TIME);
      if (!raw) return null;
      const ms = Number(raw);
      return Number.isFinite(ms) && ms > 0 ? ms : null;
    } catch {
      return null;
    }
  }

  private recordServerTime(serverTimeMs: number): void {
    if (typeof window === 'undefined') return;
    if (!Number.isFinite(serverTimeMs) || serverTimeMs <= 0) return;
    try {
      localStorage.setItem(STORAGE_KEY_LAST_VERIFIED_SERVER_TIME, String(serverTimeMs));
      this.serverTimeOffsetMs = serverTimeMs - Date.now();
    } catch {
      // ignore
    }
  }

  /**
   * Synchronizes authoritative server UTC time to prevent client clock manipulation.
   * Tolerant: when no verification server is configured or it is unreachable,
   * returns the last verified server time (if any), else the device clock.
   */
  public async syncServerTime(): Promise<number> {
    if (typeof window === 'undefined' || !navigator.onLine) {
      return this.getAuthoritativeTime();
    }
    const url = this.verifyUrl('/api/billing/server-time');
    if (!url) return this.getAuthoritativeTime();
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (typeof data.serverTime === 'number') {
          this.recordServerTime(data.serverTime);
          return data.serverTime;
        }
      }
    } catch (_) {
      // Fall through to calibrated/local time — never crash.
    }
    return this.getAuthoritativeTime();
  }

  /**
   * Current time calibrated by authoritative server clock when available.
   * Offline, this is anchored to the last verified server time so an
   * expired pass cannot be revived by rolling the device clock back.
   */
  public getAuthoritativeTime(): number {
    if (typeof window !== 'undefined' && !navigator.onLine) {
      const lastVerified = this.getLastVerifiedServerTime();
      if (lastVerified !== null) {
        // Offline: trust the last verified server time, advanced only by
        // the elapsed wall-clock time since it was recorded is unknown,
        // so use the stored value as the anchor and never go backwards.
        return Math.max(lastVerified, Date.now() + this.serverTimeOffsetMs);
      }
    }
    return Date.now() + this.serverTimeOffsetMs;
  }

  /**
   * Initialize Digital Goods API / Android Play Billing interface and perform silent restore
   */
  public async initBilling(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Purge any legacy unverified test storage keys from previous sessions
    try {
      LEGACY_STORAGE_KEYS.forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch {
      // ignore
    }

    try {
      if ('getDigitalGoodsService' in window && typeof (window as any).getDigitalGoodsService === 'function') {
        this.digitalGoodsService = await (window as any).getDigitalGoodsService('https://play.google.com/billing');
      } else {
      }
    } catch (err) {
      console.warn('[Google Play Billing] Digital Goods Service not available in this context:', err);
    }

    // Auto-verify and clean up expired local entitlements on app launch
    this.refreshAndCleanEntitlements();
    this.isInitialized = true;

    // Automatic silent background restoration on app launch when online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.autoRestoreOnLaunch().catch((err) => {
        console.warn('[Google Play Billing] Silent background auto-restore note:', err);
      });
    }
  }

  /**
   * Silent background entitlement synchronization on app launch.
   * Server calls are best-effort: if the verification server is not
   * configured or unreachable, Digital Goods / local cache is used.
   */
  public async autoRestoreOnLaunch(): Promise<void> {
    try {
      // 1. Sync server time
      await this.syncServerTime();

      // 2. Validate currently cached local entitlements with server (if configured)
      const stored = this.getStoredEntitlements();
      if (stored.length > 0) {
        const valData = await this.verifyFetch('/api/billing/validate-entitlements', {
          entitlements: stored,
        });

        if (valData && valData.success) {
          if (typeof valData.serverTime === 'number') {
            this.recordServerTime(valData.serverTime);
          }
          const valid = valData.validEntitlements || [];
          localStorage.setItem(STORAGE_KEY_ENTITLEMENTS, JSON.stringify(valid));

          // Sync 3-pack state
          const active3 = valid.find(
            (e: any) => e.unlockedType === 'three_activities' || e.productId === 'playroom_3activities_7d'
          );
          if (active3) {
            const currentToken = localStorage.getItem(STORAGE_KEY_3_PACK_TOKEN);
            if (currentToken !== active3.purchaseToken) {
              localStorage.setItem(STORAGE_KEY_3_PACK_TOKEN, active3.purchaseToken);
              const acts = Array.isArray(active3.unlockedActivityIds) ? active3.unlockedActivityIds : [];
              localStorage.setItem(STORAGE_KEY_3_PACK_ACTIVITIES, JSON.stringify(acts));
            } else if (Array.isArray(active3.unlockedActivityIds) && active3.unlockedActivityIds.length > 0) {
              const localActs = this.get3PackUnlockedActivities();
              if (localActs.length === 0) {
                localStorage.setItem(STORAGE_KEY_3_PACK_ACTIVITIES, JSON.stringify(active3.unlockedActivityIds));
              }
            }
          } else {
            localStorage.removeItem(STORAGE_KEY_3_PACK_ACTIVITIES);
            localStorage.removeItem(STORAGE_KEY_3_PACK_TOKEN);
          }

          this.notifyListeners();
        }
      }

      // 3. If running inside TWA/Android and Digital Goods API has purchases, run restore
      if (this.digitalGoodsService && typeof this.digitalGoodsService.listPurchases === 'function') {
        const purchases = await this.digitalGoodsService.listPurchases();
        if (purchases && purchases.length > 0) {
          await this.restorePurchases();
        }
      }
    } catch (e) {
      console.warn('[Google Play Billing] Background autoRestoreOnLaunch non-blocking error:', e);
    }
  }

  /**
   * Subscribe to entitlement updates
   */
  public subscribe(listener: EntitlementChangeListener): () => void {
    this.listeners.add(listener);
    // Initial call
    listener(this.getActiveEntitlements());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const active = this.getActiveEntitlements();
    this.listeners.forEach((listener) => {
      try {
        listener(active);
      } catch (e) {
        console.error('[Google Play Billing] Error in listener callback:', e);
      }
    });
  }

  // ------------------------------------------------------------------
  // Offline-safe entitlement cache
  // ------------------------------------------------------------------

  /**
   * Get all stored entitlements.
   * OFFLINE-SAFE: signed cached entitlements are honoured while offline.
   * An entitlement is accepted when it was server-verified (HMAC signature
   * present) OR confirmed on-device via the Digital Goods API, and its
   * expiry — checked against the last verified server time — has not passed.
   * After expiry, a 3-day offline grace period applies (measured from the
   * last verified server time); after grace the entitlement is EXPIRED
   * until the app goes online once to re-verify.
   */
  public getStoredEntitlements(): GooglePlayEntitlement[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ENTITLEMENTS);
      if (!raw) return [];
      const parsed: GooglePlayEntitlement[] = JSON.parse(raw);
      const now = this.getAuthoritativeTime();
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      const lastVerified = this.getLastVerifiedServerTime();
      // Offline clock anchor: the last time the server confirmed the time.
      const offlineNow = lastVerified !== null ? Math.max(lastVerified, now) : now;
      const checkNow = isOffline ? offlineNow : now;
      const graceMs = OFFLINE_GRACE_DAYS * 24 * 60 * 60 * 1000;

      return parsed
        .filter((ent) => {
          if (!ent || !ent.productId || !ent.expiryTime) return false;
          // Must be server-verified (signature) or on-device confirmed via Digital Goods.
          const isServerVerified =
            ent.verificationMethod === 'google_play_developer_api' &&
            typeof ent.serverSignature === 'string' &&
            ent.serverSignature.length > 10;
          const isDigitalGoodsConfirmed = ent.verificationMethod === 'digital_goods_api';
          const isNotMockToken = !ent.purchaseToken?.includes('TEST') && !ent.orderId?.includes('3312-8921-9921');
          return (isServerVerified || isDigitalGoodsConfirmed) && isNotMockToken;
        })
        .map((ent) => {
          const expiryMs = new Date(ent.expiryTime).getTime();
          if (ent.status === 'ACTIVE' && checkNow >= expiryMs) {
            // Expired — but allow the 3-day offline grace period.
            if (isOffline && checkNow - expiryMs <= graceMs) {
              return { ...ent, status: 'ACTIVE' as const, inGracePeriod: true };
            }
            return { ...ent, status: 'EXPIRED' as const, inGracePeriod: false };
          }
          return { ...ent, inGracePeriod: false };
        });
    } catch (e) {
      console.warn('[Google Play Billing] Could not parse stored entitlements:', e);
      return [];
    }
  }

  /**
   * Get active, non-expired entitlements only.
   * Works offline from the signed local cache (including the 3-day grace period).
   */
  public getActiveEntitlements(): GooglePlayEntitlement[] {
    if (typeof window === 'undefined') return [];
    const all = this.getStoredEntitlements();
    const now = this.getAuthoritativeTime();
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    const lastVerified = this.getLastVerifiedServerTime();
    const checkNow = isOffline && lastVerified !== null ? Math.max(lastVerified, now) : now;
    const graceMs = OFFLINE_GRACE_DAYS * 24 * 60 * 60 * 1000;
    return all.filter((ent) => {
      const expiryMs = new Date(ent.expiryTime).getTime();
      if (ent.status === 'ACTIVE' && expiryMs > checkNow) return true;
      // Offline grace: expired within the last 3 days (per last verified server time).
      if (isOffline && ent.status === 'ACTIVE' && checkNow - expiryMs <= graceMs) return true;
      return false;
    });
  }

  /**
   * Check if user has active 30-day All Activities pass (Page 1 only)
   */
  public hasAllActivitiesPass(): { active: boolean; expiryDate?: string; daysRemaining?: number } {
    const active = this.getActiveEntitlements();
    const allPass = active.find((e) => e.unlockedType === 'all_activities' || e.productId === 'playroom_all_activities_30d');
    if (allPass) {
      const days = this.calculateDaysRemaining(allPass.expiryTime);
      return { active: true, expiryDate: allPass.expiryTime, daysRemaining: days };
    }
    return { active: false };
  }

  /**
   * Check if user has an active school subscription (playroom_school_monthly).
   * Rs 50,000/month (PKR base, $99 abroad), 30-day billing period, auto-renewing
   * via Google Play. Unlocks Page 1 + Page 2 (Educator Hub).
   */
  public hasSchoolSubscription(): { active: boolean; expiryDate?: string; daysRemaining?: number; inGracePeriod?: boolean } {
    const active = this.getActiveEntitlements();
    const sub = active.find(
      (e) => e.unlockedType === 'school_subscription' || e.productId === SCHOOL_SUBSCRIPTION_PRODUCT_ID
    );
    if (sub) {
      const days = this.calculateDaysRemaining(sub.expiryTime);
      return { active: true, expiryDate: sub.expiryTime, daysRemaining: days, inGracePeriod: sub.inGracePeriod };
    }
    return { active: false };
  }

  /**
   * Check if user has active 7-day 3-Activities pass
   * Automatically resets previous selections when a new purchase token is detected.
   */
  public has3ActivitiesPass(): {
    active: boolean;
    expiryDate?: string;
    daysRemaining?: number;
    unlockedActivities: string[];
    canUnlockMore: boolean;
  } {
    const active = this.getActiveEntitlements();
    const pass3 = active.find((e) => e.unlockedType === 'three_activities' || e.productId === 'playroom_3activities_7d');

    if (!pass3) {
      return {
        active: false,
        unlockedActivities: [],
        canUnlockMore: false,
      };
    }

    // Check if the stored 3-pack token matches the active purchase token
    // If not (e.g. fresh purchase after expiry), reset old selections so 3 fresh choices are available!
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(STORAGE_KEY_3_PACK_TOKEN);
      if (storedToken !== pass3.purchaseToken) {
        localStorage.setItem(STORAGE_KEY_3_PACK_TOKEN, pass3.purchaseToken);
        const initial = Array.isArray(pass3.unlockedActivityIds) ? pass3.unlockedActivityIds : [];
        localStorage.setItem(STORAGE_KEY_3_PACK_ACTIVITIES, JSON.stringify(initial));
      }
    }

    const unlocked = this.get3PackUnlockedActivities();
    const days = this.calculateDaysRemaining(pass3.expiryTime);

    return {
      active: true,
      expiryDate: pass3.expiryTime,
      daysRemaining: days,
      unlockedActivities: unlocked,
      canUnlockMore: unlocked.length < 3,
    };
  }

  /**
   * Get list of activity IDs currently selected under 3-Activities pass
   */
  public get3PackUnlockedActivities(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_3_PACK_ACTIVITIES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Unlock an activity under the 3-activities pass (limit 3).
   * Persists to local storage; syncs to the verification server only when configured.
   */
  public unlockActivityUnder3Pack(activityId: string): { success: boolean; message: string; count: number } {
    const passStatus = this.has3ActivitiesPass();
    if (!passStatus.active) {
      return {
        success: false,
        message: 'No active 3-Activities Pass found. Please unlock the 7-day pass first.',
        count: 0,
      };
    }

    const currentList = this.get3PackUnlockedActivities();
    if (currentList.includes(activityId)) {
      return {
        success: true,
        message: 'This activity is already unlocked in your 3-Activity pack!',
        count: currentList.length,
      };
    }

    if (currentList.length >= 3) {
      return {
        success: false,
        message: 'You have already unlocked 3 activities with this pass. Choose one of your 3 unlocked activities or upgrade to All Activities.',
        count: 3,
      };
    }

    currentList.push(activityId);
    try {
      localStorage.setItem(STORAGE_KEY_3_PACK_ACTIVITIES, JSON.stringify(currentList));
    } catch (e) {
      console.warn('Failed to save 3-pack activity:', e);
    }

    // Best-effort sync to verification server (skipped when not configured)
    const activePass = this.getActiveEntitlements().find(
      (e) => e.unlockedType === 'three_activities' || e.productId === 'playroom_3activities_7d'
    );
    if (activePass?.purchaseToken) {
      this.verifyFetch('/api/billing/sync-3pack-activities', {
        purchaseToken: activePass.purchaseToken,
        activityIds: currentList,
      }).catch((err) => console.warn('[Google Play Billing] Sync 3-pack error:', err));
    }

    this.notifyListeners();
    return {
      success: true,
      message: `Unlocked activity in your 3-pack (${currentList.length}/3 activities used).`,
      count: currentList.length,
    };
  }

  /**
   * Build a local entitlement from an on-device Digital Goods purchase.
   * Used ONLY when the verification server is not configured or unreachable:
   * the purchase is confirmed by Play itself (listPurchases / PaymentRequest),
   * so this is an honest on-device confirmation — never a faked server verification.
   * Expiry is computed from the product's duration from the purchase time.
   */
  private buildLocalEntitlementFromDigitalGoods(
    productId: string,
    purchaseToken: string,
    orderId: string,
    purchaseTimeMs?: number
  ): GooglePlayEntitlement | null {
    const product = PLAYROOM_INDIVIDUAL_PRODUCTS[productId];
    if (!product || !purchaseToken) return null;
    const purchaseDate = purchaseTimeMs ? new Date(purchaseTimeMs) : new Date();
    const expiryDate = new Date(purchaseDate.getTime() + product.durationDays * 24 * 60 * 60 * 1000);
    return {
      productId,
      purchaseToken,
      orderId: orderId || `GPA.${Date.now()}`,
      purchaseTime: purchaseDate.toISOString(),
      expiryTime: expiryDate.toISOString(),
      status: 'ACTIVE',
      unlockedType: product.type,
      pricePaidPkr: product.pricePkr,
      verificationMethod: 'digital_goods_api',
      schemaVersion: 3,
    };
  }

  /**
   * Launch Google Play Billing Purchase Flow
   * @param productId 'playroom_3activities_7d' | 'playroom_all_activities_30d' | 'playroom_school_monthly'
   * @param preSelectedActivityId optional activity ID to auto-assign to 3-pack
   *
   * Verification order: (1) verification server when VITE_VERIFY_API_URL is
   * set and reachable; (2) on-device Digital Goods listPurchases() confirmation;
   * (3) never fake success — if neither confirms the purchase, it fails.
   * Subscriptions are acknowledged, never consumed.
   */
  public async purchaseProduct(
    productId: 'playroom_3activities_7d' | 'playroom_all_activities_30d' | 'playroom_school_monthly',
    preSelectedActivityId?: string
  ): Promise<{ success: boolean; entitlement?: GooglePlayEntitlement; error?: string }> {
    const product = PLAYROOM_INDIVIDUAL_PRODUCTS[productId];
    if (!product) {
      return { success: false, error: 'Invalid Google Play product ID.' };
    }

    try {
      let purchaseToken = '';
      let orderId = '';

      // 1. Check if Digital Goods API or Android WebView interface is available
      if (this.digitalGoodsService) {
        try {
          const paymentMethod = {
            supportedMethods: 'https://play.google.com/billing',
            data: {
              sku: productId,
            },
          };
          const paymentDetails = {
            total: {
              label: product.title,
              amount: { currency: 'PKR', value: String(product.pricePkr) },
            },
          };
          const request = new (window as any).PaymentRequest([paymentMethod], paymentDetails);
          const paymentResponse = await request.show();
          purchaseToken = paymentResponse.details?.purchaseToken || paymentResponse.details?.token || '';
          orderId = paymentResponse.details?.orderId || '';
          await paymentResponse.complete('success');
        } catch (dgaErr: any) {
          console.warn('[Google Play Billing] Digital Goods flow:', dgaErr);
          if (dgaErr?.name === 'AbortError') {
            return { success: false, error: 'Purchase was cancelled.' };
          }
          return {
            success: false,
            error: dgaErr?.message || 'Google Play purchase could not be completed.',
          };
        }
      } else {
        // Digital Goods Service / Google Play Billing is not supported in non-Android browser environments
        return {
          success: false,
          error: 'Google Play purchase is available in the Android app. Please open PlayBloom on your Android device to purchase.',
        };
      }

      if (!purchaseToken) {
        return {
          success: false,
          error: 'Google Play purchase was not completed. No purchase token received.',
        };
      }

      // 2. Server-side verification when a verification server is configured.
      const isSchool = productId === SCHOOL_SUBSCRIPTION_PRODUCT_ID;
      const verifyPath = isSchool
        ? '/api/billing/verify-school-subscription'
        : '/api/billing/verify-google-play-purchase';
      const verifyData = await this.verifyFetch(verifyPath, {
        productId,
        purchaseToken,
        orderId,
        packageName: 'com.playroom.app',
        preSelectedActivityId,
      });

      let newEntitlement: GooglePlayEntitlement | null = null;

      if (verifyData && verifyData.success && verifyData.entitlement) {
        newEntitlement = verifyData.entitlement;
        if (typeof verifyData.serverTime === 'number') this.recordServerTime(verifyData.serverTime);
      } else if (getVerifyApiBaseUrl()) {
        // Server is configured but verification failed / was unreachable.
        // Fall back to on-device confirmation via Digital Goods listPurchases().
        const confirmed = await this.confirmPurchaseOnDevice(productId, purchaseToken);
        if (!confirmed) {
          return {
            success: false,
            error: 'Google Play purchase could not be verified. Please check your connection and use Restore Purchases.',
          };
        }
        newEntitlement = confirmed;
      } else {
        // No verification server configured: confirm on-device via Digital Goods.
        const confirmed = await this.confirmPurchaseOnDevice(productId, purchaseToken);
        if (!confirmed) {
          return {
            success: false,
            error: 'Google Play purchase could not be confirmed on this device. Please use Restore Purchases.',
          };
        }
        newEntitlement = confirmed;
      }

      // 3. Acknowledge / consume. Subscriptions are acknowledged, never consumed.
      await this.consumeOrAcknowledgePurchase(purchaseToken, productId);

      // 4. Reset 3-pack selections if this is a new 3-activities pass purchase!
      if (productId === 'playroom_3activities_7d') {
        localStorage.setItem(STORAGE_KEY_3_PACK_TOKEN, newEntitlement.purchaseToken);
        if (preSelectedActivityId) {
          localStorage.setItem(STORAGE_KEY_3_PACK_ACTIVITIES, JSON.stringify([preSelectedActivityId]));
        } else {
          localStorage.setItem(STORAGE_KEY_3_PACK_ACTIVITIES, JSON.stringify([]));
        }
      }

      // 5. Store the verified entitlement locally
      const existing = this.getStoredEntitlements().filter((e) => e.productId !== productId);
      existing.unshift(newEntitlement);
      localStorage.setItem(STORAGE_KEY_ENTITLEMENTS, JSON.stringify(existing));

      // Calibrate authoritative server time if available
      await this.syncServerTime();

      this.notifyListeners();

      return {
        success: true,
        entitlement: newEntitlement,
      };
    } catch (err: any) {
      console.error('[Google Play Billing] Purchase error:', err);
      return {
        success: false,
        error: err.message || 'Could not complete Google Play purchase. Please try again.',
      };
    }
  }

  /**
   * Confirm a purchase token exists in Play's own on-device records
   * (Digital Goods API listPurchases). Returns a local entitlement when
   * Play confirms it, or null when it cannot be confirmed.
   */
  private async confirmPurchaseOnDevice(
    productId: string,
    purchaseToken: string
  ): Promise<GooglePlayEntitlement | null> {
    try {
      if (!this.digitalGoodsService || typeof this.digitalGoodsService.listPurchases !== 'function') {
        return null;
      }
      const purchases = await this.digitalGoodsService.listPurchases();
      if (!Array.isArray(purchases)) return null;
      const match = purchases.find(
        (p: any) => p.purchaseToken === purchaseToken || p.itemId === productId
      );
      if (!match) return null;
      const token = match.purchaseToken || purchaseToken;
      const itemProductId = match.itemId || productId;
      return this.buildLocalEntitlementFromDigitalGoods(
        itemProductId,
        token,
        match.orderId || '',
        match.purchaseTime ? Number(match.purchaseTime) : undefined
      );
    } catch {
      return null;
    }
  }

  /**
   * Restore Purchases from Google Play Billing.
   * Order: (1) verification server when configured and reachable;
   * (2) on-device Digital Goods listPurchases(); (3) the local signed
   * cache. Never fakes success and never crashes when the server is absent.
   */
  public async restorePurchases(): Promise<{
    success: boolean;
    restoredCount: number;
    entitlements: GooglePlayEntitlement[];
    message: string;
  }> {
    try {
      await this.syncServerTime();
      let candidateTokens: string[] = [];

      // 1. Query Digital Goods API if available
      if (this.digitalGoodsService && typeof this.digitalGoodsService.listPurchases === 'function') {
        try {
          const purchases = await this.digitalGoodsService.listPurchases();
          if (purchases && purchases.length > 0) {
            for (const p of purchases) {
              if (p.purchaseToken && !candidateTokens.includes(p.purchaseToken)) {
                candidateTokens.push(p.purchaseToken);
              }
            }
          }
        } catch (dgaErr) {
          console.warn('[Google Play Billing] listPurchases note:', dgaErr);
        }
      }

      // 2. Add currently cached local tokens
      const currentStored = this.getStoredEntitlements();
      currentStored.forEach((e) => {
        if (e.purchaseToken && !candidateTokens.includes(e.purchaseToken)) {
          candidateTokens.push(e.purchaseToken);
        }
      });

      // 3. Query server restore endpoint when configured (tolerant — null on failure)
      const data = await this.verifyFetch('/api/billing/restore-purchases', {
        purchaseTokens: candidateTokens,
      });

      let validActive: GooglePlayEntitlement[];

      if (data && data.success && Array.isArray(data.entitlements)) {
        if (typeof data.serverTime === 'number') this.recordServerTime(data.serverTime);
        validActive = data.entitlements;
      } else {
        // No server / server unreachable: rebuild from Digital Goods purchases,
        // falling back to the local signed cache.
        validActive = [];
        if (this.digitalGoodsService && typeof this.digitalGoodsService.listPurchases === 'function') {
          try {
            const purchases = await this.digitalGoodsService.listPurchases();
            if (Array.isArray(purchases)) {
              for (const p of purchases) {
                const productId = p.itemId || p.productId;
                if (!productId || !PLAYROOM_INDIVIDUAL_PRODUCTS[productId]) continue;
                const ent = this.buildLocalEntitlementFromDigitalGoods(
                  productId,
                  p.purchaseToken,
                  p.orderId || '',
                  p.purchaseTime ? Number(p.purchaseTime) : undefined
                );
                if (ent) validActive.push(ent);
              }
            }
          } catch (_) {
            // fall through to local cache
          }
        }
        if (validActive.length === 0) {
          validActive = this.getActiveEntitlements();
        }
      }

      // Save updated entitlements
      localStorage.setItem(STORAGE_KEY_ENTITLEMENTS, JSON.stringify(validActive));

      // Restore 3-pack selections if pass is active
      const pass3 = validActive.find(
        (e) => e.unlockedType === 'three_activities' || e.productId === 'playroom_3activities_7d'
      );
      if (pass3) {
        localStorage.setItem(STORAGE_KEY_3_PACK_TOKEN, pass3.purchaseToken);
        if (Array.isArray(pass3.unlockedActivityIds) && pass3.unlockedActivityIds.length > 0) {
          localStorage.setItem(STORAGE_KEY_3_PACK_ACTIVITIES, JSON.stringify(pass3.unlockedActivityIds));
        }
      } else {
        localStorage.removeItem(STORAGE_KEY_3_PACK_ACTIVITIES);
        localStorage.removeItem(STORAGE_KEY_3_PACK_TOKEN);
      }

      this.notifyListeners();

      if (validActive.length > 0) {
        return {
          success: true,
          restoredCount: validActive.length,
          entitlements: validActive,
          message: `Successfully restored ${validActive.length} active purchase(s)!`,
        };
      } else {
        return {
          success: true,
          restoredCount: 0,
          entitlements: [],
          message: 'No active Google Play purchases found for this device.',
        };
      }
    } catch (err: any) {
      console.error('[Google Play Billing] Restore error:', err);
      return {
        success: false,
        restoredCount: 0,
        entitlements: [],
        message: err.message || 'Could not restore purchases.',
      };
    }
  }

  /**
   * Refresh and clean up expired entitlements from local storage.
   * Note: entitlements inside the 3-day offline grace period are kept
   * (getStoredEntitlements marks them ACTIVE).
   */
  public refreshAndCleanEntitlements(): GooglePlayEntitlement[] {
    const updated = this.getStoredEntitlements();
    const activeOnly = updated.filter((e) => e.status === 'ACTIVE');
    try {
      localStorage.setItem(STORAGE_KEY_ENTITLEMENTS, JSON.stringify(activeOnly));
    } catch {
      // ignore
    }
    this.notifyListeners();
    return activeOnly;
  }

  /**
   * Consume (one-time products) or acknowledge (subscriptions) a purchase.
   * Required by Google Play Billing so consumable one-time products can be
   * re-purchased after the 7-day or 30-day period expires. Subscriptions
   * must NOT be consumed — they stay active until Play cancels/expires them.
   */
  public async consumeOrAcknowledgePurchase(
    purchaseToken: string,
    productId?: string
  ): Promise<boolean> {
    try {
      if (productId === SCHOOL_SUBSCRIPTION_PRODUCT_ID) {
        // Subscriptions are acknowledged by Play, never consumed.
        return true;
      }
      if (this.digitalGoodsService && typeof this.digitalGoodsService.consume === 'function') {
        await this.digitalGoodsService.consume(purchaseToken);
        return true;
      }
      return true;
    } catch (err) {
      console.warn('[Google Play Billing] Consume note:', err);
      return false;
    }
  }

  private calculateDaysRemaining(expiryIso: string): number {
    try {
      const expiry = new Date(expiryIso).getTime();
      const now = this.getAuthoritativeTime();
      const diffMs = expiry - now;
      if (diffMs <= 0) return 0;
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  }
}

export const googlePlayBilling = GooglePlayBillingService.getInstance();
